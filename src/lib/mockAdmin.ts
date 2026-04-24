/**
 * Mock data for the System Admin & Super Admin back-office:
 * - Back-office users
 * - Roles + permission matrix
 * - Licence categories
 * - Rubric templates
 * - System configuration defaults
 * - Feature flags
 * - Working calendar (UAE) + holidays
 * - Licence holders for suspension/revocation
 * - DSR register
 * - Breach incidents
 * - Security posture (WAF, IP allowlist, scans)
 * - API keys + webhooks
 * - Operational KPIs
 */

export type AdminRole =
  | "Assessor"
  | "SeniorAssessor"
  | "AppealsOfficer"
  | "FinanceOfficer"
  | "ContentEditor"
  | "SystemAdmin"
  | "SuperAdmin"
  | "Auditor";

export interface BackOfficeUser {
  id: string;
  fullName: string;
  fullNameAr: string;
  email: string;
  role: AdminRole;
  status: "Active" | "Inactive" | "Locked";
  mfaEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  sessions: { ip: string; device: string; lastActive: Date }[];
}

const now = Date.now();
const d = (n: number) => 1000 * 60 * 60 * 24 * n;
const h = (n: number) => 1000 * 60 * 60 * n;

export const mockUsers: BackOfficeUser[] = [
  {
    id: "u-001",
    fullName: "Aisha Al Mansoori",
    fullNameAr: "عائشة المنصوري",
    email: "aisha.mansoori@adveti.ae",
    role: "SuperAdmin",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - h(2)),
    createdAt: new Date(now - d(420)),
    sessions: [
      { ip: "10.42.1.18", device: "Chrome / macOS", lastActive: new Date(now - h(2)) },
    ],
  },
  {
    id: "u-002",
    fullName: "Hamad Al Ameri",
    fullNameAr: "حمد العامري",
    email: "hamad.ameri@adveti.ae",
    role: "SystemAdmin",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - h(6)),
    createdAt: new Date(now - d(380)),
    sessions: [
      { ip: "10.42.1.22", device: "Edge / Windows", lastActive: new Date(now - h(6)) },
    ],
  },
  {
    id: "u-003",
    fullName: "Omar Al Marzooqi",
    fullNameAr: "عمر المرزوقي",
    email: "omar.marzooqi@adveti.ae",
    role: "Assessor",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - h(1)),
    createdAt: new Date(now - d(210)),
    sessions: [
      { ip: "10.42.7.4", device: "Safari / iOS", lastActive: new Date(now - h(1)) },
    ],
  },
  {
    id: "u-004",
    fullName: "Sara Al Suwaidi",
    fullNameAr: "سارة السويدي",
    email: "sara.suwaidi@adveti.ae",
    role: "SeniorAssessor",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - h(4)),
    createdAt: new Date(now - d(310)),
    sessions: [
      { ip: "10.42.7.18", device: "Chrome / Windows", lastActive: new Date(now - h(4)) },
    ],
  },
  {
    id: "u-005",
    fullName: "Khalid Al Hosani",
    fullNameAr: "خالد الحوسني",
    email: "khalid.hosani@adveti.ae",
    role: "FinanceOfficer",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - d(1)),
    createdAt: new Date(now - d(265)),
    sessions: [],
  },
  {
    id: "u-006",
    fullName: "Noura Al Ali",
    fullNameAr: "نورة العلي",
    email: "noura.ali@adveti.ae",
    role: "ContentEditor",
    status: "Active",
    mfaEnabled: false,
    lastLoginAt: new Date(now - d(3)),
    createdAt: new Date(now - d(150)),
    sessions: [],
  },
  {
    id: "u-007",
    fullName: "Mohammed Al Shamsi",
    fullNameAr: "محمد الشامسي",
    email: "mohammed.shamsi@adveti.ae",
    role: "Auditor",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - d(5)),
    createdAt: new Date(now - d(195)),
    sessions: [],
  },
  {
    id: "u-008",
    fullName: "Maryam Al Dhaheri",
    fullNameAr: "مريم الظاهري",
    email: "maryam.dhaheri@adveti.ae",
    role: "Assessor",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - h(8)),
    createdAt: new Date(now - d(95)),
    sessions: [
      { ip: "10.42.7.31", device: "Chrome / Windows", lastActive: new Date(now - h(8)) },
    ],
  },
  {
    id: "u-009",
    fullName: "Ahmed Al Mansoori",
    fullNameAr: "أحمد المنصوري",
    email: "ahmed.mansoori@adveti.ae",
    role: "Assessor",
    status: "Inactive",
    mfaEnabled: true,
    lastLoginAt: new Date(now - d(45)),
    createdAt: new Date(now - d(220)),
    sessions: [],
  },
  {
    id: "u-010",
    fullName: "Fatima Al Suwaidi",
    fullNameAr: "فاطمة السويدي",
    email: "fatima.suwaidi@adveti.ae",
    role: "AppealsOfficer",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - d(2)),
    createdAt: new Date(now - d(120)),
    sessions: [],
  },
  {
    id: "u-011",
    fullName: "Sultan Al Zaabi",
    fullNameAr: "سلطان الزعابي",
    email: "sultan.zaabi@adveti.ae",
    role: "Assessor",
    status: "Locked",
    mfaEnabled: true,
    lastLoginAt: new Date(now - d(12)),
    createdAt: new Date(now - d(180)),
    sessions: [],
  },
  {
    id: "u-012",
    fullName: "Reem Al Mehairi",
    fullNameAr: "ريم المهيري",
    email: "reem.mehairi@adveti.ae",
    role: "ContentEditor",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - h(20)),
    createdAt: new Date(now - d(85)),
    sessions: [],
  },
  {
    id: "u-013",
    fullName: "Tariq Al Blooshi",
    fullNameAr: "طارق البلوشي",
    email: "tariq.blooshi@adveti.ae",
    role: "Auditor",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - d(7)),
    createdAt: new Date(now - d(310)),
    sessions: [],
  },
  {
    id: "u-014",
    fullName: "Hessa Al Khoori",
    fullNameAr: "حصة الخوري",
    email: "hessa.khoori@adveti.ae",
    role: "FinanceOfficer",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - d(1)),
    createdAt: new Date(now - d(60)),
    sessions: [],
  },
  {
    id: "u-015",
    fullName: "Yousef Al Falasi",
    fullNameAr: "يوسف الفلاسي",
    email: "yousef.falasi@adveti.ae",
    role: "SeniorAssessor",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - h(30)),
    createdAt: new Date(now - d(170)),
    sessions: [],
  },
  {
    id: "u-016",
    fullName: "Latifa Al Ali",
    fullNameAr: "لطيفة العلي",
    email: "latifa.ali@adveti.ae",
    role: "Assessor",
    status: "Active",
    mfaEnabled: false,
    lastLoginAt: new Date(now - d(4)),
    createdAt: new Date(now - d(40)),
    sessions: [],
  },
  {
    id: "u-017",
    fullName: "Abdulrahman Al Jneibi",
    fullNameAr: "عبدالرحمن الجنيبي",
    email: "abdulrahman.jneibi@adveti.ae",
    role: "SystemAdmin",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: new Date(now - h(12)),
    createdAt: new Date(now - d(230)),
    sessions: [],
  },
  {
    id: "u-018",
    fullName: "Shamma Al Hammadi",
    fullNameAr: "شما الحمادي",
    email: "shamma.hammadi@adveti.ae",
    role: "Assessor",
    status: "Active",
    mfaEnabled: true,
    lastLoginAt: null,
    createdAt: new Date(now - d(2)),
    sessions: [],
  },
];

// ===== Roles & Permissions =====
export type RoleKey =
  | "Guest"
  | "Applicant"
  | "Verifier"
  | "Assessor"
  | "SeniorAssessor"
  | "AppealsOfficer"
  | "FinanceOfficer"
  | "ContentEditor"
  | "Auditor"
  | "SystemAdmin"
  | "SuperAdmin";

export interface RoleDef {
  key: RoleKey;
  en: string;
  ar: string;
  immutable: boolean;
  activeUserCount: number;
  description: string;
  descriptionAr: string;
}

export const roleDefs: RoleDef[] = [
  { key: "Guest", en: "Guest", ar: "زائر", immutable: true, activeUserCount: 0, description: "Anonymous public visitor", descriptionAr: "زائر عام مجهول" },
  { key: "Applicant", en: "Applicant", ar: "مقدم طلب", immutable: true, activeUserCount: 1248, description: "Authenticated applicant via UAE Pass", descriptionAr: "مقدم طلب موثّق عبر الهوية الرقمية" },
  { key: "Verifier", en: "Verifier", ar: "متحقق", immutable: true, activeUserCount: 0, description: "Public QR verification only", descriptionAr: "تحقق عام عبر رمز الاستجابة فقط" },
  { key: "Assessor", en: "Assessor", ar: "مقيّم", immutable: false, activeUserCount: 6, description: "Reviews assigned applications", descriptionAr: "يراجع الطلبات المُسندة إليه" },
  { key: "SeniorAssessor", en: "Senior Assessor", ar: "كبير المقيّمين", immutable: false, activeUserCount: 2, description: "Approves or overrides assessor decisions", descriptionAr: "يعتمد قرارات المقيمين أو يلغيها" },
  { key: "AppealsOfficer", en: "Appeals Officer", ar: "مسؤول الاستئنافات", immutable: false, activeUserCount: 1, description: "Read-only access to applications (V1)", descriptionAr: "وصول للقراءة فقط للطلبات (الإصدار 1)" },
  { key: "FinanceOfficer", en: "Finance Officer", ar: "مسؤول المالية", immutable: false, activeUserCount: 2, description: "Reconciliation, refunds, VAT", descriptionAr: "المطابقة والاسترداد وضريبة القيمة المضافة" },
  { key: "ContentEditor", en: "Content Editor", ar: "محرر المحتوى", immutable: false, activeUserCount: 2, description: "CMS pages, templates, media", descriptionAr: "صفحات إدارة المحتوى والقوالب والوسائط" },
  { key: "Auditor", en: "Auditor", ar: "مدقق", immutable: false, activeUserCount: 2, description: "Read-only audit log access", descriptionAr: "وصول للقراءة فقط لسجل التدقيق" },
  { key: "SystemAdmin", en: "System Admin", ar: "مدير النظام", immutable: false, activeUserCount: 2, description: "CRU on configuration, users, content", descriptionAr: "صلاحيات إنشاء وقراءة وتعديل" },
  { key: "SuperAdmin", en: "Super Admin", ar: "المسؤول الأعلى", immutable: false, activeUserCount: 1, description: "Full CRUD + Approve authority", descriptionAr: "صلاحيات كاملة + الاعتماد النهائي" },
];

export type PermLevel = "None" | "Read" | "Write" | "Approve" | "Delete";

export interface ModulePerm {
  moduleKey: string;
  en: string;
  ar: string;
}

export const adminModules: ModulePerm[] = [
  { moduleKey: "applications", en: "Applications", ar: "الطلبات" },
  { moduleKey: "decisions", en: "Decisions", ar: "القرارات" },
  { moduleKey: "certificates", en: "Certificates", ar: "الشهادات" },
  { moduleKey: "payments", en: "Payments", ar: "المدفوعات" },
  { moduleKey: "refunds", en: "Refunds", ar: "المبالغ المستردة" },
  { moduleKey: "users", en: "Users & Roles", ar: "المستخدمون والأدوار" },
  { moduleKey: "config", en: "System Config", ar: "إعدادات النظام" },
  { moduleKey: "content", en: "Content / CMS", ar: "المحتوى" },
  { moduleKey: "reports", en: "Reports", ar: "التقارير" },
  { moduleKey: "audit", en: "Audit Log", ar: "سجل التدقيق" },
  { moduleKey: "api", en: "API & Webhooks", ar: "واجهات البرمجة" },
  { moduleKey: "suspension", en: "Suspension / Revocation", ar: "الإيقاف والإلغاء" },
];

export type PermMatrix = Record<RoleKey, Record<string, PermLevel>>;

export const initialPerms: PermMatrix = {
  Guest: Object.fromEntries(adminModules.map((m) => [m.moduleKey, "None" as PermLevel])) as Record<string, PermLevel>,
  Applicant: Object.fromEntries(adminModules.map((m) => [m.moduleKey, m.moduleKey === "applications" || m.moduleKey === "payments" || m.moduleKey === "certificates" ? "Read" : "None"])) as Record<string, PermLevel>,
  Verifier: Object.fromEntries(adminModules.map((m) => [m.moduleKey, m.moduleKey === "certificates" ? "Read" : "None"])) as Record<string, PermLevel>,
  Assessor: Object.fromEntries(adminModules.map((m) => [m.moduleKey, m.moduleKey === "applications" || m.moduleKey === "decisions" ? "Write" : m.moduleKey === "audit" ? "Read" : "None"])) as Record<string, PermLevel>,
  SeniorAssessor: Object.fromEntries(adminModules.map((m) => [m.moduleKey, m.moduleKey === "decisions" || m.moduleKey === "certificates" || m.moduleKey === "suspension" ? "Approve" : m.moduleKey === "applications" ? "Write" : m.moduleKey === "reports" || m.moduleKey === "audit" ? "Read" : "None"])) as Record<string, PermLevel>,
  AppealsOfficer: Object.fromEntries(adminModules.map((m) => [m.moduleKey, m.moduleKey === "applications" || m.moduleKey === "decisions" || m.moduleKey === "audit" ? "Read" : "None"])) as Record<string, PermLevel>,
  FinanceOfficer: Object.fromEntries(adminModules.map((m) => [m.moduleKey, m.moduleKey === "payments" || m.moduleKey === "refunds" ? "Approve" : m.moduleKey === "reports" ? "Read" : "None"])) as Record<string, PermLevel>,
  ContentEditor: Object.fromEntries(adminModules.map((m) => [m.moduleKey, m.moduleKey === "content" ? "Write" : "None"])) as Record<string, PermLevel>,
  Auditor: Object.fromEntries(adminModules.map((m) => [m.moduleKey, "Read" as PermLevel])) as Record<string, PermLevel>,
  SystemAdmin: Object.fromEntries(adminModules.map((m) => [m.moduleKey, m.moduleKey === "suspension" || m.moduleKey === "refunds" ? "Write" : "Write"])) as Record<string, PermLevel>,
  SuperAdmin: Object.fromEntries(adminModules.map((m) => [m.moduleKey, "Delete" as PermLevel])) as Record<string, PermLevel>,
};

// ===== Licence Categories =====
export type CategoryKey = "Teacher" | "Counsellor" | "Trainer";

export interface LicenceCategory {
  key: CategoryKey;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  applicationFee: number;
  renewalFee: number;
  validityYears: 1 | 2 | 3;
  graceDays: number;
  cpdHoursThreshold: number;
  active: boolean;
  requiredDocuments: string[]; // doc type keys
  rubricId: string;
}

export const docTypes = [
  { key: "emirates_id", en: "Emirates ID copy", ar: "نسخة الهوية الإماراتية" },
  { key: "qualification", en: "Qualification certificate", ar: "شهادة المؤهل" },
  { key: "transcript", en: "Academic transcript", ar: "كشف الدرجات الأكاديمي" },
  { key: "experience", en: "Experience letter(s)", ar: "خطاب(ات) الخبرة" },
  { key: "good_conduct", en: "Good conduct certificate", ar: "شهادة حسن السيرة والسلوك" },
  { key: "cpd_evidence", en: "CPD evidence", ar: "أدلة التطوير المهني" },
  { key: "passport", en: "Passport copy", ar: "نسخة جواز السفر" },
  { key: "photo", en: "Recent photograph", ar: "صورة شخصية حديثة" },
  { key: "specialist_cert", en: "Specialist certification", ar: "شهادة تخصص" },
];

export const mockCategories: LicenceCategory[] = [
  {
    key: "Teacher",
    nameEn: "Teacher",
    nameAr: "معلم",
    descriptionEn:
      "Professional licence for school-based teaching practice across primary and secondary phases.",
    descriptionAr:
      "رخصة مهنية لممارسة التدريس في المدارس عبر المرحلتين الابتدائية والثانوية.",
    applicationFee: 1000,
    renewalFee: 800,
    validityYears: 2,
    graceDays: 30,
    cpdHoursThreshold: 30,
    active: true,
    requiredDocuments: ["emirates_id", "qualification", "transcript", "experience", "good_conduct", "cpd_evidence", "photo"],
    rubricId: "rubric-teacher-v3",
  },
  {
    key: "Counsellor",
    nameEn: "Counsellor",
    nameAr: "مرشد",
    descriptionEn:
      "Professional licence for school-based counselling and student wellbeing practice.",
    descriptionAr:
      "رخصة مهنية لممارسة الإرشاد المدرسي ورعاية الطلاب.",
    applicationFee: 1200,
    renewalFee: 950,
    validityYears: 3,
    graceDays: 30,
    cpdHoursThreshold: 40,
    active: true,
    requiredDocuments: ["emirates_id", "qualification", "transcript", "experience", "good_conduct", "specialist_cert", "cpd_evidence", "photo"],
    rubricId: "rubric-counsellor-v2",
  },
  {
    key: "Trainer",
    nameEn: "Trainer",
    nameAr: "مدرب",
    descriptionEn:
      "Professional licence for vocational and technical training practice.",
    descriptionAr:
      "رخصة مهنية لممارسة التدريب المهني والتقني.",
    applicationFee: 800,
    renewalFee: 650,
    validityYears: 2,
    graceDays: 14,
    cpdHoursThreshold: 24,
    active: true,
    requiredDocuments: ["emirates_id", "qualification", "experience", "good_conduct", "cpd_evidence", "photo"],
    rubricId: "rubric-trainer-v1",
  },
];

// ===== Rubric Builder =====
export interface RubricItem {
  id: string;
  labelEn: string;
  labelAr: string;
  scoring: "PassFail" | "Weighted";
  weight?: number;
  required: boolean;
  guidanceEn: string;
  guidanceAr: string;
}

export interface RubricSection {
  id: string;
  nameEn: string;
  nameAr: string;
  items: RubricItem[];
}

export interface Rubric {
  id: string;
  nameEn: string;
  nameAr: string;
  category: CategoryKey;
  version: number;
  published: boolean;
  sections: RubricSection[];
}

export const mockRubrics: Rubric[] = [
  {
    id: "rubric-teacher-v3",
    nameEn: "Teacher Licence Rubric",
    nameAr: "معايير ترخيص المعلم",
    category: "Teacher",
    version: 3,
    published: true,
    sections: [
      {
        id: "sec-quals",
        nameEn: "Qualifications",
        nameAr: "المؤهلات",
        items: [
          { id: "q1", labelEn: "Bachelor's degree in Education or related field", labelAr: "بكالوريوس تربية أو مجال ذي صلة", scoring: "PassFail", required: true, guidanceEn: "Verify against accredited institution list.", guidanceAr: "تحقق من قائمة المؤسسات المعتمدة." },
          { id: "q2", labelEn: "Qualification attested by UAE MoFA", labelAr: "مؤهل مصدق من الخارجية الإماراتية", scoring: "PassFail", required: true, guidanceEn: "Check attestation stamp.", guidanceAr: "تحقق من ختم التصديق." },
        ],
      },
      {
        id: "sec-exp",
        nameEn: "Experience",
        nameAr: "الخبرة",
        items: [
          { id: "e1", labelEn: "Minimum 2 years teaching experience", labelAr: "خبرة تدريسية لا تقل عن سنتين", scoring: "PassFail", required: true, guidanceEn: "Reviewed via experience letters.", guidanceAr: "تتم المراجعة عبر خطابات الخبرة." },
          { id: "e2", labelEn: "Experience verified with employer references", labelAr: "تم التحقق من الخبرة مع مرجعيات صاحب العمل", scoring: "PassFail", required: true, guidanceEn: "Contact at least one referee.", guidanceAr: "تواصل مع مرجع واحد على الأقل." },
        ],
      },
      {
        id: "sec-cpd",
        nameEn: "CPD Declaration",
        nameAr: "إقرار التطوير المهني",
        items: [
          { id: "c1", labelEn: "Declared CPD hours meet 30h threshold", labelAr: "ساعات التطوير المهني المعلنة تستوفي حد 30 ساعة", scoring: "PassFail", required: true, guidanceEn: "Sum hours from CPD evidence.", guidanceAr: "اجمع الساعات من أدلة التطوير المهني." },
          { id: "c2", labelEn: "CPD evidence relates to declared subject area", labelAr: "أدلة التطوير المهني تتعلق بمجال التخصص المعلن", scoring: "PassFail", required: false, guidanceEn: "Optional but recommended.", guidanceAr: "اختياري ولكنه موصى به." },
        ],
      },
      {
        id: "sec-docs",
        nameEn: "Documents",
        nameAr: "المستندات",
        items: [
          { id: "d1", labelEn: "Emirates ID matches UAE Pass identity", labelAr: "الهوية الإماراتية مطابقة لهوية الهوية الرقمية", scoring: "PassFail", required: true, guidanceEn: "Auto-checked at submission.", guidanceAr: "يتم التحقق تلقائيًا عند التقديم." },
          { id: "d2", labelEn: "Good conduct certificate is current (≤6 months)", labelAr: "شهادة حسن السيرة سارية (لا تزيد عن 6 أشهر)", scoring: "PassFail", required: true, guidanceEn: "Check issue date on certificate.", guidanceAr: "تحقق من تاريخ الإصدار على الشهادة." },
        ],
      },
      {
        id: "sec-decl",
        nameEn: "Declarations",
        nameAr: "الإقرارات",
        items: [
          { id: "x1", labelEn: "Applicant signed integrity declaration", labelAr: "وقّع مقدم الطلب على إقرار النزاهة", scoring: "PassFail", required: true, guidanceEn: "Check digital signature timestamp.", guidanceAr: "تحقق من ختم التوقيع الرقمي." },
        ],
      },
    ],
  },
  {
    id: "rubric-counsellor-v2",
    nameEn: "Counsellor Licence Rubric",
    nameAr: "معايير ترخيص المرشد",
    category: "Counsellor",
    version: 2,
    published: true,
    sections: [
      { id: "cs1", nameEn: "Qualifications", nameAr: "المؤهلات", items: [
        { id: "cq1", labelEn: "Master's degree in Counselling/Psychology", labelAr: "ماجستير إرشاد أو علم نفس", scoring: "PassFail", required: true, guidanceEn: "Verify via accredited list.", guidanceAr: "تحقق من القائمة المعتمدة." },
      ]},
    ],
  },
  {
    id: "rubric-trainer-v1",
    nameEn: "Trainer Licence Rubric",
    nameAr: "معايير ترخيص المدرب",
    category: "Trainer",
    version: 1,
    published: true,
    sections: [
      { id: "ts1", nameEn: "Qualifications", nameAr: "المؤهلات", items: [
        { id: "tq1", labelEn: "Vocational diploma or higher", labelAr: "دبلوم مهني أو أعلى", scoring: "PassFail", required: true, guidanceEn: "Cross-check with NQA framework.", guidanceAr: "تحقق من إطار المؤهلات الوطني." },
      ]},
    ],
  },
];

// ===== System Configuration =====
export interface SystemConfig {
  sla: {
    initialReviewDays: number;
    incompleteResponseDays: number;
    renewalReviewDays: number;
    amberThresholdPct: number;
    redThresholdPct: number;
  };
  assignment: {
    method: "RoundRobin" | "LoadBalanced" | "CategoryMatched";
    maxQueuePerAssessor: number;
  };
  grace: {
    defaultDaysAfterExpiry: number;
  };
  retry: {
    maxPaymentRetries: number;
    abandonedAutoCancelDays: number;
  };
  session: {
    applicantIdleMinutes: number;
    backOfficeIdleMinutes: number;
    absoluteLimitHours: number;
    allowConcurrent: boolean;
  };
}

export const defaultSystemConfig: SystemConfig = {
  sla: {
    initialReviewDays: 5,
    incompleteResponseDays: 14,
    renewalReviewDays: 3,
    amberThresholdPct: 75,
    redThresholdPct: 90,
  },
  assignment: { method: "LoadBalanced", maxQueuePerAssessor: 25 },
  grace: { defaultDaysAfterExpiry: 30 },
  retry: { maxPaymentRetries: 3, abandonedAutoCancelDays: 60 },
  session: {
    applicantIdleMinutes: 20,
    backOfficeIdleMinutes: 15,
    absoluteLimitHours: 8,
    allowConcurrent: false,
  },
};

// ===== Feature Flags =====
export interface FeatureFlag {
  key: string;
  descriptionEn: string;
  descriptionAr: string;
  prodEnabled: boolean;
  stagingEnabled: boolean;
  lastChanged: Date;
  lastChangedBy: string;
}

export const mockFlags: FeatureFlag[] = [
  {
    key: "whatsapp_notifications_enabled",
    descriptionEn: "Send notification touchpoints via WhatsApp Business API",
    descriptionAr: "إرسال الإشعارات عبر واجهة واتساب للأعمال",
    prodEnabled: false,
    stagingEnabled: true,
    lastChanged: new Date(now - d(7)),
    lastChangedBy: "Aisha Al Mansoori",
  },
  {
    key: "renewal_flow_active",
    descriptionEn: "Enable the renewal application flow for licence holders",
    descriptionAr: "تفعيل تدفق تجديد الترخيص لحاملي التراخيص",
    prodEnabled: true,
    stagingEnabled: true,
    lastChanged: new Date(now - d(45)),
    lastChangedBy: "Hamad Al Ameri",
  },
  {
    key: "committee_mode_enabled",
    descriptionEn: "Allow Senior Assessor to escalate cases to a committee panel",
    descriptionAr: "السماح لكبير المقيمين بتصعيد الحالات إلى لجنة",
    prodEnabled: true,
    stagingEnabled: true,
    lastChanged: new Date(now - d(120)),
    lastChangedBy: "Aisha Al Mansoori",
  },
  {
    key: "api_docs_public",
    descriptionEn: "Expose API documentation portal to partner developers",
    descriptionAr: "إتاحة بوابة وثائق واجهة البرمجة لمطوري الشركاء",
    prodEnabled: false,
    stagingEnabled: false,
    lastChanged: new Date(now - d(2)),
    lastChangedBy: "Hamad Al Ameri",
  },
];

// ===== Working Calendar =====
export interface PublicHoliday {
  id: string;
  date: string; // ISO yyyy-mm-dd
  nameEn: string;
  nameAr: string;
}

export const mockHolidays: PublicHoliday[] = [
  { id: "h1", date: "2026-01-01", nameEn: "New Year's Day", nameAr: "رأس السنة الميلادية" },
  { id: "h2", date: "2026-03-20", nameEn: "Eid Al Fitr (Day 1)", nameAr: "عيد الفطر (اليوم 1)" },
  { id: "h3", date: "2026-03-21", nameEn: "Eid Al Fitr (Day 2)", nameAr: "عيد الفطر (اليوم 2)" },
  { id: "h4", date: "2026-05-27", nameEn: "Arafat Day", nameAr: "وقفة عرفات" },
  { id: "h5", date: "2026-05-28", nameEn: "Eid Al Adha (Day 1)", nameAr: "عيد الأضحى (اليوم 1)" },
  { id: "h6", date: "2026-12-02", nameEn: "UAE National Day", nameAr: "اليوم الوطني" },
  { id: "h7", date: "2026-12-03", nameEn: "UAE National Day (Day 2)", nameAr: "اليوم الوطني (اليوم 2)" },
];

// ===== Licence Holders (for suspension/revocation) =====
export interface LicenceHolder {
  licenceNumber: string;
  holderName: string;
  holderNameAr: string;
  emiratesIdMasked: string;
  category: CategoryKey;
  status: "Active" | "Suspended" | "Revoked" | "Expired";
  issuedAt: Date;
  expiresAt: Date;
}

export const mockLicenceHolders: LicenceHolder[] = [
  { licenceNumber: "ADV-T-2024-001245", holderName: "Layla Hassan Al Marri", holderNameAr: "ليلى حسن المري", emiratesIdMasked: "784-XXXX-XXXXXXX-1", category: "Teacher", status: "Active", issuedAt: new Date(now - d(420)), expiresAt: new Date(now + d(310)) },
  { licenceNumber: "ADV-C-2023-000812", holderName: "Maryam Al Dhaheri", holderNameAr: "مريم الظاهري", emiratesIdMasked: "784-XXXX-XXXXXXX-3", category: "Counsellor", status: "Active", issuedAt: new Date(now - d(680)), expiresAt: new Date(now + d(50)) },
  { licenceNumber: "ADV-T-2024-001902", holderName: "Ahmed Al Mansoori", holderNameAr: "أحمد المنصوري", emiratesIdMasked: "784-XXXX-XXXXXXX-7", category: "Teacher", status: "Suspended", issuedAt: new Date(now - d(310)), expiresAt: new Date(now + d(420)) },
  { licenceNumber: "ADV-R-2022-000477", holderName: "Sultan Al Zaabi", holderNameAr: "سلطان الزعابي", emiratesIdMasked: "784-XXXX-XXXXXXX-9", category: "Trainer", status: "Revoked", issuedAt: new Date(now - d(900)), expiresAt: new Date(now - d(180)) },
];

export const suspensionReasonCodes = [
  { code: "INVESTIGATION", en: "Under investigation", ar: "قيد التحقيق" },
  { code: "ADMIN_HOLD", en: "Administrative hold", ar: "إيقاف إداري" },
  { code: "OTHER", en: "Other (specify in notes)", ar: "أخرى (يحدد في الملاحظات)" },
];

export const revocationReasonCodes = [
  { code: "MISCONDUCT", en: "Professional misconduct", ar: "سوء سلوك مهني" },
  { code: "FRAUD", en: "Fraud or false declaration", ar: "احتيال أو إقرار كاذب" },
  { code: "CRIMINAL", en: "Criminal conviction", ar: "إدانة جنائية" },
  { code: "OTHER", en: "Other (detailed rationale required)", ar: "أخرى (مبررات مفصلة مطلوبة)" },
];

// ===== DSR Workflow =====
export type DsrType = "Access" | "Rectification" | "Erasure" | "Portability";
export type DsrStatus = "Received" | "InProgress" | "Completed" | "Rejected";

export interface DsrRequest {
  id: string;
  applicantName: string;
  applicantNameAr: string;
  emiratesIdMasked: string;
  type: DsrType;
  requestedAt: Date;
  deadlineAt: Date;
  status: DsrStatus;
  notes: string;
  assignedTo?: string;
}

export const mockDsrs: DsrRequest[] = [
  { id: "DSR-2026-0001", applicantName: "Hessa Al Khoori", applicantNameAr: "حصة الخوري", emiratesIdMasked: "784-XXXX-XXXXXXX-2", type: "Access", requestedAt: new Date(now - d(3)), deadlineAt: new Date(now + d(27)), status: "InProgress", notes: "Requested full data export.", assignedTo: "Aisha Al Mansoori" },
  { id: "DSR-2026-0002", applicantName: "Faisal Al Muhairi", applicantNameAr: "فيصل المهيري", emiratesIdMasked: "784-XXXX-XXXXXXX-4", type: "Erasure", requestedAt: new Date(now - d(26)), deadlineAt: new Date(now + d(4)), status: "InProgress", notes: "Application withdrawn — wants all PII removed.", assignedTo: "Hamad Al Ameri" },
  { id: "DSR-2026-0003", applicantName: "Mira Al Shehhi", applicantNameAr: "ميرا الشحي", emiratesIdMasked: "784-XXXX-XXXXXXX-5", type: "Rectification", requestedAt: new Date(now - d(8)), deadlineAt: new Date(now + d(22)), status: "Received", notes: "Surname spelling correction." },
  { id: "DSR-2026-0004", applicantName: "Yousef Al Falasi", applicantNameAr: "يوسف الفلاسي", emiratesIdMasked: "784-XXXX-XXXXXXX-6", type: "Portability", requestedAt: new Date(now - d(15)), deadlineAt: new Date(now + d(15)), status: "InProgress", notes: "Wants machine-readable export of profile.", assignedTo: "Aisha Al Mansoori" },
  { id: "DSR-2026-0005", applicantName: "Wadeema Al Ketbi", applicantNameAr: "وديمة الكتبي", emiratesIdMasked: "784-XXXX-XXXXXXX-8", type: "Access", requestedAt: new Date(now - d(35)), deadlineAt: new Date(now - d(5)), status: "Completed", notes: "Data export delivered via secure download." },
];

// ===== Breach Notifications =====
export type BreachSeverity = "Low" | "Medium" | "High" | "Critical";
export type BreachStatus = "Open" | "Investigating" | "Notified" | "Resolved";

export interface BreachIncident {
  id: string;
  title: string;
  severity: BreachSeverity;
  description: string;
  affectedRecords: number;
  dataTypes: string[];
  discoveredAt: Date;
  status: BreachStatus;
  timeline: { at: Date; by: string; note: string }[];
  postMortem?: string;
}

export const mockBreaches: BreachIncident[] = [
  {
    id: "INC-2026-0001",
    title: "Phishing email targeting back-office staff",
    severity: "Medium",
    description: "Spear-phishing campaign against finance team. No credentials confirmed compromised.",
    affectedRecords: 0,
    dataTypes: ["Other"],
    discoveredAt: new Date(now - h(40)),
    status: "Investigating",
    timeline: [
      { at: new Date(now - h(40)), by: "Hamad Al Ameri", note: "Incident logged after staff report." },
      { at: new Date(now - h(36)), by: "Security team", note: "Email traced to spoofed sender; recipients notified." },
      { at: new Date(now - h(20)), by: "Hamad Al Ameri", note: "Credential rotation required for 4 accounts as precaution." },
    ],
  },
  {
    id: "INC-2025-0014",
    title: "Misconfigured S3 bucket — read public for 22 minutes",
    severity: "High",
    description: "Static asset bucket inadvertently set to public-read during a deploy. Reverted within 22 minutes.",
    affectedRecords: 0,
    dataTypes: ["Other"],
    discoveredAt: new Date(now - d(60)),
    status: "Resolved",
    timeline: [
      { at: new Date(now - d(60)), by: "Aisha Al Mansoori", note: "Bucket policy reverted; access logs reviewed." },
      { at: new Date(now - d(60) + h(2)), by: "Security team", note: "Confirmed no PII in bucket — only marketing assets." },
      { at: new Date(now - d(58)), by: "Aisha Al Mansoori", note: "PDPC notification not required (no PII affected)." },
    ],
    postMortem: "Added IaC policy preventing public-read on production buckets. Pre-deploy linter rule introduced.",
  },
];

// ===== Security Posture =====
export interface IpAllowEntry {
  cidr: string;
  description: string;
  addedBy: string;
  addedAt: Date;
}

export const mockIpAllowlist: IpAllowEntry[] = [
  { cidr: "10.42.0.0/16", description: "ADVETI HQ corporate network", addedBy: "Aisha Al Mansoori", addedAt: new Date(now - d(180)) },
  { cidr: "203.0.113.16/28", description: "DOE branch office", addedBy: "Hamad Al Ameri", addedAt: new Date(now - d(95)) },
  { cidr: "198.51.100.0/24", description: "Approved VPN egress", addedBy: "Aisha Al Mansoori", addedAt: new Date(now - d(40)) },
];

export const securityPosture = {
  waf: { status: "Active" as const, provider: "Cloudflare WAF", rulesUpdatedAt: new Date(now - d(2)) },
  ddos: { status: "Active" as const, provider: "Cloudflare Magic Transit" },
  rateLimiting: [
    { group: "/auth/*", limit: "60 req / 15 min / IP" },
    { group: "/portal/*", limit: "120 req / min / user" },
    { group: "/api/v1/*", limit: "300 req / min / API key" },
    { group: "/verify/*", limit: "30 req / min / IP" },
  ],
  tlsVersion: "1.3",
  lastVulnScan: { at: new Date(now - d(14)), critical: 0, high: 1, medium: 4, low: 12 },
  lastPenTest: { at: new Date(now - d(95)), status: "Passed with recommendations" },
};

// ===== API Keys =====
export interface ApiKey {
  id: string;
  name: string;
  scope: ("read" | "write" | "webhook")[];
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date | null;
  status: "Active" | "Revoked";
  createdBy: string;
}

export const mockApiKeys: ApiKey[] = [
  { id: "key-01", name: "Partner LMS — production", scope: ["read"], createdAt: new Date(now - d(120)), expiresAt: new Date(now + d(245)), lastUsedAt: new Date(now - h(3)), status: "Active", createdBy: "Aisha Al Mansoori" },
  { id: "key-02", name: "Internal data warehouse", scope: ["read"], createdAt: new Date(now - d(310)), expiresAt: new Date(now + d(55)), lastUsedAt: new Date(now - h(1)), status: "Active", createdBy: "Hamad Al Ameri" },
  { id: "key-03", name: "Webhook delivery service", scope: ["webhook"], createdAt: new Date(now - d(85)), expiresAt: new Date(now + d(280)), lastUsedAt: new Date(now - h(2)), status: "Active", createdBy: "Hamad Al Ameri" },
  { id: "key-04", name: "Legacy reporting cron", scope: ["read"], createdAt: new Date(now - d(420)), expiresAt: new Date(now - d(60)), lastUsedAt: new Date(now - d(95)), status: "Revoked", createdBy: "Aisha Al Mansoori" },
];

export const apiEvents = [
  { key: "application.submitted", en: "Application Submitted", ar: "تم تقديم الطلب" },
  { key: "payment.received", en: "Payment Received", ar: "تم استلام الدفعة" },
  { key: "decision.made", en: "Decision Made", ar: "تم اتخاذ القرار" },
  { key: "licence.issued", en: "Licence Issued", ar: "تم إصدار الترخيص" },
  { key: "licence.suspended", en: "Licence Suspended", ar: "تم إيقاف الترخيص" },
  { key: "licence.revoked", en: "Licence Revoked", ar: "تم إلغاء الترخيص" },
];

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  lastDeliveryStatus: number | null;
  lastDeliveryAt: Date | null;
  log: { at: Date; event: string; status: number }[];
}

export const mockWebhooks: Webhook[] = [
  {
    id: "wh-01",
    url: "https://partner.example.gov.ae/adveti/events",
    events: ["application.submitted", "decision.made", "licence.issued"],
    active: true,
    lastDeliveryStatus: 200,
    lastDeliveryAt: new Date(now - h(2)),
    log: [
      { at: new Date(now - h(2)), event: "licence.issued", status: 200 },
      { at: new Date(now - h(5)), event: "decision.made", status: 200 },
      { at: new Date(now - h(8)), event: "application.submitted", status: 200 },
      { at: new Date(now - d(1)), event: "decision.made", status: 502 },
    ],
  },
  {
    id: "wh-02",
    url: "https://internal.adveti.ae/audit/sink",
    events: ["licence.suspended", "licence.revoked"],
    active: true,
    lastDeliveryStatus: 200,
    lastDeliveryAt: new Date(now - d(2)),
    log: [
      { at: new Date(now - d(2)), event: "licence.suspended", status: 200 },
    ],
  },
];

// ===== Operational KPIs =====
export const operationalKpis = {
  applicationsThisPeriod: 482,
  applicationsPctVsLast: 12.4,
  pendingReview: 76,
  pendingSlaBreached: 6,
  decisionsMade: 391,
  certificatesIssued: 312,
  revenueCollected: 491200,
  assessorAvgReviewDays: 3.2,
};

export const opsAppsByStatus = [
  { status: "Draft", en: "Draft", ar: "مسودة", count: 124, color: "neutral" as const },
  { status: "Submitted", en: "Submitted", ar: "مقدم", count: 88, color: "info" as const },
  { status: "UnderReview", en: "Under Review", ar: "قيد المراجعة", count: 64, color: "warning" as const },
  { status: "PendingApplicant", en: "Pending Applicant", ar: "بانتظار المتقدم", count: 32, color: "gold" as const },
  { status: "Approved", en: "Approved", ar: "موافق", count: 312, color: "success" as const },
  { status: "Incomplete", en: "Incomplete", ar: "ناقص", count: 27, color: "warning" as const },
  { status: "Rejected", en: "Rejected", ar: "مرفوض", count: 48, color: "danger" as const },
  { status: "Expired", en: "Expired", ar: "منتهي", count: 19, color: "neutral" as const },
];

export const opsRevenueTrend = [
  { month: "May", monthAr: "مايو", value: 62000 },
  { month: "Jun", monthAr: "يونيو", value: 68000 },
  { month: "Jul", monthAr: "يوليو", value: 71000 },
  { month: "Aug", monthAr: "أغسطس", value: 65000 },
  { month: "Sep", monthAr: "سبتمبر", value: 78000 },
  { month: "Oct", monthAr: "أكتوبر", value: 82000 },
  { month: "Nov", monthAr: "نوفمبر", value: 75000 },
  { month: "Dec", monthAr: "ديسمبر", value: 88000 },
  { month: "Jan", monthAr: "يناير", value: 92000 },
  { month: "Feb", monthAr: "فبراير", value: 86000 },
  { month: "Mar", monthAr: "مارس", value: 95000 },
  { month: "Apr", monthAr: "أبريل", value: 96000 },
];

export const opsDecisionByCategory = [
  { category: "Teacher", pass: 132, incomplete: 14, reject: 9 },
  { category: "Counsellor", pass: 84, incomplete: 11, reject: 6 },
  { category: "Trainer", pass: 96, incomplete: 18, reject: 12 },
];

export const opsSlaPerformance = { onTimePct: 87, breachedPct: 13 };
