/**
 * Mock applicant + application data for the portal.
 * Single source of truth so screens stay consistent.
 */

import type { ApplicationStatus } from "@/components/adveti/Badge";

export interface ApplicationSummary {
  id: string;
  applicantName: string;
  licenceCategory: "Teacher" | "Counsellor" | "Trainer";
  status: ApplicationStatus;
  submittedAt: Date | null;
  slaDeadlineHours: number; // hours remaining out of 5 business days = 120h
  slaTotalHours: number;
  hasCertificate: boolean;
  rfiMessage?: string;
  rfiDeadline?: Date;
  decisionLetterUrl?: string;
  certificateNumber?: string;
  validFrom?: Date;
  validTo?: Date;
}

export const mockApplicantProfile = {
  fullNameEn: "Layla Hassan Al Marri",
  fullNameAr: "ليلى حسن المري",
  emiratesId: "784-1990-1234567-1",
  nationality: "United Arab Emirates",
  nationalityAr: "الإمارات العربية المتحدة",
  dateOfBirth: "1990-04-12",
  email: "layla.hassan@example.ae",
  mobile: "+971 50 123 4567",
};

export const mockApplications: ApplicationSummary[] = [
  {
    id: "APP-2026-00042",
    applicantName: mockApplicantProfile.fullNameEn,
    licenceCategory: "Teacher",
    status: "UnderReview",
    submittedAt: new Date("2026-04-12T09:42:00"),
    slaDeadlineHours: 48, // 2 days left of 5-day SLA
    slaTotalHours: 120,
    hasCertificate: false,
  },
  {
    id: "APP-2025-00891",
    applicantName: mockApplicantProfile.fullNameEn,
    licenceCategory: "Trainer",
    status: "Approved",
    submittedAt: new Date("2025-09-01T11:00:00"),
    slaDeadlineHours: 0,
    slaTotalHours: 120,
    hasCertificate: true,
    certificateNumber: "LP-2025-00007781",
    validFrom: new Date("2025-09-15"),
    validTo: new Date("2027-09-14"),
  },
  {
    id: "APP-2026-00103",
    applicantName: mockApplicantProfile.fullNameEn,
    licenceCategory: "Counsellor",
    status: "PendingApplicant",
    submittedAt: new Date("2026-04-08T14:20:00"),
    slaDeadlineHours: 96,
    slaTotalHours: 120,
    hasCertificate: false,
    rfiMessage:
      "Please provide a clearer scan of your Master's degree certificate. The current upload is partially obscured at the bottom of page 2.",
    rfiDeadline: new Date("2026-04-30"),
  },
  {
    id: "APP-2024-00541",
    applicantName: mockApplicantProfile.fullNameEn,
    licenceCategory: "Teacher",
    status: "Expired",
    submittedAt: new Date("2024-01-10"),
    slaDeadlineHours: 0,
    slaTotalHours: 120,
    hasCertificate: false,
    validFrom: new Date("2024-01-20"),
    validTo: new Date("2026-01-19"),
  },
];

export const getApplicationById = (id: string) =>
  mockApplications.find((a) => a.id === id) ?? mockApplications[0];

export const mockNotifications = [
  {
    id: "n1",
    titleEn: "Assessor assigned to APP-2026-00042",
    titleAr: "تم تعيين مقيّم للطلب APP-2026-00042",
    bodyEn: "Your application is now under review. Decision expected within 5 business days.",
    bodyAr: "طلبك قيد المراجعة الآن. القرار خلال 5 أيام عمل.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: "n2",
    titleEn: "Action required on APP-2026-00103",
    titleAr: "يلزم اتخاذ إجراء على APP-2026-00103",
    bodyEn: "The assessor has requested additional information.",
    bodyAr: "طلب المقيّم معلومات إضافية.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: false,
  },
  {
    id: "n3",
    titleEn: "Payment receipt available",
    titleAr: "إيصال الدفع متوفر",
    bodyEn: "Receipt RCP-2026-00892 is ready to download.",
    bodyAr: "الإيصال RCP-2026-00892 جاهز للتنزيل.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    read: false,
  },
];
