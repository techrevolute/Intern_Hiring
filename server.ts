import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'intern_applications.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

interface StoredResume {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  base64Data: string;
}

interface StoredInternApplication {
  id: string;
  submittedAt: string;
  status: string;
  sheetSynced: boolean;
  fullName: string;
  email: string;
  mobileNumber: string;
  location: string;
  linkedinUrl: string;
  academicStatus: string;
  highestQualification: string;
  collegeName: string;
  graduationYear: string;
  workMode: string;
  internshipType: string;
  internshipDuration: string;
  technicalTools: string[];
  proficiencyLevel: string;
  hasBuiltProjects: string;
  portfolioUrl: string;
  projectDescription: string;
  reasonToJoin: string;
  startDate: string;
  preferredSlots: string[];
  consentConfirmed: boolean;
  resume?: StoredResume;
}

interface StoredSettings {
  appsScriptUrl: string;
}

function ensureDataDirectory(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    const initialSettings: StoredSettings = {
      appsScriptUrl: process.env.APPS_SCRIPT_WEBHOOK_URL || '',
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(initialSettings, null, 2), 'utf-8');
  }
}

function readApplications(): StoredInternApplication[] {
  ensureDataDirectory();
  try {
    const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeApplications(apps: StoredInternApplication[]): void {
  ensureDataDirectory();
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}

function readSettings(): StoredSettings {
  ensureDataDirectory();
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      appsScriptUrl:
        typeof parsed?.appsScriptUrl === 'string' && parsed.appsScriptUrl.trim() !== ''
          ? parsed.appsScriptUrl.trim()
          : process.env.APPS_SCRIPT_WEBHOOK_URL || '',
    };
  } catch {
    return { appsScriptUrl: process.env.APPS_SCRIPT_WEBHOOK_URL || '' };
  }
}

function writeSettings(settings: StoredSettings): void {
  ensureDataDirectory();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

function generateApplicationId(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `AIS-2026-${randomDigits}`;
}

async function startServer() {
  ensureDataDirectory();
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '20mb' }));

  // Submit a new Data Analyst Intern application
  app.post('/api/applications', async (req: Request, res: Response) => {
    try {
      const body = req.body || {};
      const fullName = String(body.fullName || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const mobileNumber = String(body.mobileNumber || '').trim();
      const location = String(body.location || '').trim();

      if (!fullName || !email || !mobileNumber || !location) {
        res.status(400).json({
          status: 'error',
          message: 'Please complete all required personal details before submitting.',
        });
        return;
      }

      if (!body.resume || !body.resume.base64Data || !body.resume.fileName) {
        res.status(400).json({
          status: 'error',
          message: 'Please attach your Resume / CV (PDF, DOC, or DOCX) to complete your application.',
        });
        return;
      }

      const applicationId = generateApplicationId();
      const submittedAt = new Date().toISOString();

      const newRecord: StoredInternApplication = {
        id: applicationId,
        submittedAt,
        status: 'Application Submitted — AptiQuest Pending',
        sheetSynced: false,
        fullName,
        email,
        mobileNumber,
        location,
        linkedinUrl: String(body.linkedinUrl || '').trim(),
        academicStatus: String(body.academicStatus || '').trim(),
        highestQualification: String(body.highestQualification || '').trim(),
        collegeName: String(body.collegeName || '').trim(),
        graduationYear: String(body.graduationYear || '').trim(),
        workMode: String(body.workMode || '').trim(),
        internshipType: String(body.internshipType || '').trim(),
        internshipDuration: String(body.internshipDuration || '').trim(),
        technicalTools: Array.isArray(body.technicalTools)
          ? body.technicalTools.map((t: unknown) => String(t))
          : [],
        proficiencyLevel: String(body.proficiencyLevel || '').trim(),
        hasBuiltProjects: String(body.hasBuiltProjects || '').trim(),
        portfolioUrl: String(body.portfolioUrl || '').trim(),
        projectDescription: String(body.projectDescription || '').trim(),
        reasonToJoin: String(body.reasonToJoin || '').trim(),
        startDate: String(body.startDate || '').trim(),
        preferredSlots: Array.isArray(body.preferredSlots)
          ? body.preferredSlots.map((s: unknown) => String(s))
          : [],
        consentConfirmed: Boolean(body.consentConfirmed),
        resume: {
          fileName: String(body.resume.fileName),
          mimeType: String(body.resume.mimeType || 'application/pdf'),
          sizeBytes: Number(body.resume.sizeBytes || 0),
          base64Data: String(body.resume.base64Data),
        },
      };

      // Optional Google Apps Script forwarding if configured
      const settings = readSettings();
      if (settings.appsScriptUrl && settings.appsScriptUrl.startsWith('https://script.google.com/')) {
        try {
          const webhookPayload = {
            applicationId: newRecord.id,
            roleApplied: 'Data Analyst Intern',
            submittedAt: newRecord.submittedAt,
            fullName: newRecord.fullName,
            email: newRecord.email,
            emailAddress: newRecord.email,
            mobileNumber: newRecord.mobileNumber,
            location: newRecord.location,
            linkedinUrl: newRecord.linkedinUrl,
            academicStatus: newRecord.academicStatus,
            highestQualification: newRecord.highestQualification,
            collegeName: newRecord.collegeName,
            graduationYear: newRecord.graduationYear,
            workMode: newRecord.workMode,
            engagementType: newRecord.internshipType,
            internshipDuration: newRecord.internshipDuration,
            technicalTools: newRecord.technicalTools,
            analyticsExpertise: newRecord.proficiencyLevel,
            realWorldProjects: newRecord.hasBuiltProjects,
            portfolioUrl: newRecord.portfolioUrl,
            projectDescription: newRecord.projectDescription,
            reasonToJoin: newRecord.reasonToJoin,
            startDate: newRecord.startDate,
            trainingAvailability: newRecord.preferredSlots,
            consentConfirm: newRecord.consentConfirmed,
            resume: {
              fileName: newRecord.resume?.fileName,
              mimeType: newRecord.resume?.mimeType,
              data: newRecord.resume?.base64Data,
            },
          };

          const webhookRes = await fetch(settings.appsScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(webhookPayload),
          });

          if (webhookRes.ok) {
            newRecord.sheetSynced = true;
          }
        } catch (webhookErr) {
          console.warn('Optional Apps Script sync skipped or failed:', webhookErr);
        }
      }

      const existing = readApplications();
      existing.unshift(newRecord);
      writeApplications(existing);

      res.status(201).json({
        status: 'success',
        applicationId: newRecord.id,
        submittedAt: newRecord.submittedAt,
        sheetSynced: newRecord.sheetSynced,
        applicantName: newRecord.fullName,
        email: newRecord.email,
        mobileNumber: newRecord.mobileNumber,
        highestQualification: newRecord.highestQualification,
        workMode: newRecord.workMode,
        internshipType: newRecord.internshipType,
        internshipDuration: newRecord.internshipDuration,
      });
    } catch (err) {
      console.error('Error saving intern application:', err);
      res.status(500).json({
        status: 'error',
        message: 'Unable to process your application right now. Please try again.',
      });
    }
  });

  // Candidate status lookup by Application ID or Email
  app.get('/api/applications/lookup', (req: Request, res: Response) => {
    const query = String(req.query.query || '').trim().toLowerCase();
    if (!query) {
      res.status(400).json({ status: 'error', message: 'Please enter your Application ID or Email Address.' });
      return;
    }

    const apps = readApplications();
    const matches = apps
      .filter((a) => a.id.toLowerCase() === query || a.email.toLowerCase() === query)
      .map((a) => ({
        id: a.id,
        submittedAt: a.submittedAt,
        status: a.status,
        fullName: a.fullName,
        email: a.email,
        workMode: a.workMode,
        internshipType: a.internshipType,
        internshipDuration: a.internshipDuration,
        highestQualification: a.highestQualification,
      }));

    res.json({ status: 'success', matches });
  });

  // Recruiter list of all submitted Intern Applications (omits raw Base64 payload for fast transfer)
  app.get('/api/applications', (_req: Request, res: Response) => {
    const apps = readApplications().map(({ resume, ...rest }) => ({
      ...rest,
      resumeMeta: resume
        ? {
            fileName: resume.fileName,
            mimeType: resume.mimeType,
            sizeBytes: resume.sizeBytes,
          }
        : null,
    }));
    res.json({ status: 'success', applications: apps });
  });

  // Download a candidate's uploaded Resume / CV
  app.get('/api/applications/:id/resume', (req: Request, res: Response) => {
    const apps = readApplications();
    const target = apps.find((a) => a.id === req.params.id);
    if (!target || !target.resume || !target.resume.base64Data) {
      res.status(404).json({ status: 'error', message: 'Resume file not found.' });
      return;
    }

    const buffer = Buffer.from(target.resume.base64Data, 'base64');
    const safeFileName = target.resume.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    res.setHeader('Content-Type', target.resume.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
    res.send(buffer);
  });

  // Update application screening status
  app.patch('/api/applications/:id/status', (req: Request, res: Response) => {
    const nextStatus = String(req.body?.status || '').trim();
    if (!nextStatus) {
      res.status(400).json({ status: 'error', message: 'Status value is required.' });
      return;
    }

    const apps = readApplications();
    const index = apps.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ status: 'error', message: 'Application not found.' });
      return;
    }

    apps[index].status = nextStatus;
    writeApplications(apps);
    res.json({ status: 'success', applicationId: apps[index].id, updatedStatus: nextStatus });
  });

  // Record when candidate starts or completes AptiQuest assessment stage
  app.post('/api/applications/:id/aptiquest-started', (req: Request, res: Response) => {
    const stage = String(req.body?.stage || 'started');
    const apps = readApplications();
    const index = apps.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ status: 'error', message: 'Application not found.' });
      return;
    }

    if (apps[index].status.includes('AptiQuest Pending') || stage === 'completed') {
      apps[index].status =
        stage === 'completed'
          ? 'Submitted & AptiQuest Completed — Under Review'
          : 'Submitted & AptiQuest Started — Under Review';
      writeApplications(apps);
    }

    res.json({ status: 'success', updatedStatus: apps[index].status });
  });

  // Read & update optional Google Apps Script Web App URL for Google Sheets sync
  app.get('/api/webhook-config', (_req: Request, res: Response) => {
    const settings = readSettings();
    res.json({ status: 'success', appsScriptUrl: settings.appsScriptUrl });
  });

  app.post('/api/webhook-config', (req: Request, res: Response) => {
    const url = String(req.body?.appsScriptUrl || '').trim();
    if (url !== '' && !url.startsWith('https://script.google.com/')) {
      res.status(400).json({
        status: 'error',
        message: 'Please provide a valid Google Apps Script Web App URL starting with https://script.google.com/ or leave blank.',
      });
      return;
    }
    writeSettings({ appsScriptUrl: url });
    res.json({ status: 'success', appsScriptUrl: url });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Grambytes Nexus Intern Hiring server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
