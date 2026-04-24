/**
 * Mock notification dataset shared by bell dropdown + full centre.
 * One source of truth — categorised, bilingual, deep-linked.
 */

export type NotificationCategory =
  | "Application"
  | "Payment"
  | "System"
  | "Renewal"
  | "Compliance";

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  href: string;
  isRead: boolean;
  createdAt: Date;
}

const HOUR = 1000 * 60 * 60;
const now = Date.now();

export const mockNotificationsV2: Notification[] = [
  {
    id: "ntf-001",
    category: "Application",
    title: "Assessor assigned to APP-2026-00042",
    titleAr: "تم تعيين مقيّم للطلب APP-2026-00042",
    body: "Your application is now under review. A decision is expected within 5 business days.",
    bodyAr: "طلبك قيد المراجعة الآن. يُتوقع صدور القرار خلال 5 أيام عمل.",
    href: "/portal/applications/APP-2026-00042",
    isRead: false,
    createdAt: new Date(now - 2 * HOUR),
  },
  {
    id: "ntf-002",
    category: "Compliance",
    title: "Action required on APP-2026-00103",
    titleAr: "يلزم اتخاذ إجراء على APP-2026-00103",
    body: "The assessor has requested additional information. Respond by 30 Apr 2026 to avoid delay.",
    bodyAr: "طلب المقيّم معلومات إضافية. يُرجى الرد قبل 30 أبريل 2026 لتجنّب التأخير.",
    href: "/portal/applications/APP-2026-00103",
    isRead: false,
    createdAt: new Date(now - 6 * HOUR),
  },
  {
    id: "ntf-003",
    category: "Payment",
    title: "Payment receipt RCP-2026-00892 ready",
    titleAr: "إيصال الدفع RCP-2026-00892 جاهز",
    body: "Your payment of AED 1,050 has been received. Tap to download the VAT-compliant receipt.",
    bodyAr: "تم استلام دفعتك بقيمة 1٬050 د.إ. اضغط لتنزيل الإيصال المتوافق مع ضريبة القيمة المضافة.",
    href: "/portal/applications/APP-2026-00042/payment/receipt",
    isRead: false,
    createdAt: new Date(now - 30 * HOUR),
  },
  {
    id: "ntf-004",
    category: "Renewal",
    title: "Renewal opens in 60 days",
    titleAr: "يفتح التجديد بعد 60 يوماً",
    body: "Your Trainer licence LP-2025-00007781 expires on 14 Sep 2027. Renew early to stay active.",
    bodyAr: "تنتهي رخصة المدرب LP-2025-00007781 بتاريخ 14 سبتمبر 2027. جدّد مبكراً للبقاء نشطاً.",
    href: "/portal/applications/APP-2025-00891/renew",
    isRead: false,
    createdAt: new Date(now - 2 * 24 * HOUR),
  },
  {
    id: "ntf-005",
    category: "Application",
    title: "Application APP-2025-00891 approved",
    titleAr: "تمت الموافقة على الطلب APP-2025-00891",
    body: "Congratulations — your Trainer licence has been approved. Download your certificate now.",
    bodyAr: "تهانينا — تمت الموافقة على رخصة المدرب. يمكنك تنزيل الشهادة الآن.",
    href: "/portal/certificate/APP-2025-00891",
    isRead: true,
    createdAt: new Date(now - 3 * 24 * HOUR),
  },
  {
    id: "ntf-006",
    category: "System",
    title: "New Privacy Policy version v2.4 effective",
    titleAr: "السياسة الجديدة للخصوصية v2.4 سارية",
    body: "We've updated our Privacy Policy. Please review the changes the next time you sign in.",
    bodyAr: "حدّثنا سياسة الخصوصية. يُرجى مراجعة التغييرات عند تسجيل الدخول التالي.",
    href: "/privacy",
    isRead: true,
    createdAt: new Date(now - 5 * 24 * HOUR),
  },
  {
    id: "ntf-007",
    category: "Payment",
    title: "Refund request received",
    titleAr: "تم استلام طلب استرداد",
    body: "Your refund request for APP-2024-00541 is under finance review. Expect an update within 5 business days.",
    bodyAr: "طلب استرداد APP-2024-00541 قيد المراجعة المالية. يُتوقع التحديث خلال 5 أيام عمل.",
    href: "/portal/applications/APP-2024-00541",
    isRead: true,
    createdAt: new Date(now - 7 * 24 * HOUR),
  },
  {
    id: "ntf-008",
    category: "Renewal",
    title: "Licence LP-2024-00005120 expired",
    titleAr: "انتهت الرخصة LP-2024-00005120",
    body: "Your Teacher licence has expired. Submit a renewal within the 30-day grace period to avoid re-application.",
    bodyAr: "انتهت رخصة المعلم. أرسل طلب تجديد خلال فترة السماح (30 يوماً) لتجنّب إعادة التقديم.",
    href: "/portal/applications/APP-2024-00541/renew",
    isRead: true,
    createdAt: new Date(now - 9 * 24 * HOUR),
  },
  {
    id: "ntf-009",
    category: "Application",
    title: "Document re-upload received",
    titleAr: "تم استلام إعادة رفع الوثيقة",
    body: "Thank you — your updated Master's degree certificate has been received and shared with your assessor.",
    bodyAr: "شكراً — تم استلام شهادة الماجستير المحدّثة ومشاركتها مع المقيّم.",
    href: "/portal/applications/APP-2026-00103",
    isRead: true,
    createdAt: new Date(now - 11 * 24 * HOUR),
  },
  {
    id: "ntf-010",
    category: "System",
    title: "Scheduled maintenance: Sat 27 Apr, 02:00–04:00 GST",
    titleAr: "صيانة مجدولة: السبت 27 أبريل 02:00–04:00 بتوقيت الخليج",
    body: "The portal will be briefly unavailable for security updates. No action required.",
    bodyAr: "ستكون البوابة غير متاحة بشكل مؤقت لإجراء تحديثات أمنية. لا يلزم اتخاذ أي إجراء.",
    href: "/",
    isRead: true,
    createdAt: new Date(now - 14 * 24 * HOUR),
  },
];

// ===== Notification template + delivery log mock data =====

export type Channel = "Email" | "SMS" | "InApp";
export type DeliveryStatus = "Delivered" | "Queued" | "Failed" | "Bounced" | "Opened";

export interface NotificationTemplate {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  channels: Channel[];
  subjectEn: string;
  subjectAr: string;
  bodyEn: string;
  bodyAr: string;
  smsEn: string;
  smsAr: string;
  mergeTags: string[];
  updatedAt: Date;
}

export const mockTemplates: NotificationTemplate[] = [
  {
    id: "tpl-001",
    code: "APPLICATION_SUBMITTED",
    nameEn: "Application Submitted",
    nameAr: "تم تقديم الطلب",
    channels: ["Email", "SMS", "InApp"],
    subjectEn: "Your application {{applicationId}} has been received",
    subjectAr: "تم استلام طلبك {{applicationId}}",
    bodyEn:
      "Dear {{applicantName}},\n\nThank you for submitting your application {{applicationId}} for the {{licenceCategory}} licence. Your application is now in the review queue and a decision is expected within 5 business days.\n\nYou can track progress in your dashboard.",
    bodyAr:
      "عزيزي/عزيزتي {{applicantName}}،\n\nشكراً لتقديمك الطلب {{applicationId}} للحصول على رخصة {{licenceCategory}}. طلبك الآن في قائمة المراجعة ويُتوقع صدور القرار خلال 5 أيام عمل.\n\nيمكنك متابعة الحالة من لوحة التحكم.",
    smsEn: "ADVETI: Your application {{applicationId}} is received. Decision in ~5 business days.",
    smsAr: "أدفيتي: تم استلام طلبك {{applicationId}}. القرار خلال 5 أيام عمل تقريباً.",
    mergeTags: ["{{applicantName}}", "{{applicationId}}", "{{licenceCategory}}"],
    updatedAt: new Date(now - 4 * 24 * HOUR),
  },
  {
    id: "tpl-002",
    code: "PAYMENT_RECEIVED",
    nameEn: "Payment Received",
    nameAr: "تم استلام الدفعة",
    channels: ["Email", "InApp"],
    subjectEn: "Payment receipt {{receiptNumber}}",
    subjectAr: "إيصال الدفع {{receiptNumber}}",
    bodyEn:
      "Dear {{applicantName}},\n\nWe have received your payment of AED {{amount}} (incl. 5% VAT) for application {{applicationId}}.\n\nReceipt number: {{receiptNumber}}\nDate: {{paymentDate}}\n\nA VAT-compliant tax invoice is attached.",
    bodyAr:
      "عزيزي/عزيزتي {{applicantName}}،\n\nاستلمنا دفعتك البالغة {{amount}} د.إ (شاملة 5٪ ضريبة القيمة المضافة) للطلب {{applicationId}}.\n\nرقم الإيصال: {{receiptNumber}}\nالتاريخ: {{paymentDate}}\n\nمرفق فاتورة ضريبية متوافقة.",
    smsEn: "ADVETI: Payment of AED {{amount}} received. Receipt {{receiptNumber}}.",
    smsAr: "أدفيتي: استلمنا دفعة {{amount}} د.إ. الإيصال {{receiptNumber}}.",
    mergeTags: [
      "{{applicantName}}",
      "{{applicationId}}",
      "{{amount}}",
      "{{receiptNumber}}",
      "{{paymentDate}}",
    ],
    updatedAt: new Date(now - 7 * 24 * HOUR),
  },
  {
    id: "tpl-003",
    code: "RFI_REQUESTED",
    nameEn: "Request for Information",
    nameAr: "طلب معلومات إضافية",
    channels: ["Email", "SMS", "InApp"],
    subjectEn: "Action required on application {{applicationId}}",
    subjectAr: "إجراء مطلوب على الطلب {{applicationId}}",
    bodyEn:
      "Dear {{applicantName}},\n\nThe assessor reviewing your application {{applicationId}} has requested the following:\n\n{{rfiMessage}}\n\nPlease respond by {{rfiDeadline}}. Failure to respond may delay your decision.",
    bodyAr:
      "عزيزي/عزيزتي {{applicantName}}،\n\nطلب المقيّم لطلبك {{applicationId}} ما يلي:\n\n{{rfiMessage}}\n\nيُرجى الرد قبل {{rfiDeadline}}. عدم الرد قد يؤخّر القرار.",
    smsEn: "ADVETI: Info needed for {{applicationId}}. Respond by {{rfiDeadline}}.",
    smsAr: "أدفيتي: معلومات مطلوبة للطلب {{applicationId}}. الرد قبل {{rfiDeadline}}.",
    mergeTags: ["{{applicantName}}", "{{applicationId}}", "{{rfiMessage}}", "{{rfiDeadline}}"],
    updatedAt: new Date(now - 2 * 24 * HOUR),
  },
  {
    id: "tpl-004",
    code: "LICENCE_APPROVED",
    nameEn: "Licence Approved",
    nameAr: "تمت الموافقة على الرخصة",
    channels: ["Email", "SMS", "InApp"],
    subjectEn: "Congratulations — your licence has been issued",
    subjectAr: "تهانينا — تم إصدار رخصتك",
    bodyEn:
      "Dear {{applicantName}},\n\nYour {{licenceCategory}} licence has been approved.\n\nLicence number: {{licenceNumber}}\nValid: {{validFrom}} – {{validTo}}\n\nDownload your certificate from the portal.",
    bodyAr:
      "عزيزي/عزيزتي {{applicantName}}،\n\nتمت الموافقة على رخصة {{licenceCategory}}.\n\nرقم الرخصة: {{licenceNumber}}\nالصلاحية: {{validFrom}} – {{validTo}}\n\nنزّل الشهادة من البوابة.",
    smsEn: "ADVETI: Licence {{licenceNumber}} approved. Download from portal.",
    smsAr: "أدفيتي: تمت الموافقة على الرخصة {{licenceNumber}}. التنزيل من البوابة.",
    mergeTags: [
      "{{applicantName}}",
      "{{licenceCategory}}",
      "{{licenceNumber}}",
      "{{validFrom}}",
      "{{validTo}}",
    ],
    updatedAt: new Date(now - 10 * 24 * HOUR),
  },
  {
    id: "tpl-005",
    code: "RENEWAL_REMINDER",
    nameEn: "Renewal Reminder",
    nameAr: "تذكير بالتجديد",
    channels: ["Email", "SMS", "InApp"],
    subjectEn: "Your licence expires in {{daysToExpiry}} days",
    subjectAr: "تنتهي رخصتك خلال {{daysToExpiry}} يوماً",
    bodyEn:
      "Dear {{applicantName}},\n\nYour {{licenceCategory}} licence {{licenceNumber}} expires on {{expiryDate}}. Renew now to avoid service interruption.",
    bodyAr:
      "عزيزي/عزيزتي {{applicantName}}،\n\nتنتهي رخصة {{licenceCategory}} رقم {{licenceNumber}} بتاريخ {{expiryDate}}. جدّد الآن لتجنّب توقّف الخدمة.",
    smsEn: "ADVETI: Renewal due for {{licenceNumber}} on {{expiryDate}}.",
    smsAr: "أدفيتي: تجديد {{licenceNumber}} مستحق بتاريخ {{expiryDate}}.",
    mergeTags: [
      "{{applicantName}}",
      "{{licenceCategory}}",
      "{{licenceNumber}}",
      "{{expiryDate}}",
      "{{daysToExpiry}}",
    ],
    updatedAt: new Date(now - 30 * 24 * HOUR),
  },
];

export interface DeliveryLogEntry {
  id: string;
  templateId: string;
  sentAt: Date;
  recipient: string;
  channel: Channel;
  status: DeliveryStatus;
  attempts: number;
  error?: string;
}

const RECIPIENTS = [
  "layla.hassan@example.ae",
  "+971 50 123 4567",
  "ahmed.alkaabi@example.ae",
  "+971 55 987 6543",
  "fatima.almazrouei@example.ae",
  "khalid.alhammadi@example.ae",
  "+971 52 444 1212",
  "noura.alshamsi@example.ae",
];

const ERRORS: Record<DeliveryStatus, string | undefined> = {
  Delivered: undefined,
  Queued: undefined,
  Opened: undefined,
  Failed: "SMTP 550 — recipient mailbox full",
  Bounced: "Hard bounce — invalid recipient address",
};

const STATUS_POOL: DeliveryStatus[] = [
  "Delivered",
  "Delivered",
  "Delivered",
  "Opened",
  "Opened",
  "Queued",
  "Failed",
  "Bounced",
];

const CHANNEL_POOL: Channel[] = ["Email", "Email", "Email", "SMS", "SMS", "InApp"];

export const mockDeliveryLog: DeliveryLogEntry[] = mockTemplates.flatMap(
  (tpl, tIdx) =>
    Array.from({ length: 12 }).map((_, i) => {
      const status = STATUS_POOL[(i + tIdx) % STATUS_POOL.length];
      const channel = CHANNEL_POOL[(i + tIdx * 2) % CHANNEL_POOL.length];
      const recipient =
        channel === "SMS"
          ? RECIPIENTS.filter((r) => r.startsWith("+"))[
              i % RECIPIENTS.filter((r) => r.startsWith("+")).length
            ]
          : RECIPIENTS.filter((r) => r.includes("@"))[
              i % RECIPIENTS.filter((r) => r.includes("@")).length
            ];
      return {
        id: `${tpl.id}-log-${i}`,
        templateId: tpl.id,
        sentAt: new Date(now - (i * 6 + tIdx * 2) * HOUR),
        recipient,
        channel,
        status,
        attempts: status === "Failed" ? 3 : status === "Queued" ? 1 : 1,
        error: ERRORS[status],
      };
    }),
);

// ===== Helpers =====

export const formatRelativeTime = (date: Date, isAr: boolean): string => {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / (1000 * 60));
  const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return isAr ? "الآن" : "just now";
  if (diffMin < 60) {
    return isAr ? `منذ ${diffMin} دقيقة` : `${diffMin}m ago`;
  }
  if (diffHrs < 24) {
    return isAr ? `منذ ${diffHrs} ساعة` : `${diffHrs}h ago`;
  }
  if (diffDays < 7) {
    return isAr ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  }
  return date.toLocaleDateString(isAr ? "ar-AE" : "en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const groupNotificationsByDate = (
  items: Notification[],
  isAr: boolean,
): Array<{ key: string; label: string; items: Notification[] }> => {
  const today: Notification[] = [];
  const week: Notification[] = [];
  const earlier: Notification[] = [];
  const dayMs = 24 * 60 * 60 * 1000;
  items.forEach((n) => {
    const age = Date.now() - n.createdAt.getTime();
    if (age < dayMs) today.push(n);
    else if (age < 7 * dayMs) week.push(n);
    else earlier.push(n);
  });
  return [
    { key: "today", label: isAr ? "اليوم" : "Today", items: today },
    { key: "week", label: isAr ? "هذا الأسبوع" : "This week", items: week },
    { key: "earlier", label: isAr ? "سابقاً" : "Earlier", items: earlier },
  ].filter((g) => g.items.length > 0);
};
