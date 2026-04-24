/**
 * Mock data for the Senior Assessor back-office:
 * - Approval queue (decisions awaiting senior sign-off)
 * - Active assessor list with workloads (for reassignment + auto-assign view)
 * - Committee panel with member votes
 * - Assessor performance stats (for /senior/reports)
 *
 * Builds on top of mockAssessor.ts so application IDs stay consistent.
 */

import { Category } from "./mockAssessor";

export type Recommendation = "Pass" | "Incomplete" | "Reject";

export interface ApprovalQueueItem {
  applicationId: string;
  applicantNameEn: string;
  applicantNameAr: string;
  category: Category;
  submittedAt: Date;
  slaDeadline: Date;
  assessorId: string;
  assessorName: string;
  recommendation: Recommendation;
  rationale: string;
  rationaleAr: string;
  rubricSummary: { pass: number; fail: number; na: number };
  committeeFlag: boolean;
}

const now = Date.now();
const d = (n: number) => 1000 * 60 * 60 * 24 * n;
const h = (n: number) => 1000 * 60 * 60 * n;

export const mockApprovalQueue: ApprovalQueueItem[] = [
  {
    applicationId: "APP-2026-00042",
    applicantNameEn: "Layla Hassan Al Marri",
    applicantNameAr: "ليلى حسن المري",
    category: "Teacher",
    submittedAt: new Date(now - d(2)),
    slaDeadline: new Date(now + d(2)),
    assessorId: "mock-assessor",
    assessorName: "Omar Al Marzooqi",
    recommendation: "Pass",
    rationale:
      "All rubric items pass. Bachelor's in Education from accredited UAE university; 4 years teaching experience verified; CPD evidence aligns with declared 38 hours.",
    rationaleAr:
      "اجتاز جميع بنود معايير التقييم. بكالوريوس تربية من جامعة إماراتية معتمدة؛ خبرة تدريسية موثقة 4 سنوات؛ أدلة التطوير المهني تتوافق مع 38 ساعة معلنة.",
    rubricSummary: { pass: 11, fail: 0, na: 1 },
    committeeFlag: false,
  },
  {
    applicationId: "APP-2026-00111",
    applicantNameEn: "Khalid Ibrahim Al Hosani",
    applicantNameAr: "خالد إبراهيم الحوسني",
    category: "Trainer",
    submittedAt: new Date(now - d(6)),
    slaDeadline: new Date(now - h(4)),
    assessorId: "mock-assessor",
    assessorName: "Omar Al Marzooqi",
    recommendation: "Incomplete",
    rationale:
      "CPD declaration of 18 hours falls short of the 30-hour minimum. Employer letter lacks date stamp. Applicant should resubmit with corrected evidence.",
    rationaleAr:
      "إعلان التطوير المهني 18 ساعة أقل من الحد الأدنى 30 ساعة. خطاب جهة العمل بدون ختم تاريخ. ينبغي إعادة التقديم بأدلة مصححة.",
    rubricSummary: { pass: 8, fail: 3, na: 1 },
    committeeFlag: false,
  },
  {
    applicationId: "APP-2026-00128",
    applicantNameEn: "Fatima Yousef Al Shamsi",
    applicantNameAr: "فاطمة يوسف الشامسي",
    category: "Counsellor",
    submittedAt: new Date(now - d(1)),
    slaDeadline: new Date(now + d(4)),
    assessorId: "mock-assessor",
    assessorName: "Omar Al Marzooqi",
    recommendation: "Pass",
    rationale:
      "Master's in Counselling Psychology, 6 years documented experience in private school setting, 42 CPD hours with certified evidence.",
    rationaleAr:
      "ماجستير في علم النفس الإرشادي، 6 سنوات خبرة موثقة في المدارس الخاصة، 42 ساعة تطوير مهني بأدلة معتمدة.",
    rubricSummary: { pass: 12, fail: 0, na: 0 },
    committeeFlag: false,
  },
  {
    applicationId: "APP-2026-00131",
    applicantNameEn: "Omar Ali Al Marzooqi",
    applicantNameAr: "عمر علي المرزوقي",
    category: "Trainer",
    submittedAt: new Date(now - d(3)),
    slaDeadline: new Date(now + d(1)),
    assessorId: "other-assessor-2",
    assessorName: "Sara Al Suwaidi",
    recommendation: "Reject",
    rationale:
      "Field of study (Mechanical Engineering) is not relevant to Trainer licence in education sector. No evidence of pedagogical training. Recommendation: reject with right to reapply after qualifying.",
    rationaleAr:
      "تخصص الدراسة (الهندسة الميكانيكية) غير ذي صلة برخصة المدرب في قطاع التعليم. لا يوجد دليل على تدريب تربوي. التوصية: الرفض مع حق إعادة التقديم بعد التأهل.",
    rubricSummary: { pass: 5, fail: 5, na: 2 },
    committeeFlag: true,
  },
  {
    applicationId: "APP-2026-00153",
    applicantNameEn: "Hessa Khalifa Al Qubaisi",
    applicantNameAr: "حصة خليفة القبيسي",
    category: "Counsellor",
    submittedAt: new Date(now - d(3)),
    slaDeadline: new Date(now + h(20)),
    assessorId: "other-assessor-1",
    assessorName: "Mariam Al Suwaidi",
    recommendation: "Pass",
    rationale:
      "All criteria met. Recommendation pending senior approval. Note: Employer letter scanned at low resolution but content is verifiable.",
    rationaleAr:
      "جميع المعايير مستوفاة. التوصية بانتظار موافقة كبير المقيمين. ملاحظة: خطاب جهة العمل ممسوح بدقة منخفضة لكن المحتوى قابل للتحقق.",
    rubricSummary: { pass: 11, fail: 0, na: 1 },
    committeeFlag: false,
  },
  {
    applicationId: "APP-2026-00170",
    applicantNameEn: "Mohammed Jasem Al Falasi",
    applicantNameAr: "محمد جاسم الفلاسي",
    category: "Counsellor",
    submittedAt: new Date(now - d(4)),
    slaDeadline: new Date(now + h(12)),
    assessorId: "mock-assessor",
    assessorName: "Omar Al Marzooqi",
    recommendation: "Incomplete",
    rationale:
      "Practicum hours undocumented. Awaiting clarification from training provider. Recommendation: request additional information.",
    rationaleAr:
      "ساعات التدريب العملي غير موثقة. بانتظار توضيح من جهة التدريب. التوصية: طلب معلومات إضافية.",
    rubricSummary: { pass: 9, fail: 2, na: 1 },
    committeeFlag: false,
  },
];

export const getApprovalItem = (id: string): ApprovalQueueItem =>
  mockApprovalQueue.find((q) => q.applicationId === id) ??
  mockApprovalQueue[0];

/* ─────────────────────────────────── ASSESSORS ─────────────────────────────── */

export interface AssessorProfile {
  id: string;
  nameEn: string;
  nameAr: string;
  email: string;
  categories: Category[];
  activeQueue: number;
  avgReviewHours: number;
  passRate: number; // 0..1
  slaBreaches: number;
  reviewedThisWeek: number;
  reviewedLastWeek: number;
}

export const mockAssessors: AssessorProfile[] = [
  {
    id: "mock-assessor",
    nameEn: "Omar Al Marzooqi",
    nameAr: "عمر المرزوقي",
    email: "omar.almarzooqi@adveti.ae",
    categories: ["Teacher", "Counsellor"],
    activeQueue: 8,
    avgReviewHours: 36,
    passRate: 0.74,
    slaBreaches: 1,
    reviewedThisWeek: 14,
    reviewedLastWeek: 11,
  },
  {
    id: "other-assessor-1",
    nameEn: "Mariam Al Suwaidi",
    nameAr: "مريم السويدي",
    email: "mariam.alsuwaidi@adveti.ae",
    categories: ["Counsellor"],
    activeQueue: 6,
    avgReviewHours: 28,
    passRate: 0.81,
    slaBreaches: 0,
    reviewedThisWeek: 12,
    reviewedLastWeek: 10,
  },
  {
    id: "other-assessor-2",
    nameEn: "Sara Al Suwaidi",
    nameAr: "سارة السويدي",
    email: "sara.alsuwaidi@adveti.ae",
    categories: ["Trainer"],
    activeQueue: 4,
    avgReviewHours: 41,
    passRate: 0.65,
    slaBreaches: 2,
    reviewedThisWeek: 9,
    reviewedLastWeek: 13,
  },
  {
    id: "other-assessor-3",
    nameEn: "Khalid Al Hosani",
    nameAr: "خالد الحوسني",
    email: "khalid.alhosani@adveti.ae",
    categories: ["Teacher", "Trainer"],
    activeQueue: 11,
    avgReviewHours: 44,
    passRate: 0.7,
    slaBreaches: 3,
    reviewedThisWeek: 16,
    reviewedLastWeek: 12,
  },
];

/* ─────────────────────────────── COMMITTEE PANEL ───────────────────────────── */

export type Vote = "Pass" | "Incomplete" | "Reject" | null;

export interface CommitteeMember {
  id: string;
  nameEn: string;
  nameAr: string;
  vote: Vote;
  rationale: string;
}

export const mockCommittee: CommitteeMember[] = [
  {
    id: "mock-assessor",
    nameEn: "Omar Al Marzooqi",
    nameAr: "عمر المرزوقي",
    vote: "Reject",
    rationale:
      "Field of study not aligned with licence category. No pedagogical training evidenced.",
  },
  {
    id: "other-assessor-1",
    nameEn: "Mariam Al Suwaidi",
    nameAr: "مريم السويدي",
    vote: "Incomplete",
    rationale:
      "Recommend giving applicant chance to provide pedagogical training evidence.",
  },
  {
    id: "other-assessor-2",
    nameEn: "Sara Al Suwaidi",
    nameAr: "سارة السويدي",
    vote: null,
    rationale: "",
  },
];

/* ───────────────────────────── OVERRIDE REASON CODES ───────────────────────── */

export const overrideReasonCodes: { value: string; en: string; ar: string }[] =
  [
    {
      value: "EVIDENCE_INSUFFICIENT",
      en: "Evidence insufficient for recommended outcome",
      ar: "الأدلة غير كافية للنتيجة الموصى بها",
    },
    {
      value: "POLICY_MISALIGNMENT",
      en: "Recommendation conflicts with current policy",
      ar: "التوصية تتعارض مع السياسة الحالية",
    },
    {
      value: "RUBRIC_MISAPPLIED",
      en: "Rubric criteria misapplied by assessor",
      ar: "تطبيق غير صحيح لمعايير التقييم من قِبل المقيّم",
    },
    {
      value: "NEW_EVIDENCE",
      en: "New evidence surfaced during senior review",
      ar: "ظهور أدلة جديدة خلال مراجعة كبير المقيمين",
    },
    {
      value: "OTHER",
      en: "Other (specify in rationale)",
      ar: "أخرى (يُذكر في المبررات)",
    },
  ];

export const reassignmentReasons: { value: string; en: string; ar: string }[] =
  [
    { value: "COI", en: "Conflict of interest", ar: "تضارب مصالح" },
    { value: "WORKLOAD", en: "Workload balancing", ar: "موازنة عبء العمل" },
    {
      value: "EXPERTISE",
      en: "Specialist expertise required",
      ar: "خبرة متخصصة مطلوبة",
    },
    { value: "OTHER", en: "Other", ar: "أخرى" },
  ];
