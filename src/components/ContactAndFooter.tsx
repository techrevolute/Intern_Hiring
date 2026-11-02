import { useState } from 'react';
import { ArrowUpRight, Globe, Mail, MessageCircle, Phone } from 'lucide-react';
import { HIRING_CONFIG } from '../config/hiringConfig';

interface ContactAndFooterProps {
  onOpenPortal: (tab: 'status' | 'recruiter') => void;
}

export function ContactAndFooter({ onOpenPortal }: ContactAndFooterProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              {HIRING_CONFIG.collaborationLabel} · {HIRING_CONFIG.motto}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact &amp; Admissions Support
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              Have questions about the 3-Month Work From Home Training &amp; Internship Program or the ₹4,999/- Special Launch Offer (First 100 Students)? Reach out to us directly on WhatsApp, Email, or our Website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* WhatsApp Admissions Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">WhatsApp Inquiry</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Direct WhatsApp helpline for program details &amp; enrollment support.
                </p>
              </div>
              <a
                href={HIRING_CONFIG.contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline tabular-nums"
              >
                {HIRING_CONFIG.contact.whatsappDisplay}
              </a>
            </div>

            {/* WhatsApp Resume Desk Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">WhatsApp Your Resume</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Dedicated HR resume submission &amp; candidate coordination number.
                </p>
              </div>
              <a
                href={HIRING_CONFIG.contact.resumeWhatsappHref}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline tabular-nums"
              >
                {HIRING_CONFIG.contact.resumeWhatsappDisplay}
              </a>
            </div>

            {/* Official Website Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">Official Website</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Explore AI Institute Satana programs, initiatives, and announcements.
                </p>
              </div>
              <a
                href={HIRING_CONFIG.contact.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline break-all"
              >
                {HIRING_CONFIG.contact.websiteDisplay}
              </a>
            </div>

            {/* HR Email Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">HR &amp; Support Email</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Write to our recruitment desk for queries or institutional tie-ups.
                </p>
              </div>
              <div className="space-y-1">
                <a
                  href={`mailto:${HIRING_CONFIG.contact.email}`}
                  className="block text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline break-all"
                >
                  {HIRING_CONFIG.contact.email}
                </a>
                <a
                  href={`mailto:${HIRING_CONFIG.contact.secondaryEmail}`}
                  className="block text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline break-all"
                >
                  {HIRING_CONFIG.contact.secondaryEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-800/80">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                {!logoError ? (
                  <img
                    src={HIRING_CONFIG.logoPath}
                    alt={`${HIRING_CONFIG.companyName} logo`}
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                    className="h-9 w-9 object-contain rounded-lg bg-white p-0.5 shrink-0"
                  />
                ) : (
                  <span className="h-9 w-9 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    AI
                  </span>
                )}
                <span className="text-lg font-bold text-white tracking-tight">
                  {HIRING_CONFIG.collaborationLabel}
                </span>
              </div>
              <p className="text-xs font-semibold tracking-wider text-blue-300">
                {HIRING_CONFIG.motto}
              </p>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                3-Month Online (Work From Home) Data Analyst Training &amp; Internship Program – 2026. Practical training, real-world projects, portfolio building, and career guidance.
              </p>
            </div>

            {/* Campaign Navigation Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200">Program Sections</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    Overview
                  </a>
                </li>
                {HIRING_CONFIG.navigation.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Applicant & Recruiter Utilities */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200">Secure Your Spot</h4>
              <p className="text-sm text-slate-400 leading-relaxed tabular-nums">
                Special Launch Offer: ₹4,999/- All-Inclusive · Open for First 100 Students Only!
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <a
                  href="#application"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg text-xs transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => onOpenPortal('status')}
                  className="px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors whitespace-nowrap shrink-0"
                >
                  Track Status
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPortal('recruiter')}
                  className="px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors whitespace-nowrap shrink-0"
                >
                  Recruiter Portal
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              &copy; 2026 {HIRING_CONFIG.collaborationLabel}. All rights reserved. {HIRING_CONFIG.motto}.
            </p>
            <div className="flex items-center gap-5">
              {HIRING_CONFIG.contact.socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-300 transition-colors"
                >
                  {soc.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
