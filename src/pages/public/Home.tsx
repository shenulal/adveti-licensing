import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, FileCheck, Award } from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";

const Home: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  return (
    <div className="space-y-12">
      <section className="rounded-xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-ink-inverse p-10 md:p-14 shadow-lg relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl"
        />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-3">
            <span className="h-px w-8 bg-gold-400" />
            {isAr ? "حكومة أبوظبي" : "Government of Abu Dhabi"}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {isAr
              ? "منصة ترخيص المعلمين والمدربين المهنيين"
              : "Professional Educator & Trainer Licensing Platform"}
          </h1>
          <p className="mt-4 text-ink-inverse/80 text-pretty max-w-2xl">
            {isAr
              ? "تقديم وتجديد وإدارة الاعتماد المهني عبر هيئة الاعتماد الرسمية في أبوظبي."
              : "Apply, renew, and manage your professional credentials through Abu Dhabi's official accreditation authority."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/auth/login">
              <Button
                variant="gold"
                size="lg"
                iconEnd={<ChevronRight size={16} className="rtl-flip" />}
              >
                {isAr ? "ابدأ التقديم" : "Start Application"}
              </Button>
            </Link>
            <Link to="/verify">
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent text-ink-inverse border-ink-inverse/30 hover:bg-ink-inverse/10"
              >
                {isAr ? "التحقق من ترخيص" : "Verify a Licence"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        {[
          {
            icon: <FileCheck size={20} />,
            en: "Apply online",
            ar: "تقديم إلكتروني",
            desc_en: "Submit your credentials in a single multi-step wizard.",
            desc_ar: "قدّم مؤهلاتك من خلال نموذج متعدد الخطوات.",
          },
          {
            icon: <ShieldCheck size={20} />,
            en: "Trusted assessment",
            ar: "تقييم موثوق",
            desc_en: "Decisions made by accredited assessors against published rubrics.",
            desc_ar: "قرارات صادرة عن مقيّمين معتمدين وفق معايير منشورة.",
          },
          {
            icon: <Award size={20} />,
            en: "Verifiable licence",
            ar: "ترخيص قابل للتحقق",
            desc_en: "QR-verifiable credential recognised across the UAE.",
            desc_ar: "ترخيص يمكن التحقق منه عبر رمز QR ومعتمد على مستوى الدولة.",
          },
        ].map((f) => (
          <Card key={f.en} variant="government">
            <CardContent className="pt-6">
              <span className="h-10 w-10 rounded-md bg-gold-100 text-gold-600 inline-flex items-center justify-center mb-3">
                {f.icon}
              </span>
              <h3 className="text-base font-semibold text-ink-primary">
                {isAr ? f.ar : f.en}
              </h3>
              <p className="mt-1 text-sm text-ink-secondary">
                {isAr ? f.desc_ar : f.desc_en}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Home;