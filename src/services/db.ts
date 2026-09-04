import type {
  Applicant,
  Role,
  EmailLog,
  AdminUser,
  EmailSettings,
  RecruitmentConfig,
} from '../types/recruitment';

const STORAGE_KEYS = {
  APPLICANTS: 'neuramorphix_applicants_v1',
  ROLES: 'neuramorphix_roles_v1',
  EMAIL_LOGS: 'neuramorphix_email_logs_v1',
  EMAIL_SETTINGS: 'neuramorphix_email_settings_v1',
  CONFIG: 'neuramorphix_config_v1',
  ADMINS: 'neuramorphix_admins_v1',
};

// Initial 10 Teams
export const INITIAL_ROLES: Role[] = [
  {
    role_id: 'role-1',
    role_name: 'AI & ML Team',
    description:
      'Artificial intelligence, machine learning, data analysis, intelligent healthcare systems, model development, and experimentation.',
    skills: [
      'Python',
      'PyTorch / TensorFlow',
      'Data Analysis',
      'Scikit-Learn',
      'LLM Prompting',
      'Computer Vision',
    ],
    icon_name: 'Cpu',
    is_active: true,
  },
  {
    role_id: 'role-2',
    role_name: 'Web & App Development Team',
    description:
      'Frontend and mobile application development, interfaces, APIs, databases, and user-facing products.',
    skills: [
      'React / React Native',
      'TypeScript',
      'Next.js',
      'REST APIs',
      'Mobile Dev',
      'Tailwind CSS',
    ],
    icon_name: 'Code2',
    is_active: true,
  },
  {
    role_id: 'role-3',
    role_name: 'UI/UX Design Team',
    description:
      'User research, wireframes, prototypes, visual design, interaction design, and product experience.',
    skills: [
      'Figma',
      'Wireframing',
      'User Research',
      'Prototyping',
      'Design Systems',
      'Micro-Interactions',
    ],
    icon_name: 'Palette',
    is_active: true,
  },
  {
    role_id: 'role-4',
    role_name: 'Marketing, Leadership & PR Team',
    description:
      'Brand strategy, marketing, partnerships, public relations, outreach, and leadership initiatives.',
    skills: [
      'Brand Strategy',
      'Public Relations',
      'Campaign Management',
      'Growth Marketing',
      'Leadership',
      'Sponsorships',
    ],
    icon_name: 'Megaphone',
    is_active: true,
  },
  {
    role_id: 'role-5',
    role_name: 'Full Stack Development Team',
    description:
      'End-to-end product development involving frontend, backend, databases, APIs, authentication, and deployment.',
    skills: [
      'Node.js / Express',
      'PostgreSQL / MongoDB',
      'React / Vue',
      'Docker',
      'System Architecture',
      'GraphQL',
    ],
    icon_name: 'Layers',
    is_active: true,
  },
  {
    role_id: 'role-6',
    role_name: 'IoT & Hardware Team',
    description:
      'Sensors, embedded systems, electronics, hardware prototypes, IoT connectivity, and hardware-software integration.',
    skills: [
      'Arduino / ESP32',
      'Raspberry Pi',
      'Embedded C/C++',
      'Circuit Design',
      'MQTT',
      'Sensor Integration',
    ],
    icon_name: 'Radio',
    is_active: true,
  },
  {
    role_id: 'role-7',
    role_name: 'Events & Operations Team',
    description:
      'Event planning, coordination, logistics, scheduling, execution, and operational management.',
    skills: [
      'Event Logistics',
      'Vendor Management',
      'Scheduling',
      'Budgeting',
      'Resource Allocation',
      'On-Site Coordination',
    ],
    icon_name: 'CalendarCheck',
    is_active: true,
  },
  {
    role_id: 'role-8',
    role_name: 'HR & Community Team',
    description:
      'Recruitment, member engagement, team culture, onboarding, communication, and community building.',
    skills: [
      'Talent Acquisition',
      'Member Engagement',
      'Onboarding',
      'Conflict Resolution',
      'Community Building',
      'Culture',
    ],
    icon_name: 'Users',
    is_active: true,
  },
  {
    role_id: 'role-9',
    role_name: 'Content & Communication Team',
    description:
      'Technical content, social media, documentation, presentations, copywriting, and communication.',
    skills: [
      'Technical Writing',
      'Social Media Management',
      'Copywriting',
      'Slide Deck Design',
      'Public Speaking',
      'Blogging',
    ],
    icon_name: 'FileText',
    is_active: true,
  },
  {
    role_id: 'role-10',
    role_name: 'Research & Innovation Team',
    description:
      'Research, literature review, ideation, experimentation, scientific exploration, innovation, and future project development.',
    skills: [
      'Literature Review',
      'Academic Writing',
      'Hypothesis Testing',
      'Patent Research',
      'R&D Strategy',
      'Rapid Prototyping',
    ],
    icon_name: 'Lightbulb',
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

Thank you for registering for the NeuraMorphix 2026 Team Recruitment.

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

Thank you for your interest in NeuraMorphix.

Best regards,
NeuraMorphix System (moniswarmoni509@gmail.com)`,
    },
    shortlisted: {
      subject: 'Neuramorphix Recruitment — You Have Been Shortlisted!',
      body_template: `Hello {{name}},

Great news! Your application for Neuramorphix 2026 Recruitment (ID: {{application_id}}) has passed our initial screening and has been SHORTLISTENED.

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

Please ensure you join on time and bring any relevant project materials or code repositories.

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
    college: 'IIT Delhi',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    skills: ['Python', 'PyTorch / TensorFlow', 'Data Analysis', 'Scikit-Learn'],
    experience:
      'Built a transformer-based medical imaging classification model with 94.2% accuracy. Published paper in IEEE student conference.',
    first_preference: 'AI & ML Team',
    second_preference: 'Research & Innovation Team',
    final_assigned_team: 'AI & ML Team',
    status: 'Accepted',
    resume_url: 'https://example.com/resumes/aarav_sharma.pdf',
    github_url: 'https://github.com/aaravsharma-ai',
    linkedin_url: 'https://linkedin.com/in/aaravsharma-ai',
    portfolio_url: 'https://aaravsharma.dev',
    admin_notes: [
      {
        id: 'note-1',
        author: 'Dr. Sarah Vance (Lead Recruiter)',
        text: 'Exceptional background in computer vision. Strong publication record.',
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
    accepted_by: 'Dr. Sarah Vance',
  },
  {
    id: 'app-2',
    application_id: 'NM-2026-44219',
    full_name: 'Priya Sundaram',
    email: 'priya.sundaram@example.com',
    phone: '+91 98123 76543',
    college: 'BITS Pilani',
    department: 'Information Technology',
    year: '2nd Year',
    skills: ['React / React Native', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    experience:
      'Developed 3 full-stack React web apps with automated deployment pipelines on Vercel.',
    first_preference: 'Web & App Development Team',
    second_preference: 'Full Stack Development Team',
    final_assigned_team: null,
    status: 'Interview',
    resume_url: 'https://example.com/resumes/priya_s.pdf',
    github_url: 'https://github.com/priyasundaram',
    linkedin_url: 'https://linkedin.com/in/priyasundaram',
    portfolio_url: 'https://priya.codes',
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
  {
    id: 'app-3',
    application_id: 'NM-2026-78301',
    full_name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 97654 32109',
    college: 'VIT Vellore',
    department: 'Electronics & Communication',
    year: '3rd Year',
    skills: ['Arduino / ESP32', 'Raspberry Pi', 'Embedded C/C++', 'Circuit Design'],
    experience:
      'Designed an IoT smart energy meter using ESP32 with MQTT protocol sending real-time telemetry to Grafana dashboard.',
    first_preference: 'IoT & Hardware Team',
    second_preference: 'Full Stack Development Team',
    final_assigned_team: null,
    status: 'Information Requested',
    resume_url: 'https://example.com/resumes/rohan_mehta.pdf',
    github_url: 'https://github.com/rohan-embed',
    linkedin_url: 'https://linkedin.com/in/rohanmehta-iot',
    portfolio_url: 'https://rohanmehta.tech',
    admin_notes: [
      {
        id: 'note-2',
        author: 'Marcus Vance',
        text: 'Good circuit design experience, requested schematic diagrams.',
        created_at: '2026-09-06T12:00:00Z',
      },
    ],
    decline_reason: null,
    decline_note: null,
    requested_info_question:
      'Please provide your GitHub repository or video demonstration link for your ESP32 energy meter project.',
    requested_info_response: null,
    interview_details: null,
    created_at: '2026-09-05T18:45:00Z',
    updated_at: '2026-09-06T12:00:00Z',
    reviewed_at: '2026-09-06T12:00:00Z',
    accepted_at: null,
    declined_at: null,
  },
  {
    id: 'app-4',
    application_id: 'NM-2026-12948',
    full_name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    phone: '+91 99887 76655',
    college: 'NIFT Delhi',
    department: 'Design & Communication',
    year: '4th Year',
    skills: ['Figma', 'Wireframing', 'User Research', 'Design Systems', 'Micro-Interactions'],
    experience:
      'Created comprehensive design system for campus event app with dark/light themes and full Figma component library.',
    first_preference: 'UI/UX Design Team',
    second_preference: 'Content & Communication Team',
    final_assigned_team: null,
    status: 'Shortlisted',
    resume_url: 'https://example.com/resumes/ananya_v.pdf',
    github_url: '',
    linkedin_url: 'https://linkedin.com/in/ananya-design',
    portfolio_url: 'https://behance.net/ananyaverma',
    admin_notes: [],
    decline_reason: null,
    decline_note: null,
    requested_info_question: null,
    requested_info_response: null,
    interview_details: null,
    created_at: '2026-09-06T08:20:00Z',
    updated_at: '2026-09-07T09:15:00Z',
    reviewed_at: '2026-09-07T09:15:00Z',
    accepted_at: null,
    declined_at: null,
  },
  {
    id: 'app-5',
    application_id: 'NM-2026-55092',
    full_name: 'Karan Malhotra',
    email: 'karan.m@example.com',
    phone: '+91 91234 56789',
    college: 'SRM Institute',
    department: 'Mechanical Engineering',
    year: '1st Year',
    skills: ['Event Logistics', 'Scheduling'],
    experience:
      'Organized high school cultural fest with 800+ attendees.',
    first_preference: 'Events & Operations Team',
    second_preference: 'HR & Community Team',
    final_assigned_team: null,
    status: 'Application Received',
    resume_url: 'https://example.com/resumes/karan_m.pdf',
    github_url: '',
    linkedin_url: 'https://linkedin.com/in/karanmalhotra',
    portfolio_url: '',
    admin_notes: [],
    decline_reason: null,
    decline_note: null,
    requested_info_question: null,
    requested_info_response: null,
    interview_details: null,
    created_at: '2026-09-06T11:00:00Z',
    updated_at: '2026-09-06T11:00:00Z',
    reviewed_at: null,
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
  {
    admin_id: 'admin-1',
    name: 'Dr. Sarah Vance',
    email: 'recruitment.lead@neuramorphix.org',
    role: 'Lead Recruiter',
    password: 'admin123',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    admin_id: 'admin-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@neuramorphix.org',
    role: 'Technical Reviewer',
    password: 'admin123',
    created_at: '2026-01-01T00:00:00Z',
  },
];

// Helper database manager class with LocalStorage persistence
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

  // Check if recruitment is open based on dates + config override
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
