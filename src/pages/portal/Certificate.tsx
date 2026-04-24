import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Award, Download, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatDate } from "@/lib/format";
import { getApplicationById, mockApplicantProfile } from "@/lib/mockApplicant";

const Certificate: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { id } = useParams();
  const app = getApplicationById(id ?? "");

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Card variant="elevated" className="overflow-hidden">
        <div className="bg-gradient-to-br from-navy-900 to-navy-700 text-ink-inverse p-8 text-center">
          <Award size={36} className="mx-auto text-gold-400 mb-3" />
          <p className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            {isAr ? "شهادة الترخيص المهني" : "Professional Licence Certificate"}
          </p>
          <h1 className="text-2xl font-bold mt-2">
            {isAr ? mockApplicantProfile.fullNameAr : mockApplicantProfile.fullNameEn}
          </h1>
          <p className="text-sm text-ink-inverse/70 mt-1">
            {isAr ? `ترخيص ${app.licenceCategory === "Teacher" ? "معلم" : app.licenceCategory}` : `${app.licenceCategory} Licence`}
          </p>
          <p className="font-mono text-sm text-gold-400 mt-3" dir="ltr">
            {app.certificateNumber ?? "LP-2026-00012345"}
          </p>
        </div>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-ink-secondary">
            {isAr ? "ساري حتى" : "Valid until"}{" "}
            <span className="font-semibold text-ink-primary">
              {app.validTo ? formatDate(app.validTo, lang) : "—"}
            </span>
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Button variant="gold" iconStart={<Download size={16} />}>
              {isAr ? "تنزيل الشهادة (PDF)" : "Download certificate (PDF)"}
            </Button>
            <Link to={`/verify?token=${app.certificateNumber}`}>
              <Button variant="secondary" iconStart={<ShieldCheck size={16} />}>
                {isAr ? "صفحة التحقق العام" : "Public verification page"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificate;
