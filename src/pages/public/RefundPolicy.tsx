import * as React from "react";
import PolicyDocument, { PolicySection } from "@/components/public/PolicyDocument";

const sections: PolicySection[] = [
  {
    id: "scope",
    titleEn: "Scope",
    titleAr: "النطاق",
    bodyEn: [
      "This Refund Policy applies to all application and renewal fees paid through the ADVETI Professional Licensing Platform.",
    ],
    bodyAr: [
      "تسري هذه السياسة على جميع رسوم تقديم الطلبات والتجديد المدفوعة عبر منصة أدفيتي للترخيص المهني.",
    ],
  },
  {
    id: "eligibility",
    titleEn: "Refund eligibility",
    titleAr: "أهلية الاسترداد",
    bodyEn: [
      "Application fees are refundable in full within 14 calendar days of payment, provided the application has not yet been assigned to an assessor.",
      "Once an application has been assigned for review, fees become non-refundable.",
    ],
    bodyAr: [
      "تُسترد رسوم الطلب بالكامل خلال 14 يوماً تقويمياً من تاريخ الدفع، شريطة عدم إحالة الطلب إلى مقيّم بعد.",
      "بعد إحالة الطلب للمراجعة، تصبح الرسوم غير قابلة للاسترداد.",
    ],
  },
  {
    id: "process",
    titleEn: "Refund process",
    titleAr: "إجراءات الاسترداد",
    bodyEn: [
      "Submit a refund request from your portal account. Refunds are reviewed by the Finance Officer and, where applicable, the Senior Assessor.",
      "Approved refunds are processed to the original payment method within 7–10 business days.",
    ],
    bodyAr: [
      "قدّم طلب الاسترداد من حسابك على المنصة. تُراجَع المبالغ المستردة من قِبل مسؤول المالية وعند الاقتضاء كبير المقيّمين.",
      "تتم معالجة المبالغ المعتمدة وإعادتها إلى وسيلة الدفع الأصلية خلال 7 إلى 10 أيام عمل.",
    ],
  },
  {
    id: "non-refundable",
    titleEn: "Non-refundable items",
    titleAr: "البنود غير القابلة للاسترداد",
    bodyEn: [
      "VAT amounts already remitted to the Federal Tax Authority cannot be refunded.",
      "Reissue and amendment fees are non-refundable.",
    ],
    bodyAr: [
      "لا يمكن استرداد مبالغ ضريبة القيمة المضافة التي تم توريدها للهيئة الاتحادية للضرائب.",
      "رسوم إعادة الإصدار والتعديل غير قابلة للاسترداد.",
    ],
  },
];

const RefundPolicy: React.FC = () => (
  <PolicyDocument
    eyebrowEn="Legal"
    eyebrowAr="قانوني"
    titleEn="Refund Policy"
    titleAr="سياسة الاسترداد"
    subtitleEn="When and how refunds are processed for ADVETI fees."
    subtitleAr="متى وكيف تُسترد رسوم أدفيتي."
    effectiveDate="01 Jan 2026"
    pdfHref="#"
    sections={sections}
  />
);

export default RefundPolicy;
