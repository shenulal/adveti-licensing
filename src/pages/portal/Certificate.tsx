import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Award, ShieldCheck } from "lucide-react";
import { BilingualPDFPreview, Button, Ltr } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatDate } from "@/lib/format";
import { getApplicationById, mockApplicantProfile } from "@/lib/mockApplicant";

const Certificate: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { id } = useParams();
  const app = getApplicationById(id ?? "");
  const certNo = app.certificateNumber ?? "LP-2026-00012345";
  const validTo = app.validTo ? formatDate(app.validTo, "en") : "—";
  const validToAr = app.validTo ? formatDate(app.validTo, "ar") : "—";

  const bodyEn = (
    <div className="space-y-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600 font-semibold">
        Professional Licence Certificate
      </p>
      <p>This is to certify that</p>
      <h2 className="text-xl font-bold text-navy-900">
        {mockApplicantProfile.fullNameEn}
      </h2>
      <p>
        has successfully met the assessment criteria established by the Abu Dhabi
        Professional Licensing &amp; Assessment Authority (ADVETI) and is hereby
        granted a professional licence in the category of:
      </p>
      <p className="font-semibold text-navy-900">{app.licenceCategory}</p>
      <p>
        This licence remains valid until <strong>{validTo}</strong> and may be
        verified online using the QR code or the reference number printed on
        this certificate.
      </p>
      <div className="pt-2">
        <p className="text-[11px] text-ink-secondary">
          Issued under PDPL · Federal Decree-Law No. 45 of 2021
        </p>
      </div>
    </div>
  );

  const bodyAr = (
    <div className="space-y-4">
      <p className="text-[11px] uppercase tracking-[0.15em] text-gold-600 font-semibold">
        شهادة الترخيص المهني
      </p>
      <p>تشهد هذه الوثيقة بأن</p>
      <h2 className="text-xl font-bold text-navy-900">
        {mockApplicantProfile.fullNameAr}
      </h2>
      <p>
        قد استوفى متطلبات التقييم المعتمدة لدى هيئة الترخيص والتقييم المهني في
        أبوظبي (أدفيتي) ومُنح بموجب ذلك ترخيصًا مهنيًا في فئة:
      </p>
      <p className="font-semibold text-navy-900">
        {app.licenceCategory === "Teacher" ? "معلّم" : app.licenceCategory}
      </p>
      <p>
        يبقى هذا الترخيص ساري المفعول حتى <strong>{validToAr}</strong> ويمكن
        التحقق منه عبر الإنترنت باستخدام رمز الاستجابة السريعة أو رقم المرجع
        المطبوع على الشهادة.
      </p>
      <div className="pt-2">
        <p className="text-[11px] text-ink-secondary">
          صادرة بموجب قانون حماية البيانات الإماراتي · مرسوم اتحادي رقم 45 لعام 2021
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-gold-600 uppercase tracking-[0.2em]">
            <Award size={14} />
            {isAr ? "شهادة معتمدة" : "Certified document"}
          </p>
          <h1 className="text-2xl font-bold text-ink-primary mt-1">
            {isAr ? "معاينة الشهادة" : "Certificate preview"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr
              ? "نسخة ثنائية اللغة جاهزة للطباعة والتحقق العام."
              : "Bilingual, print-ready, publicly verifiable."}
          </p>
        </div>
        <Link to={`/verify?token=${certNo}`}>
          <Button variant="secondary" size="sm" iconStart={<ShieldCheck size={14} />}>
            {isAr ? "صفحة التحقق" : "Verify online"}
          </Button>
        </Link>
      </header>

      <BilingualPDFPreview
        titleEn="Professional Licence Certificate"
        titleAr="شهادة الترخيص المهني"
        referenceNumber={certNo}
        bodyEn={bodyEn}
        bodyAr={bodyAr}
        filename={`adveti-certificate-${certNo}.pdf`}
      />

      <p className="text-xs text-ink-secondary text-center">
        {isAr ? "الرقم المرجعي: " : "Reference: "}
        <Ltr className="font-mono">{certNo}</Ltr>
      </p>
    </div>
  );
};

export default Certificate;
