import * as React from "react";
import PolicyDocument, { PolicySection } from "@/components/public/PolicyDocument";

const sections: PolicySection[] = [
  {
    id: "acceptance",
    titleEn: "Acceptance of terms",
    titleAr: "قبول الشروط",
    bodyEn: [
      "By creating an account or using the ADVETI Professional Licensing Platform, you agree to be bound by these Terms & Conditions.",
      "If you do not agree, you must not use the platform.",
    ],
    bodyAr: [
      "بإنشاء حساب أو استخدام منصة أدفيتي للترخيص المهني، فإنك توافق على الالتزام بهذه الشروط والأحكام.",
      "إذا لم توافق، فلا يحق لك استخدام المنصة.",
    ],
  },
  {
    id: "eligibility",
    titleEn: "Eligibility & accuracy of information",
    titleAr: "الأهلية ودقة المعلومات",
    bodyEn: [
      "You confirm that all information submitted is accurate, complete and current. Misrepresentation may result in licence refusal, suspension or revocation, and may be referred to the relevant authorities.",
    ],
    bodyAr: [
      "تؤكد أن جميع المعلومات المقدّمة دقيقة وكاملة ومحدّثة. أي تحريف قد يؤدي إلى رفض الترخيص أو إيقافه أو إلغائه، وقد يُحال إلى الجهات المختصة.",
    ],
  },
  {
    id: "fees-payments",
    titleEn: "Fees and payments",
    titleAr: "الرسوم والمدفوعات",
    bodyEn: [
      "All fees are payable in AED and inclusive of 5% VAT. Refunds are governed by our Refund Policy.",
    ],
    bodyAr: [
      "جميع الرسوم مستحقة بالدرهم الإماراتي وتشمل ضريبة القيمة المضافة بنسبة 5٪. تخضع المبالغ المستردة لسياسة الاسترداد لدينا.",
    ],
  },
  {
    id: "obligations",
    titleEn: "Licence holder obligations",
    titleAr: "التزامات حامل الترخيص",
    bodyEn: [
      "Licence holders must comply with the ADVETI Code of Professional Conduct, maintain the declared CPD hours, and notify ADVETI of any change of circumstances within 30 days.",
    ],
    bodyAr: [
      "يلتزم حاملو الترخيص بمدوّنة السلوك المهني لأدفيتي، والحفاظ على ساعات التطوير المهني المُعلَنة، وإخطار أدفيتي بأي تغيير في الظروف خلال 30 يوماً.",
    ],
  },
  {
    id: "suspension",
    titleEn: "Suspension and revocation",
    titleAr: "الإيقاف والإلغاء",
    bodyEn: [
      "ADVETI may suspend or revoke a licence in cases of fraud, misconduct, or failure to comply with these Terms. The licence holder will be notified in writing and may submit a written representation within 14 days.",
    ],
    bodyAr: [
      "يحق لأدفيتي إيقاف أو إلغاء أي ترخيص في حالات الاحتيال أو سوء السلوك أو الإخلال بهذه الشروط. يُخطَر حامل الترخيص كتابياً ويجوز له تقديم رد مكتوب خلال 14 يوماً.",
    ],
  },
  {
    id: "governing-law",
    titleEn: "Governing law",
    titleAr: "القانون الواجب التطبيق",
    bodyEn: [
      "These Terms are governed by the laws of the Emirate of Abu Dhabi and the federal laws of the United Arab Emirates. Disputes shall be subject to the exclusive jurisdiction of Abu Dhabi courts.",
    ],
    bodyAr: [
      "تخضع هذه الشروط لقوانين إمارة أبوظبي والقوانين الاتحادية لدولة الإمارات. تختص محاكم أبوظبي حصرياً بالنظر في أي نزاع.",
    ],
  },
];

const Terms: React.FC = () => (
  <PolicyDocument
    eyebrowEn="Legal"
    eyebrowAr="قانوني"
    titleEn="Terms & Conditions"
    titleAr="الشروط والأحكام"
    subtitleEn="The legal agreement between you and ADVETI when using the Professional Licensing Platform."
    subtitleAr="الاتفاقية القانونية بينك وبين أدفيتي عند استخدامك منصة الترخيص المهني."
    effectiveDate="01 Jan 2026"
    pdfHref="#"
    sections={sections}
  />
);

export default Terms;
