import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  FileText,
  GraduationCap,
  Loader2,
  Trash2,
  UploadCloud,
  User,
} from 'lucide-react';
import { HIRING_CONFIG } from '../config/hiringConfig';
import {
  FormStep,
  type InternApplicationFormData,
  type SubmissionReceipt,
} from '../types/hiring';
import { AptiQuestFlow } from './AptiQuestFlow';

const INITIAL_FORM_DATA: InternApplicationFormData = {
  fullName: '',
  email: '',
  mobileNumber: '',
  location: '',
  linkedinUrl: '',
  academicStatus: '',
  highestQualification: '',
  collegeName: '',
  graduationYear: '',
  workMode: 'Online – Work From Home',
  internshipType: '3-Month Training + Internship (Live + Recorded)',
  internshipDuration: '3 Months (All-Inclusive ₹4,999/- Offer)',
  technicalTools: [],
  proficiencyLevel: '',
  hasBuiltProjects: '',
  portfolioUrl: '',
  projectDescription: '',
  reasonToJoin: '',
  resume: null,
  startDate: '',
  preferredSlots: [],
  consentConfirmed: false,
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function InternApplicationForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.PersonalDetails);
  const [highestStepReached, setHighestStepReached] = useState<FormStep>(FormStep.PersonalDetails);
  const [formData, setFormData] = useState<InternApplicationFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(() => {
    try {
      const saved = sessionStorage.getItem('ais_2026_active_receipt');
      return saved ? (JSON.parse(saved) as SubmissionReceipt) : null;
    } catch {
      return null;
    }
  });

  const formCardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateField = <K extends keyof InternApplicationFormData>(
    field: K,
    value: InternApplicationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
    setSubmitError(null);
  };

  const toggleArrayValue = (field: 'technicalTools' | 'preferredSlots', item: string) => {
    setFormData((prev) => {
      const exists = prev[field].includes(item);
      const updated = exists
        ? prev[field].filter((v) => v !== item)
        : [...prev[field], item];
      return { ...prev, [field]: updated };
    });
    clearFieldError(field);
    setSubmitError(null);
  };

  const validateStep = (step: FormStep): boolean => {
    const nextErrors: Record<string, string> = {};

    if (step === FormStep.PersonalDetails) {
      if (formData.fullName.trim().length < 2) {
        nextErrors.fullName = 'Please enter your full name (minimum 2 characters).';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        nextErrors.email = 'Please enter a valid email address.';
      }
      const digitsOnly = formData.mobileNumber.replace(/[^\d]/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        nextErrors.mobileNumber = 'Please enter a valid 10 to 15-digit mobile / WhatsApp number.';
      }
      if (formData.location.trim().length < 2) {
        nextErrors.location = 'Please enter your current city and state.';
      }
      if (formData.linkedinUrl.trim() !== '') {
        try {
          new URL(formData.linkedinUrl.trim());
        } catch {
          nextErrors.linkedinUrl = 'Please enter a complete URL starting with https://';
        }
      }
    } else if (step === FormStep.EducationAndPreferences) {
      if (!formData.academicStatus) {
        nextErrors.academicStatus = 'Please select your current academic or career status.';
      }
      if (formData.highestQualification.trim().length < 2) {
        nextErrors.highestQualification = 'Please enter your degree / stream (e.g., B.E., BCA, B.Sc, MBA).';
      }
      if (formData.collegeName.trim().length < 2) {
        nextErrors.collegeName = 'Please enter your college, university, or institute name.';
      }
      if (!formData.graduationYear) {
        nextErrors.graduationYear = 'Please select your graduation / passing year.';
      }
      if (!formData.workMode) {
        nextErrors.workMode = 'Please confirm the program mode.';
      }
      if (!formData.internshipType) {
        nextErrors.internshipType = 'Please select your preferred learning & internship batch track.';
      }
      if (!formData.internshipDuration) {
        nextErrors.internshipDuration = 'Please confirm the 3-Month program duration.';
      }
    } else if (step === FormStep.SkillsAndProjects) {
      if (formData.technicalTools.length === 0) {
        nextErrors.technicalTools = 'Please select at least one option (or select Complete Beginner).';
      }
      if (!formData.proficiencyLevel) {
        nextErrors.proficiencyLevel = 'Please select your current skill level.';
      }
      if (!formData.hasBuiltProjects) {
        nextErrors.hasBuiltProjects = 'Please select Yes or No.';
      }
      if (formData.portfolioUrl.trim() !== '') {
        try {
          new URL(formData.portfolioUrl.trim());
        } catch {
          nextErrors.portfolioUrl = 'Please enter a complete URL starting with https://';
        }
      }
      if (formData.reasonToJoin.trim().length < 10) {
        nextErrors.reasonToJoin = 'Please write a short note on why you want to join this program.';
      }
    } else if (step === FormStep.ResumeAndSubmit) {
      if (!formData.resume) {
        nextErrors.resume = 'Please upload your Resume / CV (PDF, DOC, or DOCX up to 10 MB).';
      }
      if (!formData.startDate) {
        nextErrors.startDate = 'Please select when you can join.';
      }
      if (formData.preferredSlots.length === 0) {
        nextErrors.preferredSlots = 'Please select at least one preferred session time slot.';
      }
      if (!formData.consentConfirmed) {
        nextErrors.consentConfirmed = 'Please confirm the declaration checkbox to submit your application.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const scrollToFormTop = () => {
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    const nextStep = (currentStep + 1) as FormStep;
    setCurrentStep(nextStep);
    if (nextStep > highestStepReached) {
      setHighestStepReached(nextStep);
    }
    scrollToFormTop();
  };

  const handlePrevStep = () => {
    if (currentStep <= FormStep.PersonalDetails) return;
    setCurrentStep((currentStep - 1) as FormStep);
    setSubmitError(null);
    scrollToFormTop();
  };

  const handleStepClick = (targetStep: FormStep) => {
    if (targetStep === currentStep) return;
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }
    if (targetStep <= highestStepReached && validateStep(currentStep)) {
      setCurrentStep(targetStep);
    }
  };

  const processResumeFile = (file: File) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const lowerName = file.name.toLowerCase();
    const isValidExt = allowedExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValidExt) {
      setErrors((prev) => ({
        ...prev,
        resume: 'Invalid file format. Please upload a PDF, DOC, or DOCX file.',
      }));
      return;
    }

    const maxBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxBytes) {
      setErrors((prev) => ({
        ...prev,
        resume: 'File exceeds the 10 MB limit. Please upload a smaller PDF or DOCX.',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64Data = result.includes(',') ? result.split(',')[1] : result;
      updateField('resume', {
        fileName: file.name,
        mimeType: file.type || 'application/pdf',
        sizeBytes: file.size,
        base64Data,
      });
    };
    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        resume: 'Unable to read the selected file. Please try selecting it again.',
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processResumeFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateStep(FormStep.ResumeAndSubmit)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Unable to submit your application right now.');
      }

      const newReceipt: SubmissionReceipt = {
        applicationId: data.applicationId,
        submittedAt: data.submittedAt,
        applicantName: data.applicantName,
        email: data.email,
        mobileNumber: data.mobileNumber || formData.mobileNumber,
        highestQualification: data.highestQualification || formData.highestQualification,
        workMode: data.workMode,
        internshipType: data.internshipType,
        internshipDuration: data.internshipDuration,
        sheetSynced: Boolean(data.sheetSynced),
      };
      setReceipt(newReceipt);
      try {
        sessionStorage.setItem('ais_2026_active_receipt', JSON.stringify(newReceipt));
      } catch {
        // Ignore storage quota errors
      }
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(FormStep.PersonalDetails);
      setHighestStepReached(FormStep.PersonalDetails);
      scrollToFormTop();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error while submitting application.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!receipt) return;
    const lines = [
      '============================================================',
      'AI INSTITUTE SATANA × GRAMBYTES NEXUS PVT. LTD.',
      'DATA ANALYST INTERNS – 2026 | APPLICATION RECEIPT',
      '============================================================',
      `Application Reference ID : ${receipt.applicationId}`,
      `Candidate Name           : ${receipt.applicantName}`,
      `Registered Email         : ${receipt.email}`,
      `Program Applied          : 3-Month Work From Home Training & Internship`,
      `Mode                     : ${receipt.workMode}`,
      `Special Launch Offer     : ₹4,999/- (All-Inclusive Fee | First 100 Students)`,
      `Submitted Timestamp      : ${new Date(receipt.submittedAt).toLocaleString()}`,
      `Current Status           : Submitted — Under Screening`,
      '------------------------------------------------------------',
      `Keep your Reference ID (${receipt.applicationId}) safe to track your application status.`,
      `WhatsApp Support : ${HIRING_CONFIG.contact.whatsappDisplay}`,
      `Resume Desk      : ${HIRING_CONFIG.contact.resumeWhatsappDisplay}`,
      `Website          : ${HIRING_CONFIG.contact.websiteDisplay}`,
      '============================================================',
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.applicationId}_Receipt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stepMeta = [
    { step: FormStep.PersonalDetails, label: '1. Personal Info', icon: User },
    { step: FormStep.EducationAndPreferences, label: '2. Education & Program', icon: GraduationCap },
    { step: FormStep.SkillsAndProjects, label: '3. Skills & Goals', icon: Code2 },
    { step: FormStep.ResumeAndSubmit, label: '4. Resume & Submit', icon: CheckCircle2 },
  ];

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <section id="application" className="py-20 md:py-28 bg-slate-100 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={formCardRef}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
          {/* Form Banner Header */}
          <div className="bg-slate-900 px-6 py-8 sm:px-10 sm:py-10 text-white border-b border-slate-800">
            <p className="text-xs font-medium text-blue-300 mb-2">
              {HIRING_CONFIG.collaborationLabel} · First 100 Students Special Launch Offer
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Data Analyst Interns – 2026 Application
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-2 max-w-2xl">
              Apply now &amp; secure your spot in our <strong className="text-white">3-Month Online – Work From Home Training &amp; Internship Program</strong> (Special Launch Offer: <strong className="text-amber-300 tabular-nums">₹4,999/- All-Inclusive</strong>). Upon form completion, your <strong className="text-white">AptiQuest Aptitude Test</strong> instructions will appear before the test begins.
            </p>
            <p className="text-xs text-rose-300 font-medium mt-3">
              * Indicates required field
            </p>
          </div>

          {receipt ? (
            /* Mandatory Pre-Test Instructions -> Live AptiQuest Flow */
            <AptiQuestFlow
              receipt={receipt}
              onDownloadReceipt={handleDownloadReceipt}
              onFinishAll={() => {
                setReceipt(null);
                try {
                  sessionStorage.removeItem('ais_2026_active_receipt');
                } catch {
                  // Ignore storage errors
                }
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ) : (
            <>
              {/* Step Indicator Navigation */}
              <div className="px-6 pt-6 sm:px-10 border-b border-slate-200 bg-slate-50/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {stepMeta.map(({ step, label }) => {
                    const isActive = currentStep === step;
                    const isCompleted = step < currentStep;
                    const isClickable = step <= highestStepReached;
                    return (
                      <button
                        key={step}
                        type="button"
                        disabled={!isClickable}
                        onClick={() => handleStepClick(step)}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap truncate ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : isCompleted
                              ? 'text-slate-800 hover:bg-slate-100 cursor-pointer'
                              : 'text-slate-400 cursor-default'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-4 overflow-hidden">
                  <div
                    className="bg-blue-700 h-1 transition-transform duration-200 origin-left"
                    style={{ transform: `scaleX(${progressPercentage / 100})` }}
                  />
                </div>
              </div>

              {/* Global Submission Error Banner */}
              {submitError && (
                <div
                  role="alert"
                  className="mx-6 mt-6 sm:mx-10 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl flex items-start gap-3 text-sm"
                >
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Multi-Step Form */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-7 relative" noValidate>
                {/* Loading Overlay */}
                {isSubmitting && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Loader2 className="w-9 h-9 text-blue-700 animate-spin" />
                    <p className="text-base font-bold text-slate-900">Submitting Your Application...</p>
                    <p className="text-xs text-slate-500">Uploading your resume and registering your spot.</p>
                  </div>
                )}

                {/* STEP 1: PERSONAL INFORMATION */}
                {currentStep === FormStep.PersonalDetails && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
                      <User className="w-5 h-5 text-blue-700 shrink-0" />
                      <h3 className="text-lg font-bold text-slate-900">Step 1: Personal Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800">
                          Full Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          placeholder="e.g. Aarav Deshmukh"
                          className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                            errors.fullName
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-slate-300 focus:border-blue-700'
                          }`}
                        />
                        {errors.fullName && (
                          <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.fullName}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                          Email Address <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="you@example.com"
                          className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                            errors.email
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-slate-300 focus:border-blue-700'
                          }`}
                        />
                        {errors.email && (
                          <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="mobileNumber" className="block text-sm font-semibold text-slate-800">
                          WhatsApp / Mobile Number <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="mobileNumber"
                          type="tel"
                          value={formData.mobileNumber}
                          onChange={(e) => updateField('mobileNumber', e.target.value)}
                          placeholder="+91 98765 43210"
                          className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors tabular-nums ${
                            errors.mobileNumber
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-slate-300 focus:border-blue-700'
                          }`}
                        />
                        {errors.mobileNumber && (
                          <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.mobileNumber}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="location" className="block text-sm font-semibold text-slate-800">
                          Current City &amp; State <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={(e) => updateField('location', e.target.value)}
                          placeholder="e.g. Satana / Nashik / Pune, Maharashtra"
                          className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                            errors.location
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-slate-300 focus:border-blue-700'
                          }`}
                        />
                        {errors.location && (
                          <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="linkedinUrl" className="block text-sm font-semibold text-slate-800">
                        LinkedIn Profile URL <span className="text-xs font-normal text-slate-500">(Optional)</span>
                      </label>
                      <input
                        id="linkedinUrl"
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => updateField('linkedinUrl', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                          errors.linkedinUrl
                            ? 'border-rose-500 focus:border-rose-600'
                            : 'border-slate-300 focus:border-blue-700'
                        }`}
                      />
                      {errors.linkedinUrl && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.linkedinUrl}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: EDUCATION & PROGRAM DETAILS */}
                {currentStep === FormStep.EducationAndPreferences && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
                      <GraduationCap className="w-5 h-5 text-blue-700 shrink-0" />
                      <h3 className="text-lg font-bold text-slate-900">Step 2: Education &amp; Program Enrollment</h3>
                    </div>

                    {/* Current Academic Status */}
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-slate-800">
                        Current Academic / Career Status <span className="text-rose-600">*</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {HIRING_CONFIG.formOptions.academicStatuses.map((statusOption) => {
                          const selected = formData.academicStatus === statusOption;
                          return (
                            <label
                              key={statusOption}
                              className={`flex items-center p-3.5 rounded-xl border cursor-pointer transition-colors ${
                                selected
                                  ? 'border-blue-700 bg-blue-50/60 text-slate-900'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="academicStatus"
                                value={statusOption}
                                checked={selected}
                                onChange={() => updateField('academicStatus', statusOption)}
                                className="w-4 h-4 accent-blue-700 shrink-0"
                              />
                              <span className="ml-2.5 text-xs sm:text-sm font-medium">{statusOption}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.academicStatus && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.academicStatus}</span>
                        </p>
                      )}
                    </div>

                    {/* Degree & College */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="highestQualification" className="block text-sm font-semibold text-slate-800">
                          Degree &amp; Branch / Stream <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="highestQualification"
                          type="text"
                          value={formData.highestQualification}
                          onChange={(e) => updateField('highestQualification', e.target.value)}
                          placeholder="e.g. B.E. Computer / BCA / B.Sc / MBA"
                          className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                            errors.highestQualification
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-slate-300 focus:border-blue-700'
                          }`}
                        />
                        {errors.highestQualification && (
                          <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.highestQualification}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="collegeName" className="block text-sm font-semibold text-slate-800">
                          College / University Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="collegeName"
                          type="text"
                          value={formData.collegeName}
                          onChange={(e) => updateField('collegeName', e.target.value)}
                          placeholder="e.g. SPPU / KTHM College / Sandip University"
                          className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                            errors.collegeName
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-slate-300 focus:border-blue-700'
                          }`}
                        />
                        {errors.collegeName && (
                          <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.collegeName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Graduation Year */}
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-slate-800">
                        Graduation / Passing Year <span className="text-rose-600">*</span>
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {HIRING_CONFIG.formOptions.graduationYears.map((yr) => {
                          const selected = formData.graduationYear === yr;
                          return (
                            <label
                              key={yr}
                              className={`flex items-center justify-center p-2.5 rounded-xl border cursor-pointer text-xs font-semibold tabular-nums transition-colors ${
                                selected
                                  ? 'border-blue-700 bg-blue-50/70 text-blue-800'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="graduationYear"
                                value={yr}
                                checked={selected}
                                onChange={() => updateField('graduationYear', yr)}
                                className="sr-only"
                              />
                              <span>{yr}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.graduationYear && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.graduationYear}</span>
                        </p>
                      )}
                    </div>

                    {/* Program Mode & Learning Track */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <span className="block text-sm font-semibold text-slate-800">
                          Program Mode &amp; Duration <span className="text-rose-600">*</span>
                        </span>
                        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                          <p className="text-sm font-bold text-slate-900">
                            Online – Work From Home (3 Months)
                          </p>
                          <p className="text-xs text-slate-600 tabular-nums">
                            Special Launch Offer: ₹4,999/- All-Inclusive (Training + Internship)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="block text-sm font-semibold text-slate-800">
                          Preferred Session Format <span className="text-rose-600">*</span>
                        </span>
                        <div className="space-y-2">
                          {HIRING_CONFIG.formOptions.internshipTypes.map((track) => {
                            const selected = formData.internshipType === track;
                            return (
                              <label
                                key={track}
                                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                                  selected
                                    ? 'border-blue-700 bg-blue-50/60 text-slate-900'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="internshipType"
                                  value={track}
                                  checked={selected}
                                  onChange={() => updateField('internshipType', track)}
                                  className="w-4 h-4 accent-blue-700 shrink-0"
                                />
                                <span className="ml-2.5 text-xs sm:text-sm font-medium">{track}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: TECHNICAL SKILLS & PROJECTS */}
                {currentStep === FormStep.SkillsAndProjects && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
                      <Code2 className="w-5 h-5 text-blue-700 shrink-0" />
                      <h3 className="text-lg font-bold text-slate-900">Step 3: Current Skills &amp; Career Goals</h3>
                    </div>

                    {/* Tools & Technologies Checkboxes */}
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-slate-800">
                        Familiar Tools (Beginners can select &ldquo;Complete Beginner&rdquo;){' '}
                        <span className="text-rose-600">*</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {HIRING_CONFIG.formOptions.technicalTools.map((tool) => {
                          const checked = formData.technicalTools.includes(tool);
                          return (
                            <label
                              key={tool}
                              className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                                checked
                                  ? 'border-blue-700 bg-blue-50/60 text-slate-900'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleArrayValue('technicalTools', tool)}
                                className="w-4 h-4 accent-blue-700 rounded shrink-0"
                              />
                              <span className="ml-2.5 text-xs font-semibold leading-snug">{tool}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.technicalTools && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.technicalTools}</span>
                        </p>
                      )}
                    </div>

                    {/* Self-Rated Proficiency */}
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-slate-800">
                        Current Data Analytics Level <span className="text-rose-600">*</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {HIRING_CONFIG.formOptions.proficiencyLevels.map((lvl) => {
                          const selected = formData.proficiencyLevel === lvl.value;
                          return (
                            <label
                              key={lvl.value}
                              className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-colors ${
                                selected
                                  ? 'border-blue-700 bg-blue-50/60 text-slate-900'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="proficiencyLevel"
                                value={lvl.value}
                                checked={selected}
                                onChange={() => updateField('proficiencyLevel', lvl.value)}
                                className="w-4 h-4 accent-blue-700 mt-0.5 shrink-0"
                              />
                              <div className="ml-2.5">
                                <span className="text-sm font-semibold block">{lvl.value}</span>
                                <span className="text-xs text-slate-500 block mt-0.5">{lvl.detail}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {errors.proficiencyLevel && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.proficiencyLevel}</span>
                        </p>
                      )}
                    </div>

                    {/* Built Academic / Personal Projects + Portfolio Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                      <div className="sm:col-span-5 space-y-2">
                        <span className="block text-sm font-semibold text-slate-800">
                          Worked on Any Prior Data Projects? <span className="text-rose-600">*</span>
                        </span>
                        <div className="flex gap-3">
                          {['Yes', 'No'].map((choice) => {
                            const selected = formData.hasBuiltProjects === choice;
                            return (
                              <label
                                key={choice}
                                className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-colors ${
                                  selected
                                    ? 'border-blue-700 bg-blue-50/60 text-slate-900'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="hasBuiltProjects"
                                  value={choice}
                                  checked={selected}
                                  onChange={() => updateField('hasBuiltProjects', choice)}
                                  className="w-4 h-4 accent-blue-700"
                                />
                                <span className="ml-2 text-sm font-semibold">{choice}</span>
                              </label>
                            );
                          })}
                        </div>
                        {errors.hasBuiltProjects && (
                          <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.hasBuiltProjects}</span>
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-7 space-y-1.5">
                        <label htmlFor="portfolioUrl" className="block text-sm font-semibold text-slate-800">
                          GitHub / Portfolio Link{' '}
                          <span className="text-xs font-normal text-slate-500">(Optional)</span>
                        </label>
                        <input
                          id="portfolioUrl"
                          type="url"
                          value={formData.portfolioUrl}
                          onChange={(e) => updateField('portfolioUrl', e.target.value)}
                          placeholder="https://github.com/yourusername"
                          className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                            errors.portfolioUrl
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-slate-300 focus:border-blue-700'
                          }`}
                        />
                        {errors.portfolioUrl && (
                          <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.portfolioUrl}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Motivation */}
                    <div className="space-y-1.5">
                      <label htmlFor="reasonToJoin" className="block text-sm font-semibold text-slate-800">
                        Why do you want to join the AI Institute Satana 3-Month Data Analyst Training &amp; Internship Program?{' '}
                        <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        id="reasonToJoin"
                        rows={3}
                        value={formData.reasonToJoin}
                        onChange={(e) => updateField('reasonToJoin', e.target.value)}
                        placeholder="Share your career goals in Data Analytics and what you want to achieve in these 3 months..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                          errors.reasonToJoin
                            ? 'border-rose-500 focus:border-rose-600'
                            : 'border-slate-300 focus:border-blue-700'
                        }`}
                      />
                      {errors.reasonToJoin && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.reasonToJoin}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: RESUME UPLOAD, AVAILABILITY & FINAL DECLARATION */}
                {currentStep === FormStep.ResumeAndSubmit && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0" />
                      <h3 className="text-lg font-bold text-slate-900">Step 4: Resume Upload &amp; Secure Your Spot</h3>
                    </div>

                    {/* Resume / CV Dropzone */}
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-slate-800">
                        Upload Your Resume / CV <span className="text-rose-600">*</span>
                      </span>

                      {!formData.resume ? (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingFile(true);
                          }}
                          onDragLeave={() => setIsDraggingFile(false)}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-colors ${
                            isDraggingFile
                              ? 'border-blue-700 bg-blue-50/60'
                              : errors.resume
                                ? 'border-rose-400 bg-rose-50/30'
                                : 'border-slate-300 hover:border-blue-600 bg-slate-50/50'
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-blue-700 flex items-center justify-center mx-auto mb-3">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-semibold text-slate-800">
                            <span className="text-blue-700 underline underline-offset-2">Click to choose file</span> or drag and drop here
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Accepted formats: PDF, DOC, DOCX · Maximum size 10 MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {formData.resume.fileName}
                              </p>
                              <p className="text-xs text-slate-600 tabular-nums">
                                {formatBytes(formData.resume.sizeBytes)} · Ready to submit
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              updateField('resume', null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      )}

                      {errors.resume && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.resume}</span>
                        </p>
                      )}
                    </div>

                    {/* Earliest Joining Timeline */}
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-slate-800">
                        When can you join the batch? <span className="text-rose-600">*</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                        {HIRING_CONFIG.formOptions.startDates.map((option) => {
                          const selected = formData.startDate === option;
                          return (
                            <label
                              key={option}
                              className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                                selected
                                  ? 'border-blue-700 bg-blue-50/60 text-slate-900'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="startDate"
                                value={option}
                                checked={selected}
                                onChange={() => updateField('startDate', option)}
                                className="w-4 h-4 accent-blue-700 shrink-0"
                              />
                              <span className="ml-2 text-xs font-semibold">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.startDate && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.startDate}</span>
                        </p>
                      )}
                    </div>

                    {/* Preferred Learning Session Slots */}
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-slate-800">
                        Preferred Online Session Timings <span className="text-rose-600">*</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {HIRING_CONFIG.formOptions.preferredSlots.map((slot) => {
                          const checked = formData.preferredSlots.includes(slot);
                          return (
                            <label
                              key={slot}
                              className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                                checked
                                  ? 'border-blue-700 bg-blue-50/60 text-slate-900'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleArrayValue('preferredSlots', slot)}
                                className="w-4 h-4 accent-blue-700 rounded shrink-0"
                              />
                              <span className="ml-2.5 text-xs font-semibold">{slot}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.preferredSlots && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.preferredSlots}</span>
                        </p>
                      )}
                    </div>

                    {/* Consent & Fee Acknowledgment */}
                    <div className="space-y-1.5 pt-2">
                      <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consentConfirmed}
                          onChange={(e) => updateField('consentConfirmed', e.target.checked)}
                          className="w-4 h-4 accent-blue-700 rounded mt-0.5 shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          I confirm that my details are accurate and I am applying for the{' '}
                          <strong className="text-slate-900">
                            3-Month Online (Work From Home) Data Analyst Training &amp; Internship Program
                          </strong>{' '}
                          by <strong className="text-slate-900">AI Institute Satana × Grambytes Nexus Pvt. Ltd.</strong>{' '}
                          (Special Launch Offer: <strong className="text-slate-900 tabular-nums">₹4,999/- All-Inclusive Fee</strong> · First 100 Students).{' '}
                          <span className="text-rose-600">*</span>
                        </span>
                      </label>
                      {errors.consentConfirmed && (
                        <p role="alert" className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.consentConfirmed}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Step Footer Controls */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                  {currentStep > FormStep.PersonalDetails ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors whitespace-nowrap shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < FormStep.ResumeAndSubmit ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold text-sm transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Submit &amp; Proceed to AptiQuest</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
