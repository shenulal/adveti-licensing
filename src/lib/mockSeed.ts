/**
 * ADVETI demo seed data — used to make every screen look like a live,
 * day-2-of-operation platform. All names follow UAE conventions, Emirates
 * IDs follow the 784-YYYY-NNNNNNN-N pattern (synthetic check digit).
 *
 * NOTE: Existing screens may still reference older mock files
 * (mockApplicant, mockAdmin, mockAudit, mockFinance, mockSenior, mockAssessor,
 * mockNotifications). This module is additive — it powers the new
 * Operational Dashboard and acts as a canonical reference.
 */

import type { ApplicationStatus } from "@/components/adveti/Badge";

// ===== Categories =====
export type LicenceCategory = "Teacher" | "Counsellor" | "Trainer";

export const CATEGORY_LABEL: Record<LicenceCategory, { en: string; ar: string }> = {
  Teacher:    { en: "Teacher",    ar: "معلّم" },
  Counsellor: { en: "Counsellor", ar: "مرشد" },
  Trainer:    { en: "Trainer",    ar: "مدرّب" },
};

export const STATUS_LABEL: Record<ApplicationStatus, { en: string; ar: string }> = {
  Draft:            { en: "Draft",             ar: "مسودة" },
  Submitted:        { en: "Submitted",         ar: "مُقدَّم" },
  UnderReview:      { en: "Under Review",      ar: "قيد المراجعة" },
  PendingApplicant: { en: "Pending Applicant", ar: "بانتظار المتقدم" },
  Approved:         { en: "Approved",          ar: "معتمد" },
  Incomplete:       { en: "Incomplete",        ar: "ناقص" },
  Rejected:         { en: "Rejected",          ar: "مرفوض" },
  Expired:          { en: "Expired",           ar: "منتهي" },
  Suspended:        { en: "Suspended",         ar: "موقوف" },
  Revoked:          { en: "Revoked",           ar: "مُلغى" },
};

export const FEE_BY_CATEGORY: Record<LicenceCategory, number> = {
  Teacher: 1050,
  Counsellor: 840,
  Trainer: 630,
};

// ===== Applicant pool (40) =====
export interface SeedApplicant {
  id: string;
  nameEn: string;
  nameAr: string;
  emiratesId: string;
  nationality: string;
  category: LicenceCategory;
  email: string;
}

const APPLICANT_INPUT: Omit<SeedApplicant, "id" | "email">[] = [
  { nameEn: "Fatima Khalid Al Mazrouei", nameAr: "فاطمة خالد المزروعي", emiratesId: "784-1990-1234567-1", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Mohammed Saeed Al Hashimi", nameAr: "محمد سعيد الهاشمي",   emiratesId: "784-1985-7654321-3", nationality: "Emirati",     category: "Counsellor" },
  { nameEn: "Aisha Nasser Al Dhaheri",   nameAr: "عائشة ناصر الظاهري",  emiratesId: "784-1993-2345678-5", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Priya Menon",               nameAr: "بريا مينون",          emiratesId: "784-1988-8765432-2", nationality: "Indian",      category: "Trainer" },
  { nameEn: "Sarah Thompson",            nameAr: "سارة تومسون",          emiratesId: "784-1991-3456789-4", nationality: "British",     category: "Counsellor" },
  { nameEn: "Omar Hassan Al Suwaidi",    nameAr: "عمر حسن السويدي",     emiratesId: "784-1987-9876543-6", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Rania Mahmoud Eid",         nameAr: "رانيا محمود عيد",     emiratesId: "784-1995-4567890-8", nationality: "Egyptian",    category: "Trainer" },
  { nameEn: "David Chen",                nameAr: "ديفيد تشن",            emiratesId: "784-1986-5678901-0", nationality: "Singaporean", category: "Teacher" },
  { nameEn: "Yousef Ali Al Romaithi",    nameAr: "يوسف علي الرميثي",    emiratesId: "784-1989-1122334-2", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Layla Hassan Al Marri",     nameAr: "ليلى حسن المري",      emiratesId: "784-1990-9988776-4", nationality: "Emirati",     category: "Counsellor" },
  { nameEn: "Khalid Mubarak Al Falasi",  nameAr: "خالد مبارك الفلاسي",  emiratesId: "784-1984-3344556-7", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Maryam Saif Al Kaabi",      nameAr: "مريم سيف الكعبي",     emiratesId: "784-1992-5566778-9", nationality: "Emirati",     category: "Trainer" },
  { nameEn: "Hessa Rashid Al Nuaimi",    nameAr: "حصة راشد النعيمي",    emiratesId: "784-1988-7788990-1", nationality: "Emirati",     category: "Counsellor" },
  { nameEn: "Ahmad Tariq Al Shamsi",     nameAr: "أحمد طارق الشامسي",   emiratesId: "784-1986-1133557-3", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Noura Sultan Al Qubaisi",   nameAr: "نورة سلطان القبيسي",  emiratesId: "784-1994-2244668-5", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "John O'Brien",              nameAr: "جون أوبراين",          emiratesId: "784-1983-6677889-7", nationality: "Irish",       category: "Trainer" },
  { nameEn: "Anjali Sharma",             nameAr: "أنجالي شارما",         emiratesId: "784-1990-8899002-9", nationality: "Indian",      category: "Counsellor" },
  { nameEn: "Hamad Obaid Al Mansoori",   nameAr: "حمد عبيد المنصوري",   emiratesId: "784-1985-1010101-0", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Reem Abdullah Al Ameri",    nameAr: "ريم عبدالله العامري", emiratesId: "784-1996-2020202-1", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Saif Mohammed Al Ali",      nameAr: "سيف محمد آل علي",     emiratesId: "784-1982-3030303-2", nationality: "Emirati",     category: "Trainer" },
  { nameEn: "Maha Yousef Khoury",        nameAr: "مها يوسف الخوري",     emiratesId: "784-1989-4040404-3", nationality: "Lebanese",    category: "Counsellor" },
  { nameEn: "Tariq Aziz Khan",           nameAr: "طارق عزيز خان",       emiratesId: "784-1987-5050505-4", nationality: "Pakistani",   category: "Teacher" },
  { nameEn: "Emma Wilson",               nameAr: "إيما ويلسون",          emiratesId: "784-1992-6060606-5", nationality: "Australian",  category: "Trainer" },
  { nameEn: "Hind Salem Al Kuwaiti",     nameAr: "هند سالم الكويتي",    emiratesId: "784-1991-7070707-6", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Khaled Adel Mansour",       nameAr: "خالد عادل منصور",     emiratesId: "784-1984-8080808-7", nationality: "Jordanian",   category: "Counsellor" },
  { nameEn: "Sumaya Adnan Al Awadhi",    nameAr: "سمية عدنان العوضي",  emiratesId: "784-1993-9090909-8", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Marc Dubois",               nameAr: "مارك دوبوا",           emiratesId: "784-1985-1212121-9", nationality: "French",      category: "Trainer" },
  { nameEn: "Wadha Hamdan Al Otaiba",    nameAr: "وضحة حمدان العتيبة",  emiratesId: "784-1990-1313131-0", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Ali Jasim Al Blooshi",      nameAr: "علي جاسم البلوشي",    emiratesId: "784-1988-1414141-1", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Yara Nizar Saleh",          nameAr: "يارا نزار صالح",       emiratesId: "784-1995-1515151-2", nationality: "Syrian",      category: "Counsellor" },
  { nameEn: "Hassan Ibrahim Al Mahmoud", nameAr: "حسن إبراهيم المحمود", emiratesId: "784-1986-1616161-3", nationality: "Emirati",     category: "Trainer" },
  { nameEn: "Lulwa Faisal Al Sharqi",    nameAr: "لولوة فيصل الشرقي",   emiratesId: "784-1992-1717171-4", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Bilal Mansour Haddad",      nameAr: "بلال منصور حداد",     emiratesId: "784-1989-1818181-5", nationality: "Jordanian",   category: "Teacher" },
  { nameEn: "Salama Khamis Al Yahyaei",  nameAr: "سلامة خميس اليحيائي", emiratesId: "784-1991-1919191-6", nationality: "Emirati",     category: "Counsellor" },
  { nameEn: "Abdullah Saif Al Ketbi",    nameAr: "عبدالله سيف الكتبي",  emiratesId: "784-1983-2121212-7", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Catherine Reed",            nameAr: "كاثرين ريد",           emiratesId: "784-1987-2323232-8", nationality: "Canadian",    category: "Trainer" },
  { nameEn: "Hamda Mohammed Al Beloushi",nameAr: "حمدة محمد البلوشي",   emiratesId: "784-1994-2424242-9", nationality: "Emirati",     category: "Teacher" },
  { nameEn: "Faisal Khalifa Al Zaabi",   nameAr: "فيصل خليفة الزعابي",  emiratesId: "784-1986-2525252-0", nationality: "Emirati",     category: "Counsellor" },
  { nameEn: "Lina Tarek Awad",           nameAr: "لينا طارق عوض",       emiratesId: "784-1990-2626262-1", nationality: "Egyptian",    category: "Trainer" },
  { nameEn: "Mariam Sultan Al Jaberi",   nameAr: "مريم سلطان الجابري",  emiratesId: "784-1993-2727272-2", nationality: "Emirati",     category: "Teacher" },
];

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "");

export const SEED_APPLICANTS: SeedApplicant[] = APPLICANT_INPUT.map((a, i) => ({
  ...a,
  id: `APL-${String(i + 1).padStart(4, "0")}`,
  email: `${slugify(a.nameEn)}@example.ae`,
}));

// ===== Applications (60) =====
export interface SeedApplication {
  id: string;
  applicantIndex: number;       // index into SEED_APPLICANTS
  category: LicenceCategory;
  status: ApplicationStatus;
  submittedAt: Date | null;
  decidedAt: Date | null;
  fee: number;
  paid: boolean;
  /** SLA progress 0-1; >1 = breached */
  slaProgress: number;
  certificateNumber?: string;
}

const STATUS_PLAN: Array<{ status: ApplicationStatus; n: number }> = [
  { status: "Approved",         n: 15 },
  { status: "UnderReview",      n: 10 },
  { status: "PendingApplicant", n: 8  },
  { status: "Submitted",        n: 7  },
  { status: "Incomplete",       n: 6  },
  { status: "Rejected",         n: 5  },
  { status: "Expired",          n: 5  },
  { status: "Draft",            n: 2  },
  { status: "Suspended",        n: 2  },
];

const dayMs = 24 * 60 * 60 * 1000;

export const SEED_APPLICATIONS: SeedApplication[] = (() => {
  const out: SeedApplication[] = [];
  let i = 1;
  let certCounter = 1;

  for (const { status, n } of STATUS_PLAN) {
    for (let k = 0; k < n; k++) {
      const applicantIndex = (i - 1) % SEED_APPLICANTS.length;
      const category = SEED_APPLICANTS[applicantIndex].category;
      const id = `APP-2026-${String(i).padStart(5, "0")}`;
      const fee = FEE_BY_CATEGORY[category];

      // Submission date depends on status
      let submittedAt: Date | null = new Date(Date.now() - (90 - i) * dayMs);
      let decidedAt: Date | null = null;
      let paid = true;
      let slaProgress = 0.4;
      let certificateNumber: string | undefined;

      switch (status) {
        case "Draft":
          submittedAt = null;
          paid = false;
          slaProgress = 0;
          break;
        case "Submitted":
          slaProgress = 0.15 + (k / n) * 0.25;
          break;
        case "UnderReview":
          // SLA variety: some overdue, some amber, some on-track
          slaProgress = k < 3 ? 1.05 + k * 0.1 : k < 7 ? 0.78 + k * 0.02 : 0.4 + k * 0.05;
          break;
        case "PendingApplicant":
          slaProgress = 0.55;
          break;
        case "Incomplete":
          slaProgress = 0.85;
          break;
        case "Approved":
          decidedAt = new Date(Date.now() - (45 - k * 2) * dayMs);
          slaProgress = 0;
          certificateNumber = `LP-2026-${String(certCounter++).padStart(5, "0")}`;
          break;
        case "Rejected":
          decidedAt = new Date(Date.now() - (30 - k * 3) * dayMs);
          slaProgress = 0;
          break;
        case "Expired":
          decidedAt = new Date(Date.now() - (200 + k * 10) * dayMs);
          slaProgress = 0;
          certificateNumber = `LP-2024-${String(900 + k).padStart(5, "0")}`;
          break;
        case "Suspended":
          decidedAt = new Date(Date.now() - 60 * dayMs);
          slaProgress = 0;
          certificateNumber = `LP-2026-${String(certCounter++).padStart(5, "0")}`;
          break;
        default:
          break;
      }

      out.push({
        id,
        applicantIndex,
        category,
        status,
        submittedAt,
        decidedAt,
        fee,
        paid,
        slaProgress,
        certificateNumber,
      });
      i++;
    }
  }
  return out;
})();

// ===== KPIs / charts data =====

const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

const now = new Date();
export const REVENUE_TREND = Array.from({ length: 12 }).map((_, idx) => {
  const monthIdx = (now.getMonth() - 11 + idx + 12) % 12;
  // Synthetic but plausible curve: ramp up from 18k to 84k
  const base = [18, 21, 26, 33, 38, 41, 47, 56, 62, 71, 78, 84][idx];
  return {
    monthEn: monthsEn[monthIdx],
    monthAr: monthsAr[monthIdx],
    revenueAed: base * 1000,
    applications: Math.round(base * 0.95),
  };
});

export const FUNNEL = [
  { keyEn: "Submitted",    keyAr: "مُقدَّم",       count: 198, color: "hsl(var(--info-600))" },
  { keyEn: "Paid",         keyAr: "مدفوع",          count: 184, color: "hsl(var(--gold-500))" },
  { keyEn: "Under Review", keyAr: "قيد المراجعة",  count: 161, color: "hsl(var(--warning-600))" },
  { keyEn: "Decided",      keyAr: "تمّ القرار",     count: 147, color: "hsl(var(--navy-700))" },
  { keyEn: "Issued",       keyAr: "صادر",           count: 138, color: "hsl(var(--success-600))" },
];

export const DECISION_OUTCOMES = [
  { keyEn: "Approved",   keyAr: "معتمد",  count: 72, color: "hsl(var(--success-600))" },
  { keyEn: "Incomplete", keyAr: "ناقص",   count: 18, color: "hsl(var(--warning-600))" },
  { keyEn: "Rejected",   keyAr: "مرفوض",  count: 12, color: "hsl(var(--danger-600))" },
];

export const SLA_ON_TIME_PCT = 87;

// 30-day spark series for KPI cards
const spark = (seed: number, len = 30) =>
  Array.from({ length: len }).map((_, i) => {
    const x = (i / len) * Math.PI * 2;
    return Math.round(40 + Math.sin(x + seed) * 14 + ((i * (seed + 3)) % 11));
  });

export const KPIS = {
  newApplications: {
    en: "New applications",
    ar: "طلبات جديدة",
    value: 198,
    deltaPct: 12,
    spark: spark(1.1),
  },
  certificatesIssued: {
    en: "Certificates issued",
    ar: "شهادات صادرة",
    value: 138,
    deltaPct: 9,
    spark: spark(2.4),
  },
  revenueAed: {
    en: "Revenue this month",
    ar: "إيرادات الشهر",
    value: 84_000,
    deltaPct: 7,
    spark: spark(0.4),
  },
};

// Today's live feed
export interface FeedEvent {
  id: string;
  kind: "submission" | "payment" | "issued" | "rfi" | "approval" | "login";
  textEn: string;
  textAr: string;
  minutesAgo: number;
}

export const TODAYS_FEED: FeedEvent[] = [
  { id: "f1", kind: "submission", textEn: "APP-2026-00198 — Submitted",                          textAr: "APP-2026-00198 — تم التقديم",                     minutesAgo: 4 },
  { id: "f2", kind: "issued",     textEn: "Certificate issued — Fatima Al Mazrouei",             textAr: "صدرت شهادة — فاطمة المزروعي",                    minutesAgo: 11 },
  { id: "f3", kind: "payment",    textEn: "Payment received — AED 1,050 (Teacher)",              textAr: "تم استلام دفعة — 1,050 د.إ (معلّم)",             minutesAgo: 18 },
  { id: "f4", kind: "approval",   textEn: "Senior approval recorded — APP-2026-00184",           textAr: "تم تسجيل الاعتماد — APP-2026-00184",              minutesAgo: 27 },
  { id: "f5", kind: "rfi",        textEn: "RFI sent — APP-2026-00177 (clearer Master's scan)",   textAr: "طلب معلومات إضافية — APP-2026-00177",            minutesAgo: 39 },
];

// Assessor workload
export const ASSESSOR_WORKLOAD = [
  { nameEn: "Khalid Al Mansoori", nameAr: "خالد المنصوري",  queue: 4, avgDays: 2.3 },
  { nameEn: "Nadia Farooq",       nameAr: "نادية فاروق",     queue: 3, avgDays: 3.1 },
  { nameEn: "James Whitfield",    nameAr: "جيمس ويتفيلد",    queue: 3, avgDays: 1.8 },
  { nameEn: "Amira Yousef",       nameAr: "أميرة يوسف",      queue: 2, avgDays: 2.7 },
];
