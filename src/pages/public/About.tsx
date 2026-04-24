import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Building2, Users, ScrollText, GraduationCap } from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import PageHero from "@/components/public/PageHero";

const About: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const sections = [
    {
      icon: <ScrollText size={20} />,
      titleEn: "What is the licence?",
      titleAr: "ما هو الترخيص؟",
      bodyEn:
        "The ADVETI Professional Licence is the official credential authorising individuals to practise as teachers, counsellors or trainers within the Emirate of Abu Dhabi. It validates qualifications, professional experience, and ongoing development against published standards.",
      bodyAr:
        "الترخيص المهني من أدفيتي هو الاعتماد الرسمي الذي يخوّل الأفراد ممارسة مهنة التعليم أو الإرشاد أو التدريب في إمارة أبوظبي، ويُثبت المؤهلات والخبرات المهنية والتطوير المستمر وفق معايير منشورة.",
    },
    {
      icon: <Building2 size={20} />,
      titleEn: "Who regulates it?",
      titleAr: "من الجهة المنظِّمة؟",
      bodyEn:
        "ADVETI operates under the Abu Dhabi Department of Education and Knowledge as the official accreditation authority. All licences are issued, suspended and revoked under publicly available regulations.",
      bodyAr:
        "تعمل أدفيتي تحت مظلة دائرة التعليم والمعرفة بأبوظبي بصفتها الجهة الرسمية للاعتماد، وتُصدر التراخيص وتعلّقها وتُلغيها وفق لوائح منشورة.",
    },
    {
      icon: <Users size={20} />,
      titleEn: "Who needs a licence?",
      titleAr: "من يحتاج إلى ترخيص؟",
      bodyEn:
        "Anyone delivering classroom instruction, professional counselling, or vocational training within Abu Dhabi must hold a valid ADVETI licence in the relevant category.",
      bodyAr:
        "كل من يقدّم التدريس في الفصول الدراسية، أو الإرشاد المهني، أو التدريب المهني داخل إمارة أبوظبي ملزم بالحصول على ترخيص أدفيتي ساري المفعول في الفئة المعنية.",
    },
    {
      icon: <GraduationCap size={20} />,
      titleEn: "Licence categories",
      titleAr: "فئات الترخيص",
      bodyEn:
        "Three core categories are issued: Teacher (K–12 and adult education), Counsellor (school and career counselling), and Trainer (vocational and corporate training). Each has its own qualification, experience and CPD requirements.",
      bodyAr:
        "تُصدَر ثلاث فئات أساسية: المعلم (للتعليم العام وتعليم الكبار)، والمرشد (الإرشاد المدرسي والمهني)، والمدرّب (التدريب المهني والمؤسسي)، ولكل فئة متطلبات مؤهلات وخبرة وتطوير مهني.",
    },
  ];

  return (
    <div className="space-y-12">
      <PageHero
        eyebrowEn="About"
        eyebrowAr="نبذة"
        titleEn="About the ADVETI Professional Licence"
        titleAr="عن الترخيص المهني من أدفيتي"
        subtitleEn="Understand the licence, the regulator, and the categories that govern professional educational practice in Abu Dhabi."
        subtitleAr="تعرّف على الترخيص والجهة المنظِّمة والفئات التي تحكم الممارسة التعليمية المهنية في أبوظبي."
        isAr={isAr}
      />

      {/* Pull quote */}
      <section className="max-w-3xl mx-auto px-2">
        <blockquote className="border-s-4 border-gold-500 ps-6 py-2">
          <p className="text-xl md:text-2xl font-semibold text-ink-primary leading-snug text-balance">
            {isAr
              ? "“الترخيص المهني هو ضمان الجودة بين المربّي والمتعلّم.”"
              : "“Professional licensing is the quality guarantee between an educator and a learner.”"}
          </p>
          <footer className="mt-3 text-sm text-ink-secondary">
            — ADVETI Charter, 2026
          </footer>
        </blockquote>
      </section>

      {/* Editorial sections */}
      <section className="grid gap-6 md:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.titleEn} variant="government">
            <CardContent className="pt-6">
              <span className="h-10 w-10 rounded-md bg-gold-100 text-gold-600 inline-flex items-center justify-center mb-4">
                {s.icon}
              </span>
              <h2 className="text-lg font-semibold text-ink-primary">
                {isAr ? s.titleAr : s.titleEn}
              </h2>
              <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
                {isAr ? s.bodyAr : s.bodyEn}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-xl bg-surface-100 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <h3 className="text-lg font-semibold text-ink-primary">
            {isAr ? "هل تستوفي المتطلبات؟" : "Meet the requirements?"}
          </h3>
          <p className="mt-1 text-sm text-ink-secondary">
            {isAr
              ? "راجع شروط الأهلية لكل فئة قبل تقديم الطلب."
              : "Review eligibility for each category before applying."}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/eligibility">
            <Button variant="secondary">
              {isAr ? "شروط الأهلية" : "Eligibility"}
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button
              variant="gold"
              iconEnd={<ChevronRight size={16} className="rtl-flip" />}
            >
              {isAr ? "قدّم الآن" : "Apply Now"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
