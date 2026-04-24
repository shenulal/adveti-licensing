/**
 * Mock data for the Assessor back-office:
 * - Review queue items
 * - Rubric checklists per category
 * - RFI history thread
 * - Uploaded documents per application
 *
 * Single source of truth so all assessor screens stay consistent.
 */

export type Category = "Teacher" | "Counsellor" | "Trainer";
export type SlaStatus = "OnTrack" | "Amber" | "Overdue";
export type QueueStatus = "Submitted" | "UnderReview" | "PendingApplicant";

export interface QueueItem {
  applicationId: string;
  applicantNameEn: string;
  applicantNameAr: string;
  emiratesIdMasked: string;
  category: Category;
  submittedAt: Date;
  slaDeadline: Date;
  slaStatus: SlaStatus;
  status: QueueStatus;
  assignedAssessorId: string;
  assignedToMe: boolean;
}

const now = Date.now();
const h = (n: number) => 1000 * 60 * 60 * n;
const d = (n: number) => h(n * 24);

export const mockQueue: QueueItem[] = [
  {
    applicationId: "APP-2026-00042",
    applicantNameEn: "Layla Hassan Al Marri",
    applicantNameAr: "ليلى حسن المري",
    emiratesIdMasked: "784-XXXX-XXXXXXX-1",
    category: "Teacher",
    submittedAt: new Date(now - d(2)),
    slaDeadline: new Date(now + d(3)),
    slaStatus: "OnTrack",
    status: "UnderReview",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
  {
    applicationId: "APP-2026-00103",
    applicantNameEn: "Mariam Saeed Al Suwaidi",
    applicantNameAr: "مريم سعيد السويدي",
    emiratesIdMasked: "784-XXXX-XXXXXXX-3",
    category: "Counsellor",
    submittedAt: new Date(now - d(4)),
    slaDeadline: new Date(now + d(1)),
    slaStatus: "Amber",
    status: "PendingApplicant",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
  {
    applicationId: "APP-2026-00111",
    applicantNameEn: "Khalid Ibrahim Al Hosani",
    applicantNameAr: "خالد إبراهيم الحوسني",
    emiratesIdMasked: "784-XXXX-XXXXXXX-7",
    category: "Trainer",
    submittedAt: new Date(now - d(6)),
    slaDeadline: new Date(now - d(1)),
    slaStatus: "Overdue",
    status: "UnderReview",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
  {
    applicationId: "APP-2026-00120",
    applicantNameEn: "Ahmed Rashid Al Mansoori",
    applicantNameAr: "أحمد راشد المنصوري",
    emiratesIdMasked: "784-XXXX-XXXXXXX-9",
    category: "Teacher",
    submittedAt: new Date(now - h(8)),
    slaDeadline: new Date(now + d(4)),
    slaStatus: "OnTrack",
    status: "Submitted",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
  {
    applicationId: "APP-2026-00128",
    applicantNameEn: "Fatima Yousef Al Shamsi",
    applicantNameAr: "فاطمة يوسف الشامسي",
    emiratesIdMasked: "784-XXXX-XXXXXXX-2",
    category: "Counsellor",
    submittedAt: new Date(now - d(1)),
    slaDeadline: new Date(now + d(4)),
    slaStatus: "OnTrack",
    status: "Submitted",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
  {
    applicationId: "APP-2026-00131",
    applicantNameEn: "Omar Ali Al Marzooqi",
    applicantNameAr: "عمر علي المرزوقي",
    emiratesIdMasked: "784-XXXX-XXXXXXX-4",
    category: "Trainer",
    submittedAt: new Date(now - d(3)),
    slaDeadline: new Date(now + d(2)),
    slaStatus: "OnTrack",
    status: "UnderReview",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
  {
    applicationId: "APP-2026-00140",
    applicantNameEn: "Noura Mubarak Al Ali",
    applicantNameAr: "نورة مبارك العلي",
    emiratesIdMasked: "784-XXXX-XXXXXXX-5",
    category: "Teacher",
    submittedAt: new Date(now - d(5)),
    slaDeadline: new Date(now - h(4)),
    slaStatus: "Overdue",
    status: "PendingApplicant",
    assignedAssessorId: "other-assessor",
    assignedToMe: false,
  },
  {
    applicationId: "APP-2026-00148",
    applicantNameEn: "Salem Hamad Al Nuaimi",
    applicantNameAr: "سالم حمد النعيمي",
    emiratesIdMasked: "784-XXXX-XXXXXXX-6",
    category: "Trainer",
    submittedAt: new Date(now - d(1)),
    slaDeadline: new Date(now + d(4)),
    slaStatus: "OnTrack",
    status: "Submitted",
    assignedAssessorId: "other-assessor",
    assignedToMe: false,
  },
  {
    applicationId: "APP-2026-00153",
    applicantNameEn: "Hessa Khalifa Al Qubaisi",
    applicantNameAr: "حصة خليفة القبيسي",
    emiratesIdMasked: "784-XXXX-XXXXXXX-8",
    category: "Counsellor",
    submittedAt: new Date(now - d(3)),
    slaDeadline: new Date(now + h(20)),
    slaStatus: "Amber",
    status: "UnderReview",
    assignedAssessorId: "other-assessor",
    assignedToMe: false,
  },
  {
    applicationId: "APP-2026-00159",
    applicantNameEn: "Yousef Saif Al Dhaheri",
    applicantNameAr: "يوسف سيف الظاهري",
    emiratesIdMasked: "784-XXXX-XXXXXXX-0",
    category: "Teacher",
    submittedAt: new Date(now - d(2)),
    slaDeadline: new Date(now + d(3)),
    slaStatus: "OnTrack",
    status: "UnderReview",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
  {
    applicationId: "APP-2026-00164",
    applicantNameEn: "Reem Abdullah Al Ameri",
    applicantNameAr: "ريم عبدالله العامري",
    emiratesIdMasked: "784-XXXX-XXXXXXX-1",
    category: "Teacher",
    submittedAt: new Date(now - h(12)),
    slaDeadline: new Date(now + d(4)),
    slaStatus: "OnTrack",
    status: "Submitted",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
  {
    applicationId: "APP-2026-00170",
    applicantNameEn: "Mohammed Jasem Al Falasi",
    applicantNameAr: "محمد جاسم الفلاسي",
    emiratesIdMasked: "784-XXXX-XXXXXXX-3",
    category: "Counsellor",
    submittedAt: new Date(now - d(4)),
    slaDeadline: new Date(now + h(12)),
    slaStatus: "Amber",
    status: "UnderReview",
    assignedAssessorId: "mock-assessor",
    assignedToMe: true,
  },
];

export const getQueueItem = (id: string): QueueItem =>
  mockQueue.find((q) => q.applicationId === id) ?? mockQueue[0];

/* ─────────────────────────────────────── DOCUMENTS ─────────────────────────────── */

export interface AssessorDocument {
  id: string;
  fileName: string;
  type: "EmiratesId" | "Degree" | "Experience" | "CPDEvidence" | "Photo" | "Other";
  sizeKb: number;
  uploadedAt: Date;
  scanStatus: "Clean" | "Scanning" | "Quarantined";
}

export const mockDocuments: AssessorDocument[] = [
  {
    id: "doc-1",
    fileName: "emirates-id.pdf",
    type: "EmiratesId",
    sizeKb: 1240,
    uploadedAt: new Date(now - d(2)),
    scanStatus: "Clean",
  },
  {
    id: "doc-2",
    fileName: "masters-degree-aub.pdf",
    type: "Degree",
    sizeKb: 3120,
    uploadedAt: new Date(now - d(2)),
    scanStatus: "Clean",
  },
  {
    id: "doc-3",
    fileName: "employment-letter-2025.pdf",
    type: "Experience",
    sizeKb: 890,
    uploadedAt: new Date(now - d(2)),
    scanStatus: "Clean",
  },
  {
    id: "doc-4",
    fileName: "cpd-certificates.pdf",
    type: "CPDEvidence",
    sizeKb: 2480,
    uploadedAt: new Date(now - d(2)),
    scanStatus: "Clean",
  },
  {
    id: "doc-5",
    fileName: "photograph.jpg",
    type: "Photo",
    sizeKb: 480,
    uploadedAt: new Date(now - d(2)),
    scanStatus: "Clean",
  },
];

/* ──────────────────────────────────────── RUBRIC ───────────────────────────────── */

export type RubricSection =
  | "Qualifications"
  | "Experience"
  | "CPD Declaration"
  | "Documents"
  | "Declarations";

export interface RubricItem {
  id: string;
  section: RubricSection;
  labelEn: string;
  labelAr: string;
  hintEn?: string;
  hintAr?: string;
}

export const teacherRubric: RubricItem[] = [
  {
    id: "q1",
    section: "Qualifications",
    labelEn: "Holds a recognised Bachelor's degree or higher in Education or related field",
    labelAr: "يحمل شهادة بكالوريوس معترف بها أو أعلى في التربية أو مجال ذي صلة",
  },
  {
    id: "q2",
    section: "Qualifications",
    labelEn: "Degree is from an accredited institution (verified against MOHESR list)",
    labelAr: "الشهادة من مؤسسة معتمدة (مدققة مع قائمة وزارة التعليم العالي)",
  },
  {
    id: "q3",
    section: "Qualifications",
    labelEn: "Field of study is relevant to the licence category",
    labelAr: "تخصص الدراسة مرتبط بفئة الرخصة",
  },
  {
    id: "e1",
    section: "Experience",
    labelEn: "Minimum 2 years documented teaching experience",
    labelAr: "خبرة تدريسية موثقة لا تقل عن سنتين",
  },
  {
    id: "e2",
    section: "Experience",
    labelEn: "Employer letter is on official letterhead with date and signature",
    labelAr: "خطاب جهة العمل على ورق رسمي مع التاريخ والتوقيع",
  },
  {
    id: "c1",
    section: "CPD Declaration",
    labelEn: "Declared at least 30 CPD hours in the past 2 years",
    labelAr: "إعلان 30 ساعة تطوير مهني على الأقل خلال السنتين الماضيتين",
  },
  {
    id: "c2",
    section: "CPD Declaration",
    labelEn: "Supporting evidence aligns with declared hours",
    labelAr: "الأدلة الداعمة تتوافق مع الساعات المعلنة",
  },
  {
    id: "d1",
    section: "Documents",
    labelEn: "Emirates ID is valid and clearly legible",
    labelAr: "الهوية الإماراتية سارية وواضحة",
  },
  {
    id: "d2",
    section: "Documents",
    labelEn: "Photograph meets quality standards (passport-style, recent)",
    labelAr: "الصورة الشخصية تستوفي المعايير (بحجم جواز السفر، حديثة)",
  },
  {
    id: "d3",
    section: "Documents",
    labelEn: "All documents are free from tampering or alterations",
    labelAr: "جميع المستندات خالية من التلاعب أو التعديل",
  },
  {
    id: "decl1",
    section: "Declarations",
    labelEn: "Applicant has signed all required declarations",
    labelAr: "وقّع المتقدم على جميع الإقرارات المطلوبة",
  },
  {
    id: "decl2",
    section: "Declarations",
    labelEn: "No conflict of interest disclosed by the assessor",
    labelAr: "لا يوجد تضارب مصالح من قِبل المقيّم",
  },
];

/* ─────────────────────────────────────── RFI HISTORY ───────────────────────────── */

export interface RfiMessage {
  id: string;
  from: "assessor" | "applicant";
  authorName: string;
  subjectEn: string;
  subjectAr: string;
  bodyEn: string;
  bodyAr: string;
  sentAt: Date;
  attachments?: string[];
}

export const mockRfiThread: RfiMessage[] = [
  {
    id: "rfi-1",
    from: "assessor",
    authorName: "Omar Al Marzooqi",
    subjectEn: "Additional information required — APP-2026-00042",
    subjectAr: "معلومات إضافية مطلوبة — APP-2026-00042",
    bodyEn:
      "Dear Layla,\n\nThe employment letter you uploaded is missing the date of issue. Please re-upload a copy on official letterhead with a clear date and signature.",
    bodyAr:
      "عزيزتي ليلى،\n\nخطاب جهة العمل المرفوع تنقصه تاريخ الإصدار. يرجى إعادة رفع نسخة على ورق رسمي مع تاريخ وتوقيع واضحين.",
    sentAt: new Date(now - d(3)),
  },
  {
    id: "rfi-2",
    from: "applicant",
    authorName: "Layla Al Marri",
    subjectEn: "Re: Additional information required",
    subjectAr: "رد: معلومات إضافية مطلوبة",
    bodyEn:
      "Hello,\n\nThank you for the note. I have re-uploaded the employment letter with the official date stamp from the HR department.",
    bodyAr:
      "مرحباً،\n\nشكراً على الملاحظة. أعدت رفع خطاب جهة العمل مع ختم التاريخ الرسمي من إدارة الموارد البشرية.",
    sentAt: new Date(now - d(2)),
    attachments: ["employment-letter-revised.pdf"],
  },
];
