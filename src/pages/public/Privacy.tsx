import * as React from "react";
import PolicyDocument, { PolicySection } from "@/components/public/PolicyDocument";

const sections: PolicySection[] = [
  {
    id: "introduction",
    titleEn: "Introduction",
    titleAr: "مقدمة",
    bodyEn: [
      "ADVETI ('we', 'us', 'our') is the official accreditation authority for educators and trainers in the Emirate of Abu Dhabi, operating under the Abu Dhabi Department of Education and Knowledge.",
      "This Privacy Policy explains how we collect, use, share and protect personal data processed through the ADVETI Professional Licensing Platform in accordance with UAE Federal Decree-Law No. 45 of 2021 (PDPL).",
    ],
    bodyAr: [
      "أدفيتي (\"نحن\") هي الجهة الرسمية لاعتماد المعلمين والمدربين في إمارة أبوظبي، وتعمل تحت مظلة دائرة التعليم والمعرفة بأبوظبي.",
      "تشرح سياسة الخصوصية هذه كيفية جمع البيانات الشخصية واستخدامها ومشاركتها وحمايتها عبر منصة الترخيص المهني وفقاً للمرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية.",
    ],
  },
  {
    id: "data-collected",
    titleEn: "Data we collect",
    titleAr: "البيانات التي نجمعها",
    bodyEn: [
      "Identity data: full name, Emirates ID number, nationality, date of birth, contact details.",
      "Professional data: qualifications, experience, CPD declarations, supporting documents.",
      "Technical data: IP address, device identifiers, browser type, audit logs.",
    ],
    bodyAr: [
      "بيانات الهوية: الاسم الكامل، رقم الهوية الإماراتية، الجنسية، تاريخ الميلاد، بيانات التواصل.",
      "البيانات المهنية: المؤهلات والخبرات وإقرارات التطوير المهني والوثائق الداعمة.",
      "البيانات التقنية: عنوان IP، معرّفات الجهاز، نوع المتصفح، سجلات التدقيق.",
    ],
  },
  {
    id: "lawful-basis",
    titleEn: "Lawful basis for processing",
    titleAr: "الأساس القانوني للمعالجة",
    bodyEn: [
      "We process personal data on the basis of (a) the performance of a public-interest task, (b) compliance with a legal obligation, and (c) explicit consent for optional services such as marketing communications.",
    ],
    bodyAr: [
      "نعالج البيانات الشخصية استناداً إلى (أ) أداء مهمة في المصلحة العامة، (ب) الامتثال لالتزام قانوني، (ج) الموافقة الصريحة للخدمات الاختيارية كالاتصالات التسويقية.",
    ],
  },
  {
    id: "your-rights",
    titleEn: "Your rights",
    titleAr: "حقوقك",
    bodyEn: [
      "You have the right to access, rectify, erase, restrict and port your personal data, and to withdraw consent at any time.",
      "Submit a Data Subject Request via the portal or email dpo@adveti.ae. We respond within 30 days.",
    ],
    bodyAr: [
      "لك الحق في الوصول إلى بياناتك الشخصية وتصحيحها ومحوها وتقييد معالجتها ونقلها، وسحب الموافقة في أي وقت.",
      "يمكنك تقديم طلب صاحب بيانات عبر المنصة أو البريد dpo@adveti.ae، ونرد خلال 30 يوماً.",
    ],
  },
  {
    id: "retention",
    titleEn: "Data retention",
    titleAr: "الاحتفاظ بالبيانات",
    bodyEn: [
      "Application records and licence data are retained for 10 years after the licence's final expiry, in line with audit and regulatory requirements.",
    ],
    bodyAr: [
      "تُحفظ سجلات الطلبات وبيانات الترخيص لمدة 10 سنوات بعد انتهاء آخر صلاحية للترخيص، وذلك تماشياً مع متطلبات التدقيق والامتثال.",
    ],
  },
  {
    id: "contact-dpo",
    titleEn: "Contact our Data Protection Officer",
    titleAr: "التواصل مع مسؤول حماية البيانات",
    bodyEn: ["Email: dpo@adveti.ae | Phone: +971 2 800 0800"],
    bodyAr: ["البريد: dpo@adveti.ae | الهاتف: +971 2 800 0800"],
  },
];

const Privacy: React.FC = () => (
  <PolicyDocument
    eyebrowEn="Legal"
    eyebrowAr="قانوني"
    titleEn="Privacy Policy"
    titleAr="سياسة الخصوصية"
    subtitleEn="How ADVETI collects, uses and protects your personal data — fully compliant with UAE PDPL."
    subtitleAr="كيف تجمع أدفيتي بياناتك الشخصية وتستخدمها وتحميها — بتوافق كامل مع قانون حماية البيانات الإماراتي."
    effectiveDate="01 Jan 2026"
    pdfHref="#"
    sections={sections}
  />
);

export default Privacy;
