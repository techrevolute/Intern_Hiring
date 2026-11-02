import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  Database,
  LineChart,
  MessageCircle,
  PieChart,
  Presentation,
  Table2,
  Terminal,
  TrendingUp,
} from 'lucide-react';
import { HIRING_CONFIG } from '../config/hiringConfig';

function renderSkillOrRoleIcon(iconKey: string) {
  switch (iconKey) {
    case 'database':
      return <Database className="w-5 h-5" />;
    case 'code':
      return <Code2 className="w-5 h-5" />;
    case 'barChart':
      return <BarChart3 className="w-5 h-5" />;
    case 'lineChart':
      return <LineChart className="w-5 h-5" />;
    case 'table':
      return <Table2 className="w-5 h-5" />;
    case 'pieChart':
      return <PieChart className="w-5 h-5" />;
    case 'terminal':
      return <Terminal className="w-5 h-5" />;
    case 'trendingUp':
      return <TrendingUp className="w-5 h-5" />;
    case 'presentation':
      return <Presentation className="w-5 h-5" />;
    default:
      return <BarChart3 className="w-5 h-5" />;
  }
}

export function RoleAndSkillsSections() {
  const [posterFailed, setPosterFailed] = useState(false);

  return (
    <>
      {/* 1. Program Highlights Section (5 Core Highlights) */}
      <section id="about" className="py-20 md:py-24 bg-white border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              3-Month Work From Home Training &amp; Internship · {HIRING_CONFIG.motto}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              {HIRING_CONFIG.aboutRole.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              {HIRING_CONFIG.aboutRole.subtitle}
            </p>
          </div>

          {/* 5 Program Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIRING_CONFIG.aboutRole.responsibilities.map((item, idx) => (
              <div
                key={item.number}
                className={`bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 transition-colors duration-150 flex flex-col justify-between ${
                  idx === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums">
                      {item.number}.
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      {renderSkillOrRoleIcon(item.iconKey)}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Program Details & Special Launch Offer Section + Official Campaign Poster */}
      <section id="program-details" className="py-20 md:py-24 bg-slate-50 border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Structured Program Details & ₹4,999/- Special Launch Offer */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-2">
                  {HIRING_CONFIG.programDetails.seatLimitNote}
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
                  {HIRING_CONFIG.programDetails.title}
                </h2>
                <p className="text-base text-slate-600 mt-3 leading-relaxed">
                  {HIRING_CONFIG.programDetails.subtitle}
                </p>
              </div>

              {/* Key Program Specs Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-6 border-b border-slate-200">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Duration</p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
                      {HIRING_CONFIG.programDetails.duration}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Training + Internship</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Mode</p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">
                      Online – WFH
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Work From Home</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Special Launch Offer</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-blue-700 tabular-nums">
                        {HIRING_CONFIG.programDetails.offerFee}
                      </span>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        {HIRING_CONFIG.programDetails.originalFee}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-emerald-700 mt-0.5">
                      All-Inclusive Fee
                    </p>
                  </div>
                </div>

                {/* What's Included List */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-900">
                    Everything Included in the All-Inclusive Program:
                  </p>
                  <ul className="space-y-2.5">
                    {HIRING_CONFIG.programDetails.includedChecklist.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href="#application"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Apply Now &amp; Secure Your Spot</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={HIRING_CONFIG.contact.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl text-sm border border-slate-200 transition-colors whitespace-nowrap shrink-0 tabular-nums"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp: {HIRING_CONFIG.contact.whatsappDisplay}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Official Campaign Poster */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
                {!posterFailed ? (
                  <img
                    src={HIRING_CONFIG.posterPath}
                    alt="AI Institute Satana × Grambytes Nexus Pvt. Ltd. — Hiring for Data Analyst Internship 2026 Poster"
                    referrerPolicy="no-referrer"
                    onError={() => setPosterFailed(true)}
                    className="w-full h-auto rounded-xl object-contain"
                  />
                ) : (
                  <div className="p-8 rounded-xl bg-slate-900 text-white text-center space-y-3">
                    <p className="text-xs font-semibold text-blue-300">
                      {HIRING_CONFIG.collaborationLabel}
                    </p>
                    <p className="text-2xl font-extrabold">Data Analyst Interns – 2026</p>
                    <p className="text-sm text-slate-300">
                      3 Months · Online – Work From Home · ₹4,999/- All-Inclusive Fee
                    </p>
                    <p className="text-xs text-amber-300 font-semibold">
                      Special Offer – First 100 Students Only!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Benefits Section (Exact 6 Program Benefits) */}
      <section id="why-join" className="py-20 md:py-24 bg-white border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              Career Outcomes · Performance-Based Placement Support
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              {HIRING_CONFIG.whyJoinSection.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              {HIRING_CONFIG.whyJoinSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIRING_CONFIG.whyJoinSection.benefits.map((benefit, idx) => {
              const isPlacementCard = idx === 5;
              return (
                <div
                  key={benefit.title}
                  className={`rounded-2xl p-6 border flex flex-col justify-between ${
                    isPlacementCard
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50/70 text-slate-900 border-slate-200'
                  }`}
                >
                  <div>
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums block mb-3 ${
                        isPlacementCard ? 'text-amber-300' : 'text-blue-700'
                      }`}
                    >
                      0{idx + 1}.
                    </span>
                    <h3
                      className={`text-lg font-bold mb-2 ${
                        isPlacementCard ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isPlacementCard ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Tools & Skills Section */}
      <section id="skills" className="py-20 md:py-24 bg-slate-50 border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              Practical Analytics Stack · Beginner to Portfolio-Ready
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              {HIRING_CONFIG.skillsSection.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              {HIRING_CONFIG.skillsSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIRING_CONFIG.skillsSection.skills.map((skill) => (
              <div
                key={skill.name}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-150"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                  {renderSkillOrRoleIcon(skill.iconKey)}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{skill.name}</h3>
                <p className="text-xs font-medium text-blue-700 mt-1 mb-3">{skill.toolsTag}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Who Can Apply? / Eligibility Section */}
      <section id="eligibility" className="py-20 md:py-24 bg-white border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              Open Across India · Students, Freshers &amp; Aspiring Data Analysts
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              {HIRING_CONFIG.eligibilitySection.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              {HIRING_CONFIG.eligibilitySection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Ideal Learner Card */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-7 sm:p-8">
              <p className="text-xs font-medium text-blue-300 mb-1">
                {HIRING_CONFIG.eligibilitySection.idealDnaSubtitle}
              </p>
              <h3 className="text-xl font-bold text-white mb-6">
                {HIRING_CONFIG.eligibilitySection.idealDnaTitle}
              </h3>

              <ul className="space-y-5">
                {HIRING_CONFIG.eligibilitySection.dnaPoints.map((point) => (
                  <li key={point.title} className="flex items-start gap-3.5">
                    <span className="w-5 h-5 rounded-md bg-blue-600/30 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-white block">{point.title}</span>
                      <span className="text-xs text-slate-300 leading-relaxed block mt-0.5">
                        {point.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-300">
                  Special Offer: <strong className="text-white tabular-nums">First 100 Students Only</strong>
                </p>
                <a
                  href="#application"
                  className="text-xs font-semibold text-blue-300 hover:text-white underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  Secure Your Spot
                </a>
              </div>
            </div>

            {/* Right Eligibility Pathways List */}
            <div className="lg:col-span-7 divide-y divide-slate-200 border-y border-slate-200">
              {HIRING_CONFIG.eligibilitySection.groups.map((group) => (
                <div key={group.number} className="py-6 first:pt-5 last:pb-5 flex items-start gap-4">
                  <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums mt-1 shrink-0">
                    {group.number}.
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{group.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1.5">{group.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
