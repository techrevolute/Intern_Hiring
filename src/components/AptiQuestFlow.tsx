import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  ShieldAlert,
  X,
} from 'lucide-react';
import { HIRING_CONFIG } from '../config/hiringConfig';
import type { SubmissionReceipt } from '../types/hiring';

interface AptiQuestFlowProps {
  receipt: SubmissionReceipt;
  onDownloadReceipt: () => void;
  onFinishAll: () => void;
}

function extractTenDigitMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function AptiQuestFlow({
  receipt,
  onDownloadReceipt,
  onFinishAll,
}: AptiQuestFlowProps) {
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [showAcceptHint, setShowAcceptHint] = useState(false);
  const [stage, setStage] = useState<'briefing' | 'active_test' | 'completed'>('briefing');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (stage === 'active_test') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
    return undefined;
  }, [stage]);

  const tenDigitMobile = extractTenDigitMobile(receipt.mobileNumber);
  const batchIdentifier = `${receipt.applicationId} - ${receipt.highestQualification || 'Data Analyst Intern'}`;

  const handleCopy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => {
        setCopiedField((prev) => (prev === label ? null : prev));
      }, 2000);
    } catch {
      // Clipboard fallback ignored quietly
    }
  };

  const notifyServerStage = async (testStage: 'started' | 'completed') => {
    try {
      await fetch(`/api/applications/${encodeURIComponent(receipt.applicationId)}/aptiquest-started`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: testStage }),
      });
    } catch {
      // Non-blocking status sync
    }
  };

  const handleStartTest = () => {
    if (!instructionsAccepted) {
      setShowAcceptHint(true);
      return;
    }
    setShowAcceptHint(false);
    setIframeLoaded(false);
    notifyServerStage('started');
    setStage('active_test');
  };

  const handleCompleteAndExitTest = () => {
    notifyServerStage('completed');
    setStage('completed');
  };

  /* STAGE 3: Post-Assessment Final Summary */
  if (stage === 'completed') {
    return (
      <div className="p-8 sm:p-12 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <p className="text-xs font-semibold text-emerald-700">
            Step 1: Application Form Recorded · Step 2: AptiQuest Screening Initiated
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Application &amp; Aptitude Screening Complete
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Thank you, <strong className="text-slate-900">{receipt.applicantName}</strong>. Our admissions and screening team at{' '}
            <strong className="text-slate-900">AI Institute Satana × Grambytes Nexus Pvt. Ltd.</strong> will review your resume along with your AptiQuest score and reach out on WhatsApp / Email.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2.5">
            <span className="text-slate-500">Application ID</span>
            <span className="font-mono font-bold text-blue-700 tabular-nums">
              {receipt.applicationId}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Registered Mobile</span>
            <span className="font-mono font-medium text-slate-800 tabular-nums">{tenDigitMobile}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Program</span>
            <span className="font-medium text-slate-800 tabular-nums">3 Months WFH · ₹4,999/-</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onDownloadReceipt}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
          <button
            type="button"
            onClick={() => setStage('active_test')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
          >
            <span>Re-open AptiQuest Window</span>
          </button>
          <button
            type="button"
            onClick={onFinishAll}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* STAGE 1: Mandatory Pre-Test Information & Instructions Screen (Shown BEFORE AptiQuest Starts) */}
      <div className="p-6 sm:p-10 space-y-8">
        {/* Application Saved Confirmation Strip */}
        <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-900">
                Application Form Submitted · Reference ID:{' '}
                <span className="font-mono text-blue-700 tabular-nums">{receipt.applicationId}</span>
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Next Step: Read the Aptitude Assessment instructions carefully below before starting your test.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onDownloadReceipt}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>Save Receipt</span>
            </button>
            <button
              type="button"
              onClick={onFinishAll}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/70 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
            >
              New Application
            </button>
          </div>
        </div>

        {/* AptiQuest Briefing Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-blue-700">
            Step 2 of 2 · Mandatory Online Screening Assessment
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {HIRING_CONFIG.aptiQuest.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {HIRING_CONFIG.aptiQuest.subtitle} Please review the exam format, topics, and candidate login details below before clicking <strong className="text-slate-900">Start AptiQuest Assessment</strong>.
          </p>
        </div>

        {/* 4-Column Test Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {HIRING_CONFIG.aptiQuest.metrics.map((m) => (
            <div
              key={m.label}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200"
            >
              <p className="text-xs font-medium text-slate-500">{m.label}</p>
              <p className="text-lg font-extrabold text-slate-900 mt-1 tabular-nums">
                {m.value}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{m.detail}</p>
            </div>
          ))}
        </div>

        {/* Syllabus / 4 Assessment Sections */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-blue-700" />
            <span>Assessment Sections &amp; Topics Covered</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {HIRING_CONFIG.aptiQuest.sections.map((sec) => (
              <div
                key={sec.number}
                className="p-4 rounded-xl border border-slate-200 bg-white"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums">
                    {sec.number}.
                  </span>
                  <span className="text-sm font-bold text-slate-900">{sec.name}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {sec.topics}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Quick-Copy Credentials for AptiQuest Login */}
        <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <p className="text-xs font-semibold text-blue-300">
                Your Details for the AptiQuest Start Screen
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Enter these exact details when AptiQuest opens so your test score links with your internship application:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-slate-400 block">Full Name *</span>
                <span className="font-semibold text-white truncate block mt-0.5">
                  {receipt.applicantName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('name', receipt.applicantName)}
                className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium shrink-0 inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedField === 'name' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-slate-400 block">10-Digit Mobile No. *</span>
                <span className="font-mono font-semibold text-amber-300 tabular-nums block mt-0.5">
                  {tenDigitMobile}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('mobile', tenDigitMobile)}
                className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium shrink-0 inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedField === 'mobile' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-slate-400 block">Class / Batch Box</span>
                <span className="font-mono font-semibold text-white truncate block mt-0.5">
                  {batchIdentifier}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('batch', batchIdentifier)}
                className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium shrink-0 inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedField === 'batch' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Important Instructions Checklist */}
        <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200/90 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Important Rules Before Starting AptiQuest</span>
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {HIRING_CONFIG.aptiQuest.guidelines.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Readiness Confirmation & Start Button */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={instructionsAccepted}
              onChange={(e) => {
                setInstructionsAccepted(e.target.checked);
                if (e.target.checked) setShowAcceptHint(false);
              }}
              className="w-4 h-4 accent-blue-700 rounded mt-0.5 shrink-0"
            />
            <span className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
              I have read all the AptiQuest instructions above, noted my Reference ID (<strong className="font-mono text-blue-700">{receipt.applicationId}</strong>), and am ready to start my <strong className="tabular-nums">30-minute</strong> Aptitude Assessment now.
            </span>
          </label>

          {showAcceptHint && (
            <p role="alert" className="text-xs font-semibold text-rose-600">
              Please tick the confirmation checkbox above after reading the test instructions to start AptiQuest.
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Make sure you have 30 uninterrupted minutes before clicking Start.</span>
            </div>

            <button
              type="button"
              onClick={handleStartTest}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
            >
              <span>Start AptiQuest Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* STAGE 2: Full-Screen Embedded AptiQuest Assessment Workspace */}
      {stage === 'active_test' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AptiQuest Live Assessment"
          className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
        >
          {/* Compact Candidate Top Bar */}
          <div className="min-h-14 px-4 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-white whitespace-nowrap">
                AptiQuest Live Screening
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="hidden md:inline text-slate-400">
                Enter your details below into the test start card:
              </span>
            </div>

            {/* 1-Click Quick Copy Credentials Strip */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy('bar-mobile', tenDigitMobile)}
                title="Click to copy your 10-digit mobile number"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono tabular-nums whitespace-nowrap"
              >
                <span className="text-slate-400 font-sans">Mobile:</span>
                <span className="text-amber-300 font-semibold">{tenDigitMobile}</span>
                <Copy className="w-3 h-3 text-slate-400" />
                {copiedField === 'bar-mobile' && <span className="text-emerald-400 font-sans">Copied</span>}
              </button>

              <button
                type="button"
                onClick={() => handleCopy('bar-batch', batchIdentifier)}
                title="Click to copy your Application ID for the Class / Batch field"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono tabular-nums whitespace-nowrap"
              >
                <span className="text-slate-400 font-sans">Class/Batch:</span>
                <span className="text-blue-300 font-semibold">{receipt.applicationId}</span>
                <Copy className="w-3 h-3 text-slate-400" />
                {copiedField === 'bar-batch' && <span className="text-emerald-400 font-sans">Copied</span>}
              </button>
            </div>

            {/* Right Controls: Open in New Tab fallback + Complete & Return */}
            <div className="flex items-center gap-2">
              <a
                href={HIRING_CONFIG.aptiQuest.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-medium transition-colors whitespace-nowrap shrink-0"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCompleteAndExitTest}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>I Have Submitted Test</span>
              </button>

              <button
                type="button"
                onClick={() => setStage('briefing')}
                aria-label="Back to instructions"
                title="Back to instructions"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embedded AptiQuest Platform */}
          <div className="flex-1 w-full bg-slate-950 relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300 bg-slate-950 z-10">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-sm font-semibold text-white">
                  Loading AptiQuest Assessment Platform...
                </p>
                <p className="text-xs text-slate-400">
                  Preparing your 30-minute aptitude screening environment
                </p>
              </div>
            )}
            <iframe
              src={HIRING_CONFIG.aptiQuest.url}
              title="AptiQuest — Official Aptitude Test by GramBytes Nexus"
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-full border-0 relative z-20"
              allow="clipboard-read; clipboard-write; fullscreen"
            />
          </div>
        </div>
      )}
    </>
  );
}
