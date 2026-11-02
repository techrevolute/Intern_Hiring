import { useState } from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { HIRING_CONFIG } from '../config/hiringConfig';
import heroShowcaseImg from '../assets/images/data_analyst_intern_hero_1793624918962.jpg';

export function HeroSection() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-20 md:pb-24 tech-grid-pattern border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Balanced Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Proposition Column */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Unboxed partnership & motto metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-blue-700">
              <span>{HIRING_CONFIG.companyName} × {HIRING_CONFIG.partnerName}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-700">{HIRING_CONFIG.motto}</span>
            </div>

            <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold text-slate-900 tracking-tight leading-[1.12] [text-wrap:balance]">
              {HIRING_CONFIG.hero.headlinePrefix}{' '}
              <span className="text-blue-700">{HIRING_CONFIG.hero.headlineHighlight}</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-800 leading-snug max-w-xl">
              {HIRING_CONFIG.hero.subtitle}
            </p>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              {HIRING_CONFIG.hero.description}
            </p>

            {/* Primary & Secondary Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#application"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-base transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <span>{HIRING_CONFIG.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#program-details"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold rounded-xl text-base border border-slate-200 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {HIRING_CONFIG.hero.ctaSecondary}
              </a>
            </div>

            <p className="text-xs font-semibold text-amber-800">
              {HIRING_CONFIG.hero.ctaNote}
            </p>
          </div>

          {/* Right Media Showcase Column */}
          <div className="lg:col-span-6 flex items-stretch">
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative min-h-[300px] sm:min-h-[360px] lg:h-full">
              {!imgFailed ? (
                <img
                  src={heroShowcaseImg}
                  alt="Data Analyst Interns – 2026 Work From Home Training and Internship Program by AI Institute Satana"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover aspect-video lg:aspect-auto"
                />
              ) : (
                <div className="w-full h-full min-h-[340px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col items-center justify-center p-8 text-center text-white">
                  <BarChart3 className="w-12 h-12 text-blue-400 mb-3" />
                  <p className="text-lg font-bold">AI Institute Satana × Grambytes Nexus</p>
                  <p className="text-sm text-slate-300 mt-1 max-w-sm">
                    3-Month Work From Home Data Analyst Training &amp; Internship Program
                  </p>
                </div>
              )}

              {/* Measured Contrast Scrim for Legible Overlay Caption */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-5 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-blue-200">
                      Online – Work From Home · Live &amp; Recorded Sessions
                    </p>
                    <p className="text-base sm:text-lg font-bold tracking-tight text-white mt-0.5">
                      Practical Training · Real-World Projects · Portfolio Building
                    </p>
                  </div>
                  <p className="text-xs font-mono tabular-nums text-amber-300 font-semibold shrink-0">
                    Offer: ₹4,999/- · First 100 Students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Program Snapshot Strip Below Hero Split */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          {HIRING_CONFIG.hero.snapshotMetrics.map((metric) => (
            <div key={metric.label} className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500">{metric.label}</p>
              <p className="text-lg font-bold text-slate-900 mt-1 font-display tabular-nums">
                {metric.value}
              </p>
              <p className="text-xs text-slate-500 mt-1 tabular-nums">{metric.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
