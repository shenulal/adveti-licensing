import * as React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ChevronRight,
  ClipboardCheck,
  FileCheck,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Stamp,
  Users,
  Wallet,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED, formatNumber } from "@/lib/format";

const Home: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const infoCards = [
    {
      icon: <GraduationCap size={22} />,
      titleEn: "Three licence categories",
      titleAr: "ثلاث فئات للترخيص",
      bodyEn: "Teacher, Counsellor and Trainer licences regulated by ADVETI.",
      bodyAr: "تراخيص المعلم والمرشد والمدرّب تحت إشراف هيئة أدفيتي.",
      linkEn: "View categories",
      linkAr: "استعراض الفئات",
      to: "/about",
    },
    {
      icon: <ClipboardCheck size={22} />,
      titleEn: "A clear three-step process",
      titleAr: "إجراءات واضحة من ثلاث خطوات",
      bodyEn: "Apply online → Independent assessor review → Receive your certificate.",
      bodyAr: "تقديم إلكتروني ← مراجعة من مقيّم مستقل ← استلام الشهادة.",
      linkEn: "How it works",
      linkAr: "كيف تعمل المنصة",
      to: "/fees",
    },
    {
      icon: <Wallet size={22} />,
      titleEn: `Fees from ${formatAED(500, lang)}`,
      titleAr: `الرسوم تبدأ من ${formatAED(500, lang)}`,
      bodyEn: "Transparent pricing with VAT included. No hidden charges.",
      bodyAr: "أسعار شفافة شاملة ضريبة القيمة المضافة، دون رسوم خفية.",
      linkEn: "View full fee schedule",
      linkAr: "جدول الرسوم الكامل",
      to: "/fees",
    },
  ];

  const features = [
    {
      icon: <ShieldCheck size={20} />,
      titleEn: "Government-grade security",
      titleAr: "أمن بمستوى حكومي",
      bodyEn: "PDPL-compliant infrastructure backed by UAE Pass identity.",
      bodyAr: "بنية متوافقة مع قانون حماية البيانات الإماراتي ومدعومة بالهوية الرقمية.",
    },
    {
      icon: <Sparkles size={20} />,
      titleEn: "Bilingual by design",
      titleAr: "ثنائية اللغة بطبيعتها",
      bodyEn: "Every page, document and certificate in Arabic and English.",
      bodyAr: "جميع الصفحات والوثائق والشهادات باللغتين العربية والإنجليزية.",
    },
    {
      icon: <Award size={20} />,
      titleEn: "Verifiable credentials",
      titleAr: "شهادات قابلة للتحقق",
      bodyEn: "Every certificate is QR-verifiable across the UAE.",
      bodyAr: "كل شهادة تحمل رمز QR قابل للتحقق على مستوى الدولة.",
    },
  ];

  const stats = [
    {
      valueEn: "3",
      valueAr: formatNumber(3, "ar"),
      labelEn: "Licence Categories",
      labelAr: "فئات الترخيص",
    },
    {
      valueEn: "2–5",
      valueAr: `${formatNumber(2, "ar")}–${formatNumber(5, "ar")}`,
      labelEn: "Business Days Review",
      labelAr: "أيام عمل للمراجعة",
    },
    {
      valueEn: "100%",
      valueAr: `${formatNumber(100, "ar")}٪`,
      labelEn: "Digital Process",
      labelAr: "إجراء رقمي بالكامل",
    },
  ];

  return (
    <div className="space-y-16 -mt-10 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-navy-900 text-ink-inverse">
        {/* Pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(60deg, currentColor 0 1px, transparent 1px 22px), repeating-linear-gradient(-60deg, currentColor 0 1px, transparent 1px 22px)",
          }}
        />
        <div
          aria-hidden
          className="absolute -end-32 -top-32 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -start-24 -bottom-24 h-80 w-80 rounded-full bg-navy-700/50 blur-3xl"
        />

        <div className="container relative grid lg:grid-cols-12 gap-10 items-center py-16 lg:py-24">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-4">
              <span className="h-px w-10 bg-gold-400" />
              {isAr ? "حكومة أبوظبي" : "Government of Abu Dhabi"}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold tracking-tight text-balance">
              {isAr
                ? "رخّص ممارستك المهنية في أبوظبي"
                : "Licence Your Professional Practice in Abu Dhabi"}
            </h1>
            <p className="mt-5 text-base md:text-lg text-ink-inverse/80 text-pretty max-w-xl">
              {isAr
                ? "الجهة الرسمية لاعتماد المعلمين والمرشدين والمدربين في إمارة أبوظبي. قدّم طلبك إلكترونياً واستلم شهادتك الرقمية القابلة للتحقق."
                : "The official accreditation authority for teachers, counsellors and trainers in Abu Dhabi. Apply online and receive your QR-verifiable digital certificate."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth/login">
                <Button
                  variant="gold"
                  size="lg"
                  iconEnd={<ChevronRight size={16} className="rtl-flip" />}
                >
                  {isAr ? "قدّم الآن" : "Apply Now"}
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-ink-inverse hover:bg-ink-inverse/10 border border-ink-inverse/20"
                >
                  {isAr ? "اعرف المزيد" : "Learn More"}
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 flex-wrap text-sm text-ink-inverse/70">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-gold-400" />
                {isAr ? "متوافق مع PDPL" : "PDPL compliant"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Stamp size={16} className="text-gold-400" />
                {isAr ? "اعتماد رسمي" : "Official accreditation"}
              </span>
            </div>
          </div>

          {/* Abstract architectural illustration (SVG, no stock) */}
          <div className="lg:col-span-5 hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ===== INFO CARDS ===== */}
      <section className="container">
        <div className="grid gap-6 md:grid-cols-3">
          {infoCards.map((c) => (
            <Card key={c.titleEn} variant="government" className="h-full">
              <CardContent className="pt-6 flex flex-col h-full">
                <span className="h-11 w-11 rounded-md bg-gold-100 text-gold-600 inline-flex items-center justify-center mb-4">
                  {c.icon}
                </span>
                <h3 className="text-lg font-semibold text-ink-primary">
                  {isAr ? c.titleAr : c.titleEn}
                </h3>
                <p className="mt-2 text-sm text-ink-secondary flex-1">
                  {isAr ? c.bodyAr : c.bodyEn}
                </p>
                <Link
                  to={c.to}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-800 hover:text-navy-900 focus-ring rounded"
                >
                  {isAr ? c.linkAr : c.linkEn}
                  <ChevronRight size={14} className="rtl-flip" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-navy-800 text-ink-inverse relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 18px)",
          }}
        />
        <div className="container relative py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.labelEn} className="text-center sm:text-start">
              <p className="text-4xl md:text-5xl font-bold text-gold-400 tracking-tight">
                {isAr ? s.valueAr : s.valueEn}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.15em] text-ink-inverse/75 font-medium">
                {isAr ? s.labelAr : s.labelEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="container">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-600 font-semibold mb-3">
            <span className="h-px w-8 bg-gold-500" />
            {isAr ? "لماذا أدفيتي" : "Why ADVETI"}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink-primary tracking-tight">
            {isAr
              ? "لماذا تحصل على ترخيصك من أدفيتي؟"
              : "Why license with ADVETI?"}
          </h2>
          <p className="mt-3 text-ink-secondary">
            {isAr
              ? "منصة موثوقة تجمع الأمن الحكومي، التقييم المستقل، وسهولة الوصول الرقمي."
              : "A trusted platform combining government-grade security, independent assessment and seamless digital access."}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.titleEn} variant="bordered" className="h-full">
              <CardContent className="pt-6">
                <span className="h-10 w-10 rounded-md bg-navy-800 text-ink-inverse inline-flex items-center justify-center mb-4">
                  {f.icon}
                </span>
                <h3 className="text-base font-semibold text-ink-primary">
                  {isAr ? f.titleAr : f.titleEn}
                </h3>
                <p className="mt-2 text-sm text-ink-secondary">
                  {isAr ? f.bodyAr : f.bodyEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="container pb-16">
        <div className="rounded-xl bg-gradient-to-r from-navy-900 to-navy-700 text-ink-inverse p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between shadow-lg relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -end-16 -bottom-16 h-48 w-48 rounded-full bg-gold-500/15 blur-3xl"
          />
          <div className="relative">
            <h3 className="text-xl md:text-2xl font-bold">
              {isAr
                ? "هل أنت مستعد لتقديم طلب الترخيص؟"
                : "Ready to apply for your licence?"}
            </h3>
            <p className="mt-2 text-ink-inverse/80 max-w-lg text-sm">
              {isAr
                ? "أنشئ حسابك أو سجّل الدخول عبر الهوية الرقمية وابدأ خلال دقائق."
                : "Create an account or sign in with UAE Pass and get started in minutes."}
            </p>
          </div>
          <div className="relative flex gap-3">
            <Link to="/eligibility">
              <Button
                variant="ghost"
                size="lg"
                className="text-ink-inverse hover:bg-ink-inverse/10 border border-ink-inverse/20"
              >
                {isAr ? "تحقق من الأهلية" : "Check eligibility"}
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button
                variant="gold"
                size="lg"
                iconEnd={<ChevronRight size={16} className="rtl-flip" />}
              >
                {isAr ? "ابدأ الآن" : "Start now"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Abstract UAE-architecture-inspired SVG illustration.
 * Navy + gold geometric silhouette — no stock photography.
 */
const HeroIllustration: React.FC = () => (
  <div className="relative">
    <svg
      viewBox="0 0 480 360"
      role="img"
      aria-label="Abu Dhabi skyline silhouette"
      className="w-full h-auto"
    >
      <defs>
        <linearGradient id="adv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--navy-700))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--navy-900))" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="adv-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--gold-500))" />
          <stop offset="100%" stopColor="hsl(var(--gold-300))" />
        </linearGradient>
      </defs>

      {/* Sky glow */}
      <rect x="0" y="0" width="480" height="360" fill="url(#adv-sky)" />

      {/* Sun / seal */}
      <circle cx="360" cy="110" r="48" fill="url(#adv-gold)" opacity="0.85" />
      <circle cx="360" cy="110" r="48" fill="none" stroke="hsl(var(--gold-300))" strokeWidth="1" opacity="0.6" />

      {/* Domed mosque silhouette */}
      <g fill="hsl(var(--navy-950))">
        <rect x="40" y="220" width="400" height="120" />
        {/* Main dome */}
        <path d="M180 220 Q240 130 300 220 Z" />
        <rect x="235" y="120" width="10" height="30" />
        {/* Small domes */}
        <path d="M120 220 Q150 180 180 220 Z" />
        <path d="M300 220 Q330 180 360 220 Z" />
        {/* Minarets */}
        <rect x="80" y="160" width="14" height="60" />
        <path d="M75 160 L101 160 L94 145 L82 145 Z" />
        <rect x="386" y="160" width="14" height="60" />
        <path d="M381 160 L407 160 L400 145 L388 145 Z" />
      </g>

      {/* Gold accent arches */}
      <g fill="none" stroke="hsl(var(--gold-500))" strokeWidth="2" opacity="0.7">
        <path d="M210 290 Q240 260 270 290" />
        <path d="M150 300 Q165 285 180 300" />
        <path d="M300 300 Q315 285 330 300" />
      </g>

      {/* Geometric Islamic-pattern accent */}
      <g
        stroke="hsl(var(--gold-400))"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
        transform="translate(60 60)"
      >
        <polygon points="0,12 12,0 24,12 12,24" />
        <polygon points="30,12 42,0 54,12 42,24" />
        <polygon points="15,32 27,20 39,32 27,44" />
      </g>

      {/* Ground line */}
      <line x1="0" y1="340" x2="480" y2="340" stroke="hsl(var(--gold-500))" strokeWidth="1" opacity="0.4" />
    </svg>

    <div className="absolute -bottom-4 start-4 inline-flex items-center gap-2 rounded-md bg-surface-0/95 backdrop-blur px-3 py-2 shadow-md">
      <Users size={16} className="text-navy-800" />
      <span className="text-xs font-medium text-ink-primary">
        Trusted by educators across the UAE
      </span>
    </div>
  </div>
);

export default Home;
