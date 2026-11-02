/**
 * AI Institute Satana × Grambytes Nexus Pvt. Ltd.
 * Data Analyst Interns – 2026 (3-Month Work From Home Training & Internship Program)
 */

export const HIRING_CONFIG = {
  companyName: 'AI Institute Satana',
  partnerName: 'Grambytes Nexus Pvt. Ltd.',
  collaborationLabel: 'AI Institute Satana × Grambytes Nexus Pvt. Ltd.',
  motto: 'LEARN · EARN · GROW',
  logoPath: `${import.meta.env.BASE_URL}logo.png`,
  posterPath: `${import.meta.env.BASE_URL}assets/aistudio/IMG_20261102_183802_14938f11.png`,

  // Top Bar Contract: 5 concise single-line navigation links
  navigation: [
    { label: 'Highlights', href: '#about' },
    { label: 'Program Details', href: '#program-details' },
    { label: 'Skills', href: '#skills' },
    { label: 'Benefits', href: '#why-join' },
    { label: 'Contact', href: '#contact' },
  ],

  contact: {
    whatsappDisplay: '+91 83905 76960',
    whatsappHref: 'https://wa.me/918390576960',
    phoneHref: '+918390576960',
    resumeWhatsappDisplay: '+91 94049 05336',
    resumeWhatsappHref: 'https://wa.me/919404905336',
    websiteDisplay: 'www.aiinstitutesatana.in',
    websiteUrl: 'https://www.aiinstitutesatana.in',
    email: 'hr@grambytesnexus.in',
    secondaryEmail: 'contact@aiinstitutesatana.in',
    location: 'AI Institute Satana · Online – Work From Home (Pan-India)',
    officeHours: 'Monday to Saturday · 9:30 AM – 7:00 PM IST',
    socials: [
      { name: 'Website', url: 'https://www.aiinstitutesatana.in' },
      { name: 'WhatsApp', url: 'https://wa.me/918390576960' },
      { name: 'LinkedIn', url: 'https://linkedin.com' },
    ],
  },

  hero: {
    kicker: 'AI Institute Satana × Grambytes Nexus Pvt. Ltd. · Learn · Earn · Grow',
    headlinePrefix: 'Hiring |',
    headlineHighlight: 'Data Analyst Interns – 2026',
    subtitle:
      '3-Month Work From Home Training & Internship Program — Learn from anywhere and build your data analytics career.',
    description:
      'AI Institute Satana is inviting enthusiastic students, freshers, and aspiring data analysts across India to join our structured 3-Month Online (Work From Home) Training & Internship Program featuring practical training, live & recorded sessions, real-world projects, and dedicated placement support.',
    ctaPrimary: 'Apply Now & Secure Your Spot',
    ctaSecondary: 'Program Details & Fee',
    ctaNote: 'Special Launch Offer: ₹4,999/- (All-Inclusive Fee) · First 100 Students Only!',
    snapshotMetrics: [
      {
        label: 'Duration',
        value: '3 Months',
        detail: 'Training + Internship Included',
      },
      {
        label: 'Program Mode',
        value: 'Online – WFH',
        detail: 'Work From Home across India',
      },
      {
        label: 'Special Launch Offer',
        value: '₹4,999/-',
        detail: 'All-Inclusive Fee (Regular ₹25,000/-)',
      },
      {
        label: 'Limited Batch Intake',
        value: 'First 100 Students',
        detail: 'Placement Opportunity for Top 3 Performers',
      },
    ],
  },

  aboutRole: {
    title: 'Program Highlights',
    subtitle:
      'Structured 3-Month Online Training + Internship designed to turn beginners and students into job-ready Data Analysts',
    responsibilities: [
      {
        number: '01',
        title: 'Practical Data Analytics Training',
        description:
          'Step-by-step hands-on training in Excel, SQL, Power BI, and Python focused on practical industry workflows rather than rote theory.',
        iconKey: 'table',
      },
      {
        number: '02',
        title: 'Hands-on Experience with Real-World Projects',
        description:
          'Work directly on real-world business datasets to clean data, write analytical queries, and uncover actionable insights.',
        iconKey: 'database',
      },
      {
        number: '03',
        title: 'Portfolio Building',
        description:
          'Build and document end-to-end dashboards, reports, and analytical case studies that showcase your capabilities to recruiters.',
        iconKey: 'barChart',
      },
      {
        number: '04',
        title: 'Live & Recorded Learning Sessions',
        description:
          'Attend interactive live online sessions from home with complete access to recorded sessions so you never miss a concept during college or exams.',
        iconKey: 'presentation',
      },
      {
        number: '05',
        title: 'Online Mentorship & Learning Support',
        description:
          'Receive continuous online mentorship, project reviews, and doubt-solving support from experienced analytics professionals.',
        iconKey: 'lineChart',
      },
    ],
  },

  programDetails: {
    title: 'Program Details & Special Launch Offer',
    subtitle:
      'If you are passionate about data, technology, and building your career, secure your seat among the first 100 students.',
    duration: '3 Months',
    mode: 'Online – Work From Home',
    originalFee: '₹25,000/-',
    offerFee: '₹4,999/-',
    feeSubtitle: 'All-Inclusive Fee (Training + Internship Included)',
    seatLimitNote: 'SPECIAL OFFER – FIRST 100 STUDENTS ONLY!',
    includedChecklist: [
      'Complete 3-Month Practical Data Analytics Training + Internship',
      '100% Online – Work From Home flexibility from anywhere in India',
      'Live Interactive Classes + Full Recorded Session Access',
      'Real-World Projects, Portfolio Building & Online Mentorship',
      'Official Internship Experience Certificate (AI Institute Satana × Grambytes Nexus Pvt. Ltd.)',
      'Performance-Based Placement Opportunities for Top 3 Performers',
    ],
  },

  skillsSection: {
    title: 'Tools & Skills You Will Practice',
    subtitle:
      'Industry-relevant analytics tools covered during your 3-Month Training & Internship Program',
    skills: [
      {
        name: 'Microsoft Excel',
        toolsTag: 'Formulas · Pivot Tables · Data Cleaning',
        description:
          'Master lookups, conditional formulas, Pivot Charts, and spreadsheet modeling for business reporting.',
        iconKey: 'table',
      },
      {
        name: 'SQL & Databases',
        toolsTag: 'Queries · JOINs · Aggregations · Filtering',
        description:
          'Extract, join, and summarize structured datasets to answer real operational and business questions.',
        iconKey: 'database',
      },
      {
        name: 'Power BI Dashboards',
        toolsTag: 'Data Modeling · DAX · Interactive Reports',
        description:
          'Transform raw tables into executive-ready visual dashboards and KPI trackers.',
        iconKey: 'pieChart',
      },
      {
        name: 'Python for Data Analytics',
        toolsTag: 'Pandas · NumPy · Exploratory Data Analysis',
        description:
          'Clean datasets, handle missing values, and perform exploratory analysis using Python notebooks.',
        iconKey: 'terminal',
      },
      {
        name: 'Real-World Case Studies',
        toolsTag: 'Problem Solving · Business Metrics · Insights',
        description:
          'Apply analytical thinking to practical domain datasets across sales, operations, and customer growth.',
        iconKey: 'trendingUp',
      },
      {
        name: 'Portfolio & Career Readiness',
        toolsTag: 'Project Documentation · Resume · Interviews',
        description:
          'Present your completed projects clearly on GitHub/LinkedIn with structured career and placement guidance.',
        iconKey: 'presentation',
      },
    ],
  },

  eligibilitySection: {
    title: 'Who Can Apply?',
    subtitle:
      'AI Institute Satana invites enthusiastic students, freshers, and aspiring data analysts across India',
    idealDnaTitle: 'Learn · Earn · Grow',
    idealDnaSubtitle: 'Designed for passionate learners across India',
    dnaPoints: [
      {
        title: 'Enthusiastic Students',
        description: 'Final-year & pre-final-year engineering, BCA, B.Sc, MCA, MBA, or degree students across India.',
      },
      {
        title: 'Freshers & Recent Graduates',
        description: 'Graduates seeking verified internship experience, practical skills, and a strong project portfolio.',
      },
      {
        title: 'Aspiring Data Analysts',
        description: 'Beginners and career-starters passionate about data, technology, and building a high-growth career.',
      },
      {
        title: '100% Work From Home Ready',
        description: 'Anyone with a laptop/PC and internet connection ready to attend live/recorded sessions and build projects.',
      },
    ],
    groups: [
      {
        number: '01',
        title: 'Final-Year Engineering & Technical Students',
        description:
          'B.E. / B.Tech, BCA, B.Sc (CS / IT / Data Science / Statistics / Math), and MCA students looking for a 3-Month Work From Home Training & Internship.',
      },
      {
        number: '02',
        title: 'Recent Graduates & Freshers (All Streams)',
        description:
          'Graduates from Engineering, Science, Commerce (B.Com / BBA / MBA), or Arts who want practical industry-relevant Data Analytics skills from scratch.',
      },
      {
        number: '03',
        title: 'Aspiring Data Analysts Across India',
        description:
          'Self-motivated learners who want structured online mentorship, real-world project experience, and portfolio development.',
      },
      {
        number: '04',
        title: 'Placement-Focused Performers',
        description:
          'Dedicated candidates aiming to stand out in the cohort and compete for Performance-Based Placement Opportunities awarded to the Top 3 Performers.',
      },
    ],
  },

  whyJoinSection: {
    title: 'Program Benefits',
    subtitle:
      'Everything you gain during the 3-Month Work From Home Data Analyst Training & Internship Program',
    benefits: [
      {
        title: 'Internship Experience',
        description:
          'Gain verified 3-Month Data Analyst Internship experience backed by AI Institute Satana × Grambytes Nexus Pvt. Ltd.',
      },
      {
        title: 'Practical Industry-Relevant Skills',
        description:
          'Build job-ready proficiency in Excel, Power BI, SQL, and Python through structured practical training.',
      },
      {
        title: 'Real-World Project Experience',
        description:
          'Work hands-on with real-world datasets and business problem statements to build genuine analytical confidence.',
      },
      {
        title: 'Portfolio Development',
        description:
          'Create a standout analytical portfolio of dashboards and projects to showcase during job interviews.',
      },
      {
        title: 'Career & Placement Guidance',
        description:
          'Receive dedicated guidance on resume building, portfolio presentation, interview preparation, and career direction.',
      },
      {
        title: 'Placement Opportunities for Top 3 Performers',
        description:
          'Top 3 performers in the cohort unlock exclusive performance-based placement opportunities!',
      },
    ],
  },

  formOptions: {
    academicStatuses: [
      'Final-Year Student',
      'College Student (1st–3rd Year)',
      'Recent Graduate / Fresher',
      'Postgraduate Student',
      'Aspiring Data Analyst / Career Switcher',
    ],
    graduationYears: ['2024', '2025', '2026', '2027', '2028+', 'Graduated Earlier'],
    workModes: ['Online – Work From Home'],
    internshipTypes: [
      '3-Month Training + Internship (Live + Recorded)',
      'Flexible WFH Batch (Recorded + Mentor Syncs)',
    ],
    internshipDurations: ['3 Months (All-Inclusive ₹4,999/- Offer)'],
    technicalTools: [
      'Microsoft Excel / Sheets',
      'SQL Basics',
      'Power BI',
      'Python Basics',
      'Statistics / Math',
      'Complete Beginner (Ready to Learn)',
    ],
    proficiencyLevels: [
      { value: 'Beginner', detail: 'Starting fresh — joining for Training + Internship' },
      { value: 'Intermediate', detail: 'Know basics of Excel/SQL/Python, want real projects' },
      { value: 'Advanced', detail: 'Have built projects, aiming for Top 3 Placement' },
    ],
    startDates: ['Immediately (2026 Batch)', 'Within 7 Days', 'Within 15 Days', 'After College Exams'],
    preferredSlots: [
      'Morning Batch',
      'Afternoon Batch',
      'Evening Batch (College Friendly)',
      'Recorded Sessions + Live Doubt Support',
      'Weekend Special Sessions',
    ],
  },

  aptiQuest: {
    url: 'https://aptiquest-cyan.vercel.app/',
    title: 'AptiQuest — Online Aptitude Screening Test',
    subtitle:
      'Mandatory Round 1 Online Assessment administered by GramBytes Nexus for Data Analyst Interns – 2026.',
    metrics: [
      { label: 'Test Duration', value: '30 Minutes', detail: 'Live timer with auto-submit' },
      { label: 'Total Questions', value: '27 MCQs', detail: 'Objective multiple-choice' },
      { label: 'Marking Scheme', value: '+1 / 0 Neg', detail: 'No negative marking' },
      { label: 'Attempt Limit', value: '1 Attempt', detail: '1 submission per mobile no.' },
    ],
    sections: [
      {
        number: '01',
        name: 'Arithmetic Aptitude',
        topics: 'Percentages · Ratios · Averages · Profit & Loss · Time & Work · Interest',
      },
      {
        number: '02',
        name: 'Verbal Reasoning',
        topics: 'Sentence Arrangement · Direct & Indirect Speech · Comprehension',
      },
      {
        number: '03',
        name: 'Logical Deduction',
        topics: 'Number Series · Direction Sense · Clocks · Syllogisms · Classification',
      },
      {
        number: '04',
        name: 'Lateral Thinking',
        topics: 'Analytical Brainteasers · Attention to Detail · Presence of Mind',
      },
    ],
    guidelines: [
      'Use the exact same Full Name and 10-Digit Mobile Number on the AptiQuest login screen that you entered in your application form.',
      'Each 10-digit mobile number is allowed only ONE test submission. Do not refresh or close the test halfway without submitting.',
      'In the "Class / Batch (Optional)" box on AptiQuest, paste your Application ID (shown below) so our team links your test score directly to your resume.',
      'You can freely skip questions, mark questions for review, and navigate back and forth between all 27 questions within the 30-minute timer.',
      'Test scores and answers remain strictly confidential and will be evaluated by the AI Institute Satana × Grambytes Nexus screening team.',
    ],
  },
} as const;
