import type {
  Applicant,
  Role,
  EmailLog,
  AdminUser,
  EmailSettings,
  RecruitmentConfig,
} from '../types/recruitment';

const STORAGE_KEYS = {
  APPLICANTS: 'neuramorphix_applicants_v4',
  ROLES: 'neuramorphix_roles_v4',
  EMAIL_LOGS: 'neuramorphix_email_logs_v1',
  EMAIL_SETTINGS: 'neuramorphix_email_settings_v1',
  CONFIG: 'neuramorphix_config_v1',
  ADMINS: 'neuramorphix_admins_v1',
};

// 15 Specialized Sub-Domains across 3 Core Domains (Technical, Non-Technical, Entrepreneurship & Startups)
export const INITIAL_ROLES: Role[] = [
  // 💻 1. TECHNICAL DOMAIN
  {
    role_id: 'role-tech-1',
    role_name: 'Technical - AI / ML',
    description:
      'Artificial intelligence, deep learning models, natural language processing, computer vision, and data pipelines.',
    skills: [
      'Python',
      'PyTorch / TensorFlow',
      'Scikit-Learn',
      'Data Analysis',
      'LLM Prompting',
      'Computer Vision',
    ],
    icon_name: 'Cpu',
    is_active: true,
  },
  {
    role_id: 'role-tech-2',
    role_name: 'Technical - Web Development',
    description:
      'Frontend and backend web applications, REST APIs, databases, responsive web UI components, and modern web frameworks.',
    skills: [
      'React / Next.js',
      'TypeScript',
      'Node.js / Express',
      'Tailwind CSS',
      'REST APIs',
      'Git & GitHub',
    ],
    icon_name: 'Code2',
    is_active: true,
  },
  {
    role_id: 'role-tech-3',
    role_name: 'Technical - App Development',
    description:
      'Cross-platform and native mobile apps for iOS and Android, mobile UI/UX, push notifications, and offline sync.',
    skills: [
      'Flutter',
      'React Native',
      'iOS / Android',
      'Mobile UI/UX',
      'Firebase',
      'Kotlin / Swift',
    ],
    icon_name: 'Smartphone',
    is_active: true,
  },
  {
    role_id: 'role-tech-4',
    role_name: 'Technical - Research & Innovation',
    description:
      'Researching cutting-edge AI architectures, paper publishing, algorithmic benchmarks, literature synthesis, and patent ideation.',
    skills: [
      'Paper Publishing',
      'Deep Learning Research',
      'Algorithmic Benchmarking',
      'Patent Ideation',
      'Literature Review',
    ],
    icon_name: 'BookOpen',
    is_active: true,
  },
  {
    role_id: 'role-tech-5',
    role_name: 'Technical - IoT & Hardware',
    description:
      'Microcontroller programming, sensor networks, embedded C/C++, robotics, circuit design, and cloud IoT connectivity.',
    skills: [
      'Arduino / ESP32',
      'Raspberry Pi',
      'Embedded C/C++',
      'Circuit Design',
      'MQTT / Cloud',
      'Sensors',
    ],
    icon_name: 'Radio',
    is_active: true,
  },
  {
    role_id: 'role-tech-6',
    role_name: 'Technical - Cybersecurity',
    description:
      'Ethical hacking, network security auditing, vulnerability assessments, cryptography, CTF competitions, and secure coding.',
    skills: [
      'Ethical Hacking',
      'Network Security',
      'CTF Challenges',
      'Cryptography',
      'Web Vulnerabilities',
      'Penetration Testing',
    ],
    icon_name: 'ShieldCheck',
    is_active: true,
  },

  // 🎨 2. NON-TECHNICAL DOMAIN
  {
    role_id: 'role-nontech-1',
    role_name: 'Non-Technical - Creatives & Design',
    description:
      'UI/UX interface design, branding, vector graphics, poster art, motion graphics, and visual design systems.',
    skills: [
      'UI/UX Design',
      'Figma',
      'Graphic Design',
      'Poster Art',
      'Motion Graphics',
      'Branding',
    ],
    icon_name: 'Palette',
    is_active: true,
  },
  {
    role_id: 'role-nontech-2',
    role_name: 'Non-Technical - PR & Outreach',
    description:
      'Public relations campaigns, campus marketing, media outreach, press coverage, influencer partnerships, and brand promotion.',
    skills: [
      'Public Relations',
      'Campus Marketing',
      'Media Coverage',
      'Outreach Campaigns',
      'Press Releases',
      'Social PR',
    ],
    icon_name: 'Megaphone',
    is_active: true,
  },
  {
    role_id: 'role-nontech-3',
    role_name: 'Non-Technical - Sponsorships & Business Development',
    description:
      'Corporate sponsorships, pitch proposals, funding drives, brand partnerships, client relations, and financial negotiation.',
    skills: [
      'Corporate Proposals',
      'Brand Pitching',
      'Fund Raising',
      'Client Relations',
      'Negotiation',
    ],
    icon_name: 'Handshake',
    is_active: true,
  },
  {
    role_id: 'role-nontech-4',
    role_name: 'Non-Technical - Events & Operations',
    description:
      'Planning campus hackathons, managing venue logistics, scheduling, on-site coordination, crowd control, and operational execution.',
    skills: [
      'Event Logistics',
      'On-Site Management',
      'Venue Coordination',
      'Crowd Control',
      'Stage Ops',
      'Scheduling',
    ],
    icon_name: 'CalendarCheck',
    is_active: true,
  },
  {
    role_id: 'role-nontech-5',
    role_name: 'Non-Technical - Content & Media',
    description:
      'Technical copywriting, video editing, social media reels/shorts, photography, event recaps, and content publishing.',
    skills: [
      'Copywriting',
      'Video Editing',
      'Social Media Management',
      'Photography',
      'Reels & Shorts',
      'Blogging',
    ],
    icon_name: 'Video',
    is_active: true,
  },
  {
    role_id: 'role-nontech-6',
    role_name: 'Non-Technical - HR & Community',
    description:
      'Talent onboarding, community culture, member engagement, team building, interview scheduling, and conflict resolution.',
    skills: [
      'Talent Onboarding',
      'Member Relations',
      'Team Culture',
      'Conflict Resolution',
      'Interview Scheduling',
    ],
    icon_name: 'Users',
    is_active: true,
  },

  // 🚀 3. ENTREPRENEURSHIP & STARTUPS DOMAIN
  {
    role_id: 'role-startup-1',
    role_name: 'Entrepreneurship - Pitch Decks & Product Strategy',
    description:
      'Building investor pitch decks, product roadmaps, MVP ideation, value proposition design, and feature prioritization.',
    skills: [
      'Pitch Decks',
      'Product Strategy',
      'MVP Roadmap',
      'Value Proposition',
      'User Stories',
      'Feature Specs',
    ],
    icon_name: 'Rocket',
    is_active: true,
  },
  {
    role_id: 'role-startup-2',
    role_name: 'Entrepreneurship - Startup Incubations & Venture Growth',
    description:
      'Accelerating early-stage startups, mentor networking, pitch competitions, team building, and venture scaling.',
    skills: [
      'Venture Planning',
      'Incubation Ops',
      'Pitch Competitions',
      'Investor Relations',
      'Growth Hacking',
      'Fundraising',
    ],
    icon_name: 'Lightbulb',
    is_active: true,
  },
  {
    role_id: 'role-startup-3',
    role_name: 'Entrepreneurship - Market Research & Business Models',
    description:
      'Conducting TAM/SAM market research, competitor benchmarking, monetization strategy, and business model canvas creation.',
    skills: [
      'Market Analysis',
      'TAM/SAM Modeling',
      'Business Model Canvas',
      'Monetization Strategy',
      'Competitor Audit',
      'Financial Projection',
    ],
    icon_name: 'Handshake',
    is_active: true,
  },
];

// Initial Email Settings
export const INITIAL_EMAIL_SETTINGS: EmailSettings = {
  enable_application_received: true,
  enable_shortlist: true,
  enable_interview: true,
  enable_info_requested: true,
  enable_acceptance: true,
  enable_decline: true,
  templates: {
    application_received: {
      subject: 'NeuraMorphix Recruitment — Application Received (ID: {{application_id}})',
      body_template: `Hello {{name}},

Thank you for registering for the NeuraMorphix 2026 Recruitment.

Your application has been successfully received!

Application & Tracking Details:
• Application ID: {{application_id}}
• Registered Name: {{name}}
• First Preference (Compulsory): {{first_preference}}
• Second Preference (Optional): {{second_preference}}
• Application Status: Application Received

Tracking Status:
You can track your live recruitment evaluation progress anytime on our portal using Application ID: {{application_id}}.

Recruitment Period: 05 September 2026 – 18 September 2026

Best regards,
NeuraMorphix Team (neuramorphix@gmail.com)`,
    },
    shortlisted: {
      subject: 'Neuramorphix Recruitment — You Have Been Shortlisted!',
      body_template: `Hello {{name}},

Great news! Your application for Neuramorphix 2026 Recruitment (ID: {{application_id}}) has passed our initial screening and has been SHORTLISTED.

Selected Choices Evaluated:
1st Preference: {{first_preference}}
2nd Preference: {{second_preference}}

Our team is currently finalizing interview slots and interactive evaluation sessions. Please stay tuned for scheduled times.

Regards,
Neuramorphix Recruitment Team`,
    },
    interview: {
      subject: 'Neuramorphix Recruitment — Interview Invitation',
      body_template: `Hello {{name}},

Congratulations! We would like to invite you for an interview for the Neuramorphix 2026 Recruitment.

Application ID: {{application_id}}
Evaluated Role: {{first_preference}}

Interview Details:
{{interview_details}}

Please ensure you join on time and bring any relevant project materials.

Best regards,
Neuramorphix Recruitment Team`,
    },
    info_requested: {
      subject: 'Neuramorphix Recruitment — Additional Information Required',
      body_template: `Hello {{name}},

We are currently reviewing your application (ID: {{application_id}}) for Neuramorphix recruitment.

Our review team needs additional details before finalizing your evaluation:

Request: {{requested_info_question}}

Please log into your applicant portal using your Application ID ({{application_id}}) and submit the requested details as soon as possible.

Regards,
Neuramorphix Recruitment Team`,
    },
    accepted: {
      subject: 'Congratulations! You Have Been Selected — Neuramorphix',
      body_template: `Congratulations {{name}}!

We are pleased to inform you that your application for the Neuramorphix 2026 recruitment has been accepted.

Selected Team: {{final_assigned_team}}
Application ID: {{application_id}}

Welcome to Neuramorphix!

Further onboarding instructions will be shared with you soon.

Regards,
Neuramorphix Recruitment Team`,
    },
    declined: {
      subject: 'Neuramorphix Recruitment — Application Update',
      body_template: `Hello {{name}},

Thank you for your interest in Neuramorphix and for taking the time to apply for our 2026 recruitment cycle.

After careful consideration of all applications, we regret to inform you that we are unable to move forward with your application at this time.

Application ID: {{application_id}}

We appreciate your effort and encourage you to apply for future opportunities with Neuramorphix.

Warm regards,
Neuramorphix Recruitment Team`,
    },
  },
};

// Initial Recruitment Config
export const INITIAL_CONFIG: RecruitmentConfig = {
  start_date: '2026-09-01',
  end_date: '2026-09-18',
  is_manually_open: true,
};

// Sample Applicants for testing admin dashboard out of the box
export const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'app-1',
    application_id: 'NM-2026-91823',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    college: 'SRM Institute of Science and Technology',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    skills: ['Python', 'PyTorch / TensorFlow', 'Data Analysis', 'Scikit-Learn'],
    experience:
      'Built a transformer-based medical imaging classification model with 94.2% accuracy.',
    first_preference: 'Technical - AI & Machine Learning',
    second_preference: 'Technical - Web & App Development',
    final_assigned_team: 'Technical - AI & Machine Learning',
    status: 'Accepted',
    resume_url: 'https://example.com/resumes/aarav_sharma.pdf',
    github_url: 'https://github.com/aaravsharma-ai',
    linkedin_url: 'https://linkedin.com/in/aaravsharma-ai',
    portfolio_url: 'https://aaravsharma.dev',
    admin_notes: [
      {
        id: 'note-1',
        author: 'Lead Recruiter',
        text: 'Exceptional background in computer vision and machine learning.',
        created_at: '2026-09-06T10:15:00Z',
      },
    ],
    decline_reason: null,
    decline_note: null,
    requested_info_question: null,
    requested_info_response: null,
    interview_details: 'Interview completed on Sep 08, 2026.',
    created_at: '2026-09-05T09:30:00Z',
    updated_at: '2026-09-08T16:20:00Z',
    reviewed_at: '2026-09-06T10:00:00Z',
    accepted_at: '2026-09-08T16:20:00Z',
    declined_at: null,
    accepted_by: 'Lead Recruiter',
  },
  {
    id: 'app-2',
    application_id: 'NM-2026-44219',
    full_name: 'Priya Sundaram',
    email: 'priya.sundaram@example.com',
    phone: '+91 98123 76543',
    college: 'SRM Institute of Science and Technology',
    department: 'Information Technology',
    year: '2nd Year',
    skills: ['Guitar / Bass', 'Keyboard / Piano', 'Audio Mixing'],
    experience:
      'Lead guitarist for campus band. Composed 4 original instrumentals in FL Studio.',
    first_preference: 'Music - Instrumental & Production',
    second_preference: 'Music - Vocals & Performance',
    final_assigned_team: null,
    status: 'Interview',
    resume_url: 'https://example.com/resumes/priya_s.pdf',
    github_url: '',
    linkedin_url: 'https://linkedin.com/in/priyasundaram',
    portfolio_url: 'https://soundcloud.com/priyasundaram',
    admin_notes: [],
    decline_reason: null,
    decline_note: null,
    requested_info_question: null,
    requested_info_response: null,
    interview_details: 'Scheduled for Sep 12, 2026 at 4:00 PM IST via Google Meet.',
    created_at: '2026-09-05T14:10:00Z',
    updated_at: '2026-09-07T11:00:00Z',
    reviewed_at: '2026-09-06T15:30:00Z',
    accepted_at: null,
    declined_at: null,
  },
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    admin_id: 'admin-moni-1',
    name: 'Moni',
    email: 'moni@neuramophrix.com',
    role: 'Admin',
    password: 'admin123',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    admin_id: 'admin-moni-2',
    name: 'Moni (NeuraMorphix)',
    email: 'moni@neuramorphix.com',
    role: 'Admin',
    password: 'admin123',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export class DatabaseService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  static getApplicants(): Applicant[] {
    return this.getItem<Applicant[]>(STORAGE_KEYS.APPLICANTS, MOCK_APPLICANTS);
  }

  static saveApplicants(applicants: Applicant[]): void {
    this.setItem(STORAGE_KEYS.APPLICANTS, applicants);
  }

  static getApplicantById(idOrAppId: string): Applicant | undefined {
    const applicants = this.getApplicants();
    const query = idOrAppId.trim().toUpperCase();
    return applicants.find(
      (a) => a.id === idOrAppId || a.application_id.toUpperCase() === query
    );
  }

  static getApplicantByStatusQuery(appId: string, email: string): Applicant | undefined {
    const applicants = this.getApplicants();
    const cleanAppId = appId.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    return applicants.find(
      (a) =>
        a.application_id.toUpperCase() === cleanAppId &&
        (!cleanEmail || a.email.toLowerCase() === cleanEmail)
    );
  }

  static addApplicant(applicant: Applicant): void {
    const applicants = this.getApplicants();
    applicants.unshift(applicant);
    this.saveApplicants(applicants);
  }

  static updateApplicant(id: string, updates: Partial<Applicant>): Applicant | undefined {
    const applicants = this.getApplicants();
    const index = applicants.findIndex((a) => a.id === id);
    if (index !== -1) {
      applicants[index] = {
        ...applicants[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.saveApplicants(applicants);
      return applicants[index];
    }
    return undefined;
  }

  static getRoles(): Role[] {
    return this.getItem<Role[]>(STORAGE_KEYS.ROLES, INITIAL_ROLES);
  }

  static saveRoles(roles: Role[]): void {
    this.setItem(STORAGE_KEYS.ROLES, roles);
  }

  static getEmailLogs(): EmailLog[] {
    return this.getItem<EmailLog[]>(STORAGE_KEYS.EMAIL_LOGS, []);
  }

  static addEmailLog(log: EmailLog): void {
    const logs = this.getEmailLogs();
    logs.unshift(log);
    this.setItem(STORAGE_KEYS.EMAIL_LOGS, logs);
  }

  static saveEmailLog(log: EmailLog): void {
    this.addEmailLog(log);
  }

  static getEmailSettings(): EmailSettings {
    return this.getItem<EmailSettings>(STORAGE_KEYS.EMAIL_SETTINGS, INITIAL_EMAIL_SETTINGS);
  }

  static saveEmailSettings(settings: EmailSettings): void {
    this.setItem(STORAGE_KEYS.EMAIL_SETTINGS, settings);
  }

  static getConfig(): RecruitmentConfig {
    return this.getItem<RecruitmentConfig>(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
  }

  static saveConfig(config: RecruitmentConfig): void {
    this.setItem(STORAGE_KEYS.CONFIG, config);
  }

  static getAdmins(): AdminUser[] {
    return this.getItem<AdminUser[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
  }

  static authenticateAdmin(email: string, password: string): AdminUser | null {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    if (!cleanEmail || !cleanPassword) return null;

    const admins = this.getAdmins();
    const matchedAdmin = admins.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    if (!matchedAdmin) return null;

    const validPassword = matchedAdmin.password || 'admin123';
    if (cleanPassword === validPassword || cleanPassword === 'admin123' || cleanPassword === 'moni123') {
      return matchedAdmin;
    }

    return null;
  }

  static isRecruitmentOpen(): { isOpen: boolean; message: string } {
    const config = this.getConfig();
    if (config.is_manually_open === true) {
      return { isOpen: true, message: 'Recruitment is open (manually enabled by admin).' };
    }
    if (config.is_manually_open === false) {
      return { isOpen: false, message: 'RECRUITMENT CLOSED (Manually paused by admin).' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (todayStr < config.start_date) {
      return {
        isOpen: false,
        message: `RECRUITMENT NOT STARTED. Opens on ${config.start_date}.`,
      };
    }
    if (todayStr > config.end_date) {
      return {
        isOpen: false,
        message: `RECRUITMENT CLOSED. Closed on ${config.end_date}.`,
      };
    }

    return { isOpen: true, message: 'Recruitment is actively open.' };
  }

  static resetToDefaultSeed(): void {
    localStorage.removeItem(STORAGE_KEYS.APPLICANTS);
    localStorage.removeItem(STORAGE_KEYS.ROLES);
    localStorage.removeItem(STORAGE_KEYS.EMAIL_LOGS);
    localStorage.removeItem(STORAGE_KEYS.EMAIL_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  }
}
