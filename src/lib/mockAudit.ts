/**
 * Mock data for the Auditor (R12) read-only screens:
 * - Audit log entries (200)
 * - Consent log entries
 * Re-uses DSR data from mockAdmin and decision data from mockSenior.
 */

export type AuditEntityType =
  | "Application"
  | "User"
  | "Payment"
  | "Certificate"
  | "Content"
  | "Config"
  | "System";

export type AuditAction =
  | "Created"
  | "Updated"
  | "Deleted"
  | "Approved"
  | "Rejected"
  | "Submitted"
  | "Exported"
  | "Login"
  | "Logout"
  | "MFA"
  | "PasswordChange"
  | "RoleChange";

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  ipAddress: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  sessionId: string;
}

const now = Date.now();
const mins = (n: number) => 1000 * 60 * n;

const ACTORS = [
  { id: "u-001", name: "Aisha Al Mansoori", email: "aisha.mansoori@adveti.ae", role: "SuperAdmin" },
  { id: "u-002", name: "Hamad Al Ameri", email: "hamad.ameri@adveti.ae", role: "SystemAdmin" },
  { id: "u-003", name: "Omar Al Marzooqi", email: "omar.marzooqi@adveti.ae", role: "Assessor" },
  { id: "u-004", name: "Sara Al Suwaidi", email: "sara.suwaidi@adveti.ae", role: "SeniorAssessor" },
  { id: "u-005", name: "Khalid Al Hosani", email: "khalid.hosani@adveti.ae", role: "FinanceOfficer" },
  { id: "u-006", name: "Noura Al Ali", email: "noura.ali@adveti.ae", role: "ContentEditor" },
  { id: "u-007", name: "Mohammed Al Shamsi", email: "mohammed.shamsi@adveti.ae", role: "Auditor" },
  { id: "u-008", name: "Layla Hassan", email: "layla.hassan@adveti.ae", role: "Applicant" },
];

const IPS = ["10.42.1.18", "10.42.1.22", "10.42.1.45", "10.42.2.11", "172.16.4.92", "192.168.10.5"];

const ACTIONS: AuditAction[] = [
  "Created", "Updated", "Deleted", "Approved", "Rejected", "Submitted",
  "Exported", "Login", "Logout", "MFA", "PasswordChange", "RoleChange",
];

const ENTITIES: AuditEntityType[] = [
  "Application", "User", "Payment", "Certificate", "Content", "Config", "System",
];

const sample = <T,>(arr: T[], i: number): T => arr[i % arr.length];

const buildDiff = (action: AuditAction, entity: AuditEntityType): { before: Record<string, unknown> | null; after: Record<string, unknown> | null } => {
  if (action === "Login" || action === "Logout" || action === "MFA") {
    return { before: null, after: { event: action, success: action !== "MFA" || Math.random() > 0.2 } };
  }
  if (action === "Created") {
    return { before: null, after: entity === "User" ? { role: "Assessor", status: "Active" } : { status: "Draft" } };
  }
  if (action === "Deleted") {
    return { before: { status: "Active" }, after: null };
  }
  if (action === "Approved") {
    return { before: { status: "Pending Approval" }, after: { status: "Approved", approvedAt: new Date().toISOString() } };
  }
  if (action === "Rejected") {
    return { before: { status: "Pending Approval" }, after: { status: "Rejected", reason: "Insufficient evidence" } };
  }
  if (action === "Submitted") {
    return { before: { status: "Draft" }, after: { status: "Submitted" } };
  }
  if (action === "Exported") {
    return { before: null, after: { format: "CSV", rows: 50 + Math.floor(Math.random() * 200) } };
  }
  if (action === "RoleChange") {
    return { before: { role: "Assessor" }, after: { role: "SeniorAssessor" } };
  }
  if (action === "PasswordChange") {
    return { before: null, after: { event: "password_changed" } };
  }
  return { before: { status: "v1" }, after: { status: "v2" } };
};

const ENTITY_ID_PREFIX: Record<AuditEntityType, string> = {
  Application: "APP-2026-",
  User: "USR-",
  Payment: "PAY-2026-",
  Certificate: "CERT-2026-",
  Content: "CMS-",
  Config: "CFG-",
  System: "SYS-",
};

export const mockAuditLog: AuditLogEntry[] = Array.from({ length: 200 }, (_, i) => {
  const actor = sample(ACTORS, i + 3);
  const action = sample(ACTIONS, i * 7 + 1);
  const entity = sample(ENTITIES, i * 5 + 2);
  const { before, after } = buildDiff(action, entity);
  const idNum = String(40000 + i).slice(-5);
  return {
    id: `AUD-${String(i + 1).padStart(6, "0")}`,
    timestamp: new Date(now - mins(i * 17 + (i % 5) * 3)),
    actorId: actor.id,
    actorName: actor.name,
    actorEmail: actor.email,
    actorRole: actor.role,
    action,
    entityType: entity,
    entityId: `${ENTITY_ID_PREFIX[entity]}${idNum}`,
    ipAddress: sample(IPS, i),
    before,
    after,
    sessionId: `sess-${(i * 31).toString(36)}`,
  };
});

// ===== Consent Log =====
export type ConsentType =
  | "Terms & Conditions"
  | "Privacy Policy"
  | "Cookie — Analytics"
  | "Cookie — Preferences"
  | "Data Processing Consent"
  | "UAE Pass OAuth Scope";

export type ConsentStatus = "Active" | "Withdrawn";
export type ConsentChannel = "Web" | "Mobile" | "API" | "UAE Pass";

export interface ConsentRecord {
  id: string;
  applicantName: string;
  applicantNameAr: string;
  emiratesIdMasked: string;
  type: ConsentType;
  version: string;
  givenAt: Date;
  withdrawnAt?: Date;
  ipAddress: string;
  channel: ConsentChannel;
  status: ConsentStatus;
}

const APPLICANTS = [
  { en: "Layla Hassan", ar: "ليلى حسن", eid: "784-XXXX-XXXXXXX-1" },
  { en: "Hessa Al Khoori", ar: "حصة الخوري", eid: "784-XXXX-XXXXXXX-2" },
  { en: "Faisal Al Muhairi", ar: "فيصل المهيري", eid: "784-XXXX-XXXXXXX-4" },
  { en: "Mira Al Shehhi", ar: "ميرا الشحي", eid: "784-XXXX-XXXXXXX-5" },
  { en: "Yousef Al Falasi", ar: "يوسف الفلاسي", eid: "784-XXXX-XXXXXXX-6" },
  { en: "Wadeema Al Ketbi", ar: "وديمة الكتبي", eid: "784-XXXX-XXXXXXX-8" },
  { en: "Khalifa Al Mazrouei", ar: "خليفة المزروعي", eid: "784-XXXX-XXXXXXX-9" },
  { en: "Reem Al Dhaheri", ar: "ريم الظاهري", eid: "784-XXXX-XXXXXXX-3" },
];

const CONSENT_TYPES: ConsentType[] = [
  "Terms & Conditions",
  "Privacy Policy",
  "Cookie — Analytics",
  "Cookie — Preferences",
  "Data Processing Consent",
  "UAE Pass OAuth Scope",
];

const CHANNELS: ConsentChannel[] = ["Web", "Mobile", "API", "UAE Pass"];

const d = (n: number) => 1000 * 60 * 60 * 24 * n;

export const mockConsents: ConsentRecord[] = Array.from({ length: 60 }, (_, i) => {
  const applicant = sample(APPLICANTS, i);
  const type = sample(CONSENT_TYPES, i * 3);
  const isWithdrawn = i % 11 === 0;
  const givenAt = new Date(now - d(i * 2 + 3));
  return {
    id: `CON-${String(i + 1).padStart(5, "0")}`,
    applicantName: applicant.en,
    applicantNameAr: applicant.ar,
    emiratesIdMasked: applicant.eid,
    type,
    version: type === "Cookie — Analytics" || type === "Cookie — Preferences" ? "1.2" : "3.0",
    givenAt,
    withdrawnAt: isWithdrawn ? new Date(now - d(i)) : undefined,
    ipAddress: sample(IPS, i + 1),
    channel: sample(CHANNELS, i + 2),
    status: isWithdrawn ? "Withdrawn" : "Active",
  };
});

// ===== Decision Report data (Auditor read-only) =====
export interface DecisionRow {
  category: "Teacher" | "Counsellor" | "Trainer";
  pass: number;
  incomplete: number;
  reject: number;
}

export const decisionRatios: DecisionRow[] = [
  { category: "Teacher", pass: 142, incomplete: 28, reject: 14 },
  { category: "Counsellor", pass: 56, incomplete: 11, reject: 5 },
  { category: "Trainer", pass: 78, incomplete: 19, reject: 9 },
];

// ===== Available exports (read-only catalogue) =====
export interface ExportCatalogueItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  format: "CSV" | "XLSX" | "PDF";
  lastGeneratedAt: Date;
  rowCount: number;
}

export const exportCatalogue: ExportCatalogueItem[] = [
  {
    id: "exp-applications",
    name: "Applications register",
    nameAr: "سجل الطلبات",
    description: "All applications in the period (PII masked).",
    descriptionAr: "جميع الطلبات خلال الفترة (مع إخفاء البيانات الشخصية).",
    format: "CSV",
    lastGeneratedAt: new Date(now - d(2)),
    rowCount: 412,
  },
  {
    id: "exp-decisions",
    name: "Decision outcomes",
    nameAr: "نتائج القرارات",
    description: "Pass / Incomplete / Reject counts per assessor and category.",
    descriptionAr: "إحصائيات النجاح / غير المكتمل / الرفض لكل مقيِّم وفئة.",
    format: "XLSX",
    lastGeneratedAt: new Date(now - d(5)),
    rowCount: 38,
  },
  {
    id: "exp-revenue",
    name: "Revenue & VAT summary",
    nameAr: "ملخص الإيرادات وضريبة القيمة المضافة",
    description: "Quarter-end revenue, refunds and VAT collected.",
    descriptionAr: "ملخص الإيرادات والمستردات وضريبة القيمة المضافة لنهاية الربع.",
    format: "XLSX",
    lastGeneratedAt: new Date(now - d(7)),
    rowCount: 124,
  },
  {
    id: "exp-audit",
    name: "Audit log extract",
    nameAr: "مستخرج سجل التدقيق",
    description: "Filtered audit log entries (last 90 days).",
    descriptionAr: "إدخالات سجل التدقيق المصفّاة (آخر 90 يومًا).",
    format: "CSV",
    lastGeneratedAt: new Date(now - d(1)),
    rowCount: 8420,
  },
];
