import * as React from "react";
import PolicyDocument, { PolicySection } from "@/components/public/PolicyDocument";

const sections: PolicySection[] = [
  {
    id: "commitment",
    titleEn: "Our commitment",
    titleAr: "التزامنا",
    bodyEn: [
      "ADVETI is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.",
    ],
    bodyAr: [
      "تلتزم أدفيتي بضمان إمكانية الوصول الرقمي للأشخاص ذوي الإعاقة، ونعمل باستمرار على تحسين تجربة المستخدم للجميع وتطبيق معايير إمكانية الوصول ذات الصلة.",
    ],
  },
  {
    id: "standards",
    titleEn: "Conformance",
    titleAr: "مستوى المطابقة",
    bodyEn: [
      "The ADVETI platform aims to conform with the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.",
    ],
    bodyAr: [
      "تهدف منصة أدفيتي إلى المطابقة مع إرشادات الوصول إلى محتوى الويب (WCAG) 2.2 المستوى AA.",
    ],
  },
  {
    id: "feedback",
    titleEn: "Feedback",
    titleAr: "التغذية الراجعة",
    bodyEn: [
      "If you encounter accessibility barriers, contact accessibility@adveti.ae. We aim to respond within 5 business days.",
    ],
    bodyAr: [
      "إذا واجهت أي عوائق في إمكانية الوصول، تواصل عبر accessibility@adveti.ae. نسعى للرد خلال 5 أيام عمل.",
    ],
  },
];

const Accessibility: React.FC = () => (
  <PolicyDocument
    eyebrowEn="Legal"
    eyebrowAr="قانوني"
    titleEn="Accessibility Statement"
    titleAr="بيان إمكانية الوصول"
    subtitleEn="ADVETI's commitment to a digitally accessible platform for all users."
    subtitleAr="التزام أدفيتي بمنصة رقمية يصل إليها جميع المستخدمين."
    effectiveDate="01 Jan 2026"
    pdfHref="#"
    sections={sections}
  />
);

export default Accessibility;
