export enum FormStep {
  PersonalDetails = 1,
  EducationAndPreferences = 2,
  SkillsAndProjects = 3,
  ResumeAndSubmit = 4,
}

export interface UploadedResumePayload {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  base64Data: string;
}

export interface InternApplicationFormData {
  // Step 1: Personal Details
  fullName: string;
  email: string;
  mobileNumber: string;
  location: string;
  linkedinUrl: string;

  // Step 2: Education & Internship Preferences
  academicStatus: string;
  highestQualification: string;
  collegeName: string;
  graduationYear: string;
  workMode: string;
  internshipType: string;
  internshipDuration: string;

  // Step 3: Technical Skills & Projects
  technicalTools: string[];
  proficiencyLevel: string;
  hasBuiltProjects: string;
  portfolioUrl: string;
  projectDescription: string;
  reasonToJoin: string;

  // Step 4: Resume, Joining Timeline & Consent
  resume: UploadedResumePayload | null;
  startDate: string;
  preferredSlots: string[];
  consentConfirmed: boolean;
}

export interface SubmissionReceipt {
  applicationId: string;
  submittedAt: string;
  applicantName: string;
  email: string;
  mobileNumber: string;
  highestQualification: string;
  workMode: string;
  internshipType: string;
  internshipDuration: string;
  sheetSynced: boolean;
}

export interface ApplicationStatusMatch {
  id: string;
  submittedAt: string;
  status: string;
  fullName: string;
  email: string;
  workMode: string;
  internshipType: string;
  internshipDuration: string;
  highestQualification: string;
}

export interface RecruiterApplicationRecord extends ApplicationStatusMatch {
  mobileNumber: string;
  location: string;
  linkedinUrl: string;
  academicStatus: string;
  collegeName: string;
  graduationYear: string;
  technicalTools: string[];
  proficiencyLevel: string;
  hasBuiltProjects: string;
  portfolioUrl: string;
  projectDescription: string;
  reasonToJoin: string;
  startDate: string;
  preferredSlots: string[];
  sheetSynced: boolean;
  resumeMeta: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  } | null;
}
