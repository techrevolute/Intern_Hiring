import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Search,
  Settings2,
  X,
} from 'lucide-react';
import type {
  ApplicationStatusMatch,
  RecruiterApplicationRecord,
} from '../types/hiring';

interface PortalModalProps {
  isOpen: boolean;
  initialTab: 'status' | 'recruiter';
  onClose: () => void;
}

const SCREENING_STATUS_OPTIONS = [
  'Application Submitted — AptiQuest Pending',
  'Submitted & AptiQuest Started — Under Review',
  'Submitted & AptiQuest Completed — Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected for Internship',
  'Archived',
];

export function PortalModal({ isOpen, initialTab, onClose }: PortalModalProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'recruiter'>(initialTab);

  // Candidate lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupMatches, setLookupMatches] = useState<ApplicationStatusMatch[] | null>(null);

  // Recruiter dashboard state
  const [applications, setApplications] = useState<RecruiterApplicationRecord[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<RecruiterApplicationRecord | null>(null);

  // Optional Google Apps Script Sheet sync config state
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);
  const [webhookSaving, setWebhookSaving] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  const fetchRecruiterData = async () => {
    setAppsLoading(true);
    try {
      const [appsRes, webhookRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/webhook-config'),
      ]);
      const appsJson = await appsRes.json();
      if (appsRes.ok && Array.isArray(appsJson.applications)) {
        setApplications(appsJson.applications);
      }
      const webhookJson = await webhookRes.json();
      if (webhookRes.ok && typeof webhookJson.appsScriptUrl === 'string') {
        setAppsScriptUrl(webhookJson.appsScriptUrl);
      }
    } catch {
      // Quietly handle fetch error
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'recruiter') {
      fetchRecruiterData();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleCandidateLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) {
      setLookupError('Please enter your Application Reference ID (e.g. AIS-2026-123456) or Email Address.');
      return;
    }
    setLookupLoading(true);
    setLookupError(null);
    try {
      const res = await fetch(`/api/applications/lookup?query=${encodeURIComponent(lookupQuery.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to check status.');
      }
      setLookupMatches(data.matches || []);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : 'Lookup failed.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleUpdateCandidateStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
        );
        if (selectedCandidate?.id === id) {
          setSelectedCandidate((prev) => (prev ? { ...prev, status: nextStatus } : null));
        }
      }
    } catch {
      // Ignore transient error
    }
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookSaving(true);
    setWebhookMessage(null);
    try {
      const res = await fetch('/api/webhook-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appsScriptUrl: appsScriptUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid URL.');
      }
      setWebhookMessage(
        data.appsScriptUrl
          ? 'Google Apps Script URL saved. New intern submissions will forward to your Google Sheet.'
          : 'Webhook cleared. Submissions continue saving safely on this server.'
      );
    } catch (err) {
      setWebhookMessage(err instanceof Error ? err.message : 'Failed to save webhook URL.');
    } finally {
      setWebhookSaving(false);
    }
  };

  const handleExportCsv = () => {
    if (applications.length === 0) return;
    const headers = [
      'Application ID',
      'Submitted At',
      'Status',
      'Full Name',
      'Email',
      'Mobile',
      'Location',
      'Academic Status',
      'Qualification',
      'College',
      'Graduation Year',
      'Work Mode',
      'Commitment',
      'Duration',
      'Proficiency',
      'Tools',
      'Built Projects',
      'Portfolio URL',
      'Start Date',
      'Preferred Slots',
      'Motivation',
    ];

    const escapeCsv = (val: string) => `"${String(val || '').replace(/"/g, '""')}"`;

    const rows = applications.map((app) =>
      [
        app.id,
        app.submittedAt,
        app.status,
        app.fullName,
        app.email,
        app.mobileNumber,
        app.location,
        app.academicStatus,
        app.highestQualification,
        app.collegeName,
        app.graduationYear,
        app.workMode,
        app.internshipType,
        app.internshipDuration,
        app.proficiencyLevel,
        app.technicalTools.join('; '),
        app.hasBuiltProjects,
        app.portfolioUrl,
        app.startDate,
        app.preferredSlots.join('; '),
        app.reasonToJoin,
      ]
        .map(escapeCsv)
        .join(',')
    );

    const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Institute_Satana_Intern_Applications_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredApplications =
    statusFilter === 'All'
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Internship Application Portal"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden shadow-xl">
        {/* Modal Header with Segmented Switch */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'status'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Track Application Status
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('recruiter')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'recruiter'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recruiter Submissions ({applications.length})
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'status' ? (
            <div className="max-w-xl mx-auto space-y-6 py-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Check Your Internship Application</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Enter the Application Reference ID from your receipt (e.g.{' '}
                  <span className="font-mono text-xs text-slate-800">AIS-2026-XXXXXX</span>) or your registered email address.
                </p>
              </div>

              <form onSubmit={handleCandidateLookup} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={lookupQuery}
                  onChange={(e) => {
                    setLookupQuery(e.target.value);
                    setLookupError(null);
                  }}
                  placeholder="Enter Application ID or Email..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-700 text-sm text-slate-900 outline-none"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
                >
                  {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Search</span>
                </button>
              </form>

              {lookupError && (
                <p className="text-xs text-rose-600 font-medium">{lookupError}</p>
              )}

              {lookupMatches !== null && (
                <div className="space-y-3">
                  {lookupMatches.length === 0 ? (
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
                      No application found matching <strong className="text-slate-900">{lookupQuery}</strong>. Verify your Reference ID or submit a new application on the main page.
                    </div>
                  ) : (
                    lookupMatches.map((match) => (
                      <div
                        key={match.id}
                        className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                          <span className="font-mono font-bold text-blue-700 tabular-nums">{match.id}</span>
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{match.status}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                          <p>
                            Candidate: <strong className="text-slate-900">{match.fullName}</strong>
                          </p>
                          <p className="tabular-nums">
                            Submitted: <strong className="text-slate-900">{new Date(match.submittedAt).toLocaleDateString()}</strong>
                          </p>
                          <p>
                            Work Mode: <strong className="text-slate-900">{match.workMode}</strong>
                          </p>
                          <p className="tabular-nums">
                            Duration: <strong className="text-slate-900">{match.internshipDuration}</strong>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Recruiter Submissions Management View */
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Data Analyst Intern Applications
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review intern applicants, download resumes, update screening stages, or export to Excel / Google Sheets.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWebhookOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Google Sheet Sync</span>
                  </button>
                  <button
                    type="button"
                    onClick={fetchRecruiterData}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={applications.length === 0}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-xs font-semibold text-white whitespace-nowrap shrink-0"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Optional Google Sheets Apps Script Webhook Box */}
              {webhookOpen && (
                <form
                  onSubmit={handleSaveWebhook}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="webhookInput" className="text-xs font-bold text-slate-800">
                      Optional Google Apps Script Web App URL (Auto-Forward to Google Sheets)
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      id="webhookInput"
                      type="url"
                      value={appsScriptUrl}
                      onChange={(e) => setAppsScriptUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 outline-none focus:border-blue-700"
                    />
                    <button
                      type="submit"
                      disabled={webhookSaving}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold whitespace-nowrap shrink-0"
                    >
                      {webhookSaving ? 'Saving...' : 'Save URL'}
                    </button>
                  </div>
                  {webhookMessage && (
                    <p className="text-xs text-blue-700 font-medium">{webhookMessage}</p>
                  )}
                </form>
              )}

              {/* Filter Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', ...SCREENING_STATUS_OPTIONS].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {appsLoading ? (
                <div className="py-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading submitted intern applications...</span>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="py-12 px-6 text-center rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-800">No applications in this view yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Submitted Data Analyst Intern applications appear here immediately with downloadable CVs.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <th className="py-3 px-4">Ref ID</th>
                          <th className="py-3 px-4">Candidate</th>
                          <th className="py-3 px-4">Degree &amp; Year</th>
                          <th className="py-3 px-4">Mode &amp; Duration</th>
                          <th className="py-3 px-4">Screening Stage</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-mono font-semibold text-blue-700 tabular-nums whitespace-nowrap">
                              {app.id}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-slate-900">{app.fullName}</p>
                              <p className="text-slate-500">{app.email}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-slate-800 font-medium">{app.highestQualification}</p>
                              <p className="text-slate-500 tabular-nums">Class of {app.graduationYear}</p>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <p className="text-slate-800">{app.workMode}</p>
                              <p className="text-slate-500 tabular-nums">{app.internshipDuration}</p>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                aria-label={`Update status for ${app.fullName}`}
                                value={app.status}
                                onChange={(e) => handleUpdateCandidateStatus(app.id, e.target.value)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium outline-none focus:border-blue-700"
                              >
                                {SCREENING_STATUS_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedCandidate(selectedCandidate?.id === app.id ? null : app)
                                }
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700"
                              >
                                {selectedCandidate?.id === app.id ? 'Hide' : 'Details'}
                              </button>
                              {app.resumeMeta && (
                                <a
                                  href={`/api/applications/${encodeURIComponent(app.id)}/resume`}
                                  download={app.resumeMeta.fileName}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>CV</span>
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Expanded Candidate Detail Drawer */}
              {selectedCandidate && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {selectedCandidate.fullName} ·{' '}
                        <span className="font-mono text-blue-700">{selectedCandidate.id}</span>
                      </h4>
                      <p className="text-slate-600 mt-0.5">
                        {selectedCandidate.mobileNumber} · {selectedCandidate.location} ·{' '}
                        {selectedCandidate.collegeName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedCandidate.portfolioUrl && (
                        <a
                          href={selectedCandidate.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline"
                        >
                          <span>Portfolio / GitHub</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {selectedCandidate.linkedinUrl && (
                        <a
                          href={selectedCandidate.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline"
                        >
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Skills &amp; Proficiency:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedCandidate.proficiencyLevel} — {selectedCandidate.technicalTools.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Joining &amp; Preferred Slots:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedCandidate.startDate} ({selectedCandidate.preferredSlots.join(', ')})
                      </span>
                    </div>
                  </div>

                  {selectedCandidate.projectDescription && (
                    <div>
                      <span className="text-slate-500 block">Project / Coursework Highlight:</span>
                      <p className="text-slate-800 mt-0.5 leading-relaxed">
                        {selectedCandidate.projectDescription}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-500 block">Motivation to Intern at Grambytes Nexus:</span>
                    <p className="text-slate-800 mt-0.5 leading-relaxed">
                      {selectedCandidate.reasonToJoin}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
