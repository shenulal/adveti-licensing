/**
 * Mock data for the Finance Officer back-office:
 * - Reconciliation rows (collected vs. gateway settled)
 * - Refund requests across the dual-approval workflow
 * - Revenue summary metrics for /finance/reports
 * - VAT return aggregates per quarter
 */

export type Category = "Teacher" | "Counsellor" | "Trainer";

export type MatchStatus = "Matched" | "Variance" | "Unmatched";

export interface ReconciliationRow {
  date: Date;
  receiptNumber: string;
  applicationId: string;
  applicantNameEn: string;
  applicantNameAr: string;
  category: Category;
  feeAmount: number;
  vatAmount: number;
  total: number;
  gatewayReference: string;
  matchStatus: MatchStatus;
  varianceAmount?: number;
}

export type RefundStatus =
  | "PendingFinance"
  | "FinanceApproved"
  | "FullyApproved"
  | "Rejected"
  | "Processed";

export interface RefundRequest {
  id: string;
  applicationId: string;
  applicantNameEn: string;
  applicantNameAr: string;
  originalAmount: number;
  refundAmount: number;
  vatAdjustment: number;
  reason: string;
  reasonAr: string;
  applicationStatusAtRequest: string;
  requestedAt: Date;
  status: RefundStatus;
  financeOfficerNotes?: string;
  superAdminNotes?: string;
  audit: { at: Date; by: string; action: string }[];
}

const now = Date.now();
const d = (n: number) => 1000 * 60 * 60 * 24 * n;
const h = (n: number) => 1000 * 60 * 60 * n;

const NAMES_EN = [
  "Layla Hassan Al Marri",
  "Khalid Ibrahim Al Hosani",
  "Maryam Saeed Al Dhaheri",
  "Ahmed Yousuf Al Mansoori",
  "Fatima Ali Al Suwaidi",
  "Hamad Rashid Al Ameri",
  "Noura Saif Al Kaabi",
  "Sultan Mohamed Al Zaabi",
  "Aisha Khalifa Al Nuaimi",
  "Omar Faisal Al Shamsi",
  "Mariam Hamdan Al Mazrouei",
  "Yousef Tariq Al Falasi",
  "Salma Abdullah Al Qubaisi",
  "Mohammed Saeed Al Otaiba",
  "Amna Hamad Al Romaithi",
  "Tariq Nasser Al Blooshi",
  "Reem Khalid Al Mehairi",
  "Hessa Saif Al Khoori",
  "Abdulrahman Ali Al Jneibi",
  "Shamma Saleh Al Hammadi",
  "Khalifa Mubarak Al Mheiri",
  "Latifa Mohamed Al Ali",
  "Saif Hamad Al Marar",
  "Wadeema Khalid Al Ketbi",
  "Rashed Saeed Al Yammahi",
  "Hind Yousuf Al Tayer",
  "Faisal Hamdan Al Muhairi",
  "Mira Saif Al Shehhi",
  "Saud Tariq Al Awar",
  "Dhabiya Hamad Al Olama",
];

const NAMES_AR = [
  "ليلى حسن المري",
  "خالد إبراهيم الحوسني",
  "مريم سعيد الظاهري",
  "أحمد يوسف المنصوري",
  "فاطمة علي السويدي",
  "حمد راشد العامري",
  "نورة سيف الكعبي",
  "سلطان محمد الزعابي",
  "عائشة خليفة النعيمي",
  "عمر فيصل الشامسي",
  "مريم حمدان المزروعي",
  "يوسف طارق الفلاسي",
  "سلمى عبدالله القبيسي",
  "محمد سعيد العتيبة",
  "آمنة حمد الرميثي",
  "طارق ناصر البلوشي",
  "ريم خالد المهيري",
  "حصة سيف الخوري",
  "عبدالرحمن علي الجنيبي",
  "شما صالح الحمادي",
  "خليفة مبارك المهيري",
  "لطيفة محمد العلي",
  "سيف حمد المرر",
  "وديمة خالد الكتبي",
  "راشد سعيد اليماحي",
  "هند يوسف الطاير",
  "فيصل حمدان المهيري",
  "ميرا سيف الشحي",
  "سعود طارق الأعور",
  "ذبية حمد العلامة",
];

const CATS: Category[] = ["Teacher", "Counsellor", "Trainer"];

// Fee + VAT (5%) lookup per category
const baseFees: Record<Category, number> = {
  Teacher: 1000,
  Counsellor: 1200,
  Trainer: 800,
};

export const mockReconciliation: ReconciliationRow[] = Array.from(
  { length: 30 },
  (_, i): ReconciliationRow => {
    const cat = CATS[i % 3];
    const fee = baseFees[cat];
    const vat = Math.round(fee * 0.05);
    const total = fee + vat;
    let matchStatus: MatchStatus = "Matched";
    let varianceAmount: number | undefined;
    if (i === 7 || i === 14 || i === 22) {
      matchStatus = "Variance";
      varianceAmount = i === 7 ? 50 : i === 14 ? 100 : 25;
    } else if (i === 19) {
      matchStatus = "Unmatched";
    }
    return {
      date: new Date(now - d(i)),
      receiptNumber: `R-2026-${(1000 + i).toString().padStart(5, "0")}`,
      applicationId: `APP-2026-${(40 + i).toString().padStart(5, "0")}`,
      applicantNameEn: NAMES_EN[i],
      applicantNameAr: NAMES_AR[i],
      category: cat,
      feeAmount: fee,
      vatAmount: vat,
      total,
      gatewayReference: `MGW-${(900000 + i * 17).toString()}`,
      matchStatus,
      varianceAmount,
    };
  },
);

// Aggregates derived from reconciliation
export const reconciliationTotals = (() => {
  const collected = mockReconciliation.reduce((s, r) => s + r.total, 0);
  const variance = mockReconciliation.reduce(
    (s, r) => s + (r.varianceAmount ?? 0),
    0,
  );
  return {
    collectedTotal: collected,
    collectedCount: mockReconciliation.length,
    gatewaySettled: collected - variance,
    variance,
  };
})();

export const mockRefunds: RefundRequest[] = [
  {
    id: "RFND-2026-0001",
    applicationId: "APP-2026-00042",
    applicantNameEn: NAMES_EN[0],
    applicantNameAr: NAMES_AR[0],
    originalAmount: 1050,
    refundAmount: 945,
    vatAdjustment: 45,
    reason:
      "Withdrew application within 14 days of submission. Eligible for 90% refund per policy.",
    reasonAr:
      "تم سحب الطلب خلال 14 يومًا من تقديمه. مستحق لاسترداد 90% وفق السياسة.",
    applicationStatusAtRequest: "Submitted",
    requestedAt: new Date(now - d(2)),
    status: "PendingFinance",
    audit: [
      {
        at: new Date(now - d(2)),
        by: "Layla Hassan Al Marri",
        action: "Refund requested via portal",
      },
    ],
  },
  {
    id: "RFND-2026-0002",
    applicationId: "APP-2026-00111",
    applicantNameEn: NAMES_EN[1],
    applicantNameAr: NAMES_AR[1],
    originalAmount: 840,
    refundAmount: 420,
    vatAdjustment: 20,
    reason: "Duplicate payment caused by gateway retry.",
    reasonAr: "دفعة مكررة نتيجة إعادة محاولة من بوابة الدفع.",
    applicationStatusAtRequest: "Submitted",
    requestedAt: new Date(now - d(3)),
    status: "PendingFinance",
    audit: [
      {
        at: new Date(now - d(3)),
        by: "Khalid Ibrahim Al Hosani",
        action: "Refund requested via portal",
      },
    ],
  },
  {
    id: "RFND-2026-0003",
    applicationId: "APP-2026-00152",
    applicantNameEn: NAMES_EN[2],
    applicantNameAr: NAMES_AR[2],
    originalAmount: 1260,
    refundAmount: 0,
    vatAdjustment: 0,
    reason: "Refund requested 45 days after rejection — outside policy window.",
    reasonAr: "طلب الاسترداد بعد 45 يومًا من الرفض — خارج فترة السياسة.",
    applicationStatusAtRequest: "Rejected",
    requestedAt: new Date(now - d(5)),
    status: "Rejected",
    financeOfficerNotes:
      "Refund window is 30 days from rejection per policy section 4.2.",
    audit: [
      {
        at: new Date(now - d(5)),
        by: "Maryam Saeed Al Dhaheri",
        action: "Refund requested via portal",
      },
      {
        at: new Date(now - d(4)),
        by: "Finance Officer",
        action: "Rejected — outside policy window",
      },
    ],
  },
  {
    id: "RFND-2026-0004",
    applicationId: "APP-2026-00187",
    applicantNameEn: NAMES_EN[3],
    applicantNameAr: NAMES_AR[3],
    originalAmount: 1050,
    refundAmount: 945,
    vatAdjustment: 45,
    reason: "Eligibility error — applicant did not meet category requirements.",
    reasonAr: "خطأ في الأهلية — لم يستوفِ مقدم الطلب متطلبات الفئة.",
    applicationStatusAtRequest: "UnderReview",
    requestedAt: new Date(now - d(6)),
    status: "FinanceApproved",
    financeOfficerNotes:
      "Verified eligibility error. Refund approved at 90%, awaiting final sign-off.",
    audit: [
      {
        at: new Date(now - d(6)),
        by: "Ahmed Yousuf Al Mansoori",
        action: "Refund requested via portal",
      },
      {
        at: new Date(now - d(5)),
        by: "Finance Officer",
        action: "Approved (first stage)",
      },
    ],
  },
  {
    id: "RFND-2026-0005",
    applicationId: "APP-2026-00203",
    applicantNameEn: NAMES_EN[4],
    applicantNameAr: NAMES_AR[4],
    originalAmount: 840,
    refundAmount: 756,
    vatAdjustment: 36,
    reason: "Withdrew before assessment commenced.",
    reasonAr: "انسحب قبل بدء التقييم.",
    applicationStatusAtRequest: "Submitted",
    requestedAt: new Date(now - d(8)),
    status: "FinanceApproved",
    financeOfficerNotes: "Eligible per policy section 4.1.",
    audit: [
      {
        at: new Date(now - d(8)),
        by: "Fatima Ali Al Suwaidi",
        action: "Refund requested via portal",
      },
      {
        at: new Date(now - d(7)),
        by: "Finance Officer",
        action: "Approved (first stage)",
      },
    ],
  },
  {
    id: "RFND-2026-0006",
    applicationId: "APP-2026-00221",
    applicantNameEn: NAMES_EN[5],
    applicantNameAr: NAMES_AR[5],
    originalAmount: 1260,
    refundAmount: 1134,
    vatAdjustment: 54,
    reason: "Service unavailable due to platform incident PI-2026-014.",
    reasonAr: "الخدمة غير متاحة بسبب حادث المنصة PI-2026-014.",
    applicationStatusAtRequest: "Submitted",
    requestedAt: new Date(now - d(11)),
    status: "FullyApproved",
    financeOfficerNotes: "Approved — incident-related refund.",
    superAdminNotes: "Final approval granted. Process to gateway.",
    audit: [
      {
        at: new Date(now - d(11)),
        by: "Hamad Rashid Al Ameri",
        action: "Refund requested",
      },
      {
        at: new Date(now - d(10)),
        by: "Finance Officer",
        action: "Approved (first stage)",
      },
      {
        at: new Date(now - d(9)),
        by: "Super Admin",
        action: "Final approval",
      },
    ],
  },
  {
    id: "RFND-2026-0007",
    applicationId: "APP-2026-00244",
    applicantNameEn: NAMES_EN[6],
    applicantNameAr: NAMES_AR[6],
    originalAmount: 1050,
    refundAmount: 945,
    vatAdjustment: 45,
    reason: "Withdrew within policy window.",
    reasonAr: "انسحب خلال فترة السياسة.",
    applicationStatusAtRequest: "Submitted",
    requestedAt: new Date(now - d(15)),
    status: "Processed",
    financeOfficerNotes: "Approved.",
    superAdminNotes: "Approved. Processed via gateway ref MGW-998877.",
    audit: [
      {
        at: new Date(now - d(15)),
        by: "Noura Saif Al Kaabi",
        action: "Refund requested",
      },
      {
        at: new Date(now - d(14)),
        by: "Finance Officer",
        action: "Approved (first stage)",
      },
      {
        at: new Date(now - d(13)),
        by: "Super Admin",
        action: "Final approval",
      },
      {
        at: new Date(now - d(12)),
        by: "System",
        action: "Refund processed via payment gateway",
      },
    ],
  },
  {
    id: "RFND-2026-0008",
    applicationId: "APP-2026-00267",
    applicantNameEn: NAMES_EN[7],
    applicantNameAr: NAMES_AR[7],
    originalAmount: 840,
    refundAmount: 756,
    vatAdjustment: 36,
    reason: "Duplicate payment — gateway double charge.",
    reasonAr: "دفعة مكررة — خصم مزدوج من البوابة.",
    applicationStatusAtRequest: "Submitted",
    requestedAt: new Date(now - h(18)),
    status: "PendingFinance",
    audit: [
      {
        at: new Date(now - h(18)),
        by: "Sultan Mohamed Al Zaabi",
        action: "Refund requested via portal",
      },
    ],
  },
];

// Revenue report data
export interface CategoryRevenue {
  category: Category;
  revenue: number;
  count: number;
}

export const revenueByCategory: CategoryRevenue[] = [
  { category: "Teacher", revenue: 48000, count: 48 },
  { category: "Counsellor", revenue: 30000, count: 25 },
  { category: "Trainer", revenue: 18000, count: 22 },
];

export const revenueByMonth: { month: string; monthAr: string; value: number }[] =
  [
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

export const applicationsByStatus = [
  { status: "Approved", count: 312, color: "success" as const },
  { status: "Rejected", count: 48, color: "danger" as const },
  { status: "InProgress", count: 96, color: "warning" as const },
];

export const reportMetrics = {
  totalRevenue: 958000,
  averageFee: 1018,
  refundedAmount: 18450,
  netRevenue: 939550,
};

// VAT return data
export interface VatQuarter {
  id: string;
  labelEn: string;
  labelAr: string;
  standardRated: number;
  vatCollected: number;
  zeroRated: number;
  refundsIssued: number;
  vatOnRefunds: number;
  netVatPayable: number;
}

export const vatQuarters: VatQuarter[] = [
  {
    id: "Q4-2025",
    labelEn: "Q4 2025 (Oct–Dec)",
    labelAr: "الربع الرابع 2025 (أكتوبر–ديسمبر)",
    standardRated: 235000,
    vatCollected: 11750,
    zeroRated: 0,
    refundsIssued: 8400,
    vatOnRefunds: 420,
    netVatPayable: 11330,
  },
  {
    id: "Q1-2026",
    labelEn: "Q1 2026 (Jan–Mar)",
    labelAr: "الربع الأول 2026 (يناير–مارس)",
    standardRated: 273000,
    vatCollected: 13650,
    zeroRated: 0,
    refundsIssued: 5670,
    vatOnRefunds: 283,
    netVatPayable: 13367,
  },
  {
    id: "Q2-2026",
    labelEn: "Q2 2026 (Apr–Jun)",
    labelAr: "الربع الثاني 2026 (أبريل–يونيو)",
    standardRated: 96000,
    vatCollected: 4800,
    zeroRated: 0,
    refundsIssued: 1050,
    vatOnRefunds: 52,
    netVatPayable: 4748,
  },
];

export const refundReasonCodes = [
  { code: "WITHDRAWN", en: "Withdrawn within policy window", ar: "السحب خلال فترة السياسة" },
  { code: "DUPLICATE", en: "Duplicate payment", ar: "دفعة مكررة" },
  { code: "ELIGIBILITY", en: "Eligibility error", ar: "خطأ في الأهلية" },
  { code: "INCIDENT", en: "Service incident", ar: "حادث خدمة" },
  { code: "OUTSIDE_WINDOW", en: "Outside refund window", ar: "خارج نافذة الاسترداد" },
  { code: "OTHER", en: "Other (specify in notes)", ar: "أخرى (يحدد في الملاحظات)" },
];
