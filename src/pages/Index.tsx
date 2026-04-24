import * as React from "react";
import {
  Alert,
  applyLang,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  getInitialLang,
  Input,
  Lang,
  LanguageToggle,
  Modal,
  Select,
  SidebarNavItem,
  SLAClock,
  Stepper,
  Table,
  Textarea,
  useToast,
} from "@/components/adveti";
import {
  Award,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react";

// ===== i18n strings =====
const t = {
  en: {
    brand: "ADVETI",
    sub: "Professional Licensing & Assessment Authority",
    nav: {
      dashboard: "Dashboard",
      applications: "Applications",
      assessments: "Assessments",
      licenses: "Licenses",
      providers: "Training Providers",
      audit: "Audit & Compliance",
      settings: "Settings",
    },
    hero: {
      eyebrow: "Government of Abu Dhabi",
      title: "Educator & Trainer Licensing Platform",
      desc: "Apply, renew, and manage your professional credentials through Abu Dhabi's official accreditation authority.",
      primary: "Start Application",
      secondary: "Track My Application",
    },
    sections: {
      overview: "Application Overview",
      submit: "Submit New Application",
      myApps: "My Applications",
      lifecycle: "Application Lifecycle",
      design: "Design System",
    },
    cards: {
      active: "Active Licenses",
      pending: "Pending Review",
      sla: "SLA Compliance",
    },
    form: {
      fullName: "Full Name",
      email: "Email Address",
      emirate: "Emirate",
      specialization: "Specialization",
      experience: "Years of Experience",
      bio: "Professional Statement",
      bioHelp: "Briefly describe your teaching philosophy and qualifications.",
      submit: "Submit for Review",
      cancel: "Cancel",
      placeholder: "Select an option",
    },
    table: {
      ref: "Reference",
      type: "Type",
      submitted: "Submitted",
      status: "Status",
      sla: "SLA",
    },
    modal: {
      title: "Confirm Submission",
      desc: "Once submitted, your application will enter the official review queue. SLA is 5 business days.",
      confirm: "Confirm & Submit",
    },
    toast: {
      success: "Application submitted successfully",
      successDesc: "Reference ADV-2025-04412 has been created.",
    },
    steps: [
      { label: "Personal Details", description: "Identity & contact" },
      { label: "Qualifications", description: "Documents & certificates" },
      { label: "Assessment", description: "Competency review" },
      { label: "Decision", description: "Approval & licence issue" },
    ],
  },
  ar: {
    brand: "أدفيتي",
    sub: "هيئة الترخيص والتقييم المهني",
    nav: {
      dashboard: "لوحة التحكم",
      applications: "الطلبات",
      assessments: "التقييمات",
      licenses: "التراخيص",
      providers: "مزودو التدريب",
      audit: "التدقيق والامتثال",
      settings: "الإعدادات",
    },
    hero: {
      eyebrow: "حكومة أبوظبي",
      title: "منصة ترخيص المعلمين والمدربين",
      desc: "تقديم وتجديد وإدارة الاعتمادات المهنية عبر هيئة الاعتماد الرسمية في أبوظبي.",
      primary: "بدء الطلب",
      secondary: "تتبع طلبي",
    },
    sections: {
      overview: "نظرة عامة على الطلب",
      submit: "تقديم طلب جديد",
      myApps: "طلباتي",
      lifecycle: "مراحل الطلب",
      design: "نظام التصميم",
    },
    cards: {
      active: "التراخيص الفعّالة",
      pending: "قيد المراجعة",
      sla: "الالتزام بالمدة",
    },
    form: {
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      emirate: "الإمارة",
      specialization: "التخصص",
      experience: "سنوات الخبرة",
      bio: "البيان المهني",
      bioHelp: "صف بإيجاز فلسفتك التعليمية ومؤهلاتك.",
      submit: "تقديم للمراجعة",
      cancel: "إلغاء",
      placeholder: "اختر خياراً",
    },
    table: {
      ref: "المرجع",
      type: "النوع",
      submitted: "تاريخ التقديم",
      status: "الحالة",
      sla: "المدة",
    },
    modal: {
      title: "تأكيد التقديم",
      desc: "بمجرد التقديم، سيدخل طلبك قائمة المراجعة الرسمية. المدة المحددة 5 أيام عمل.",
      confirm: "تأكيد وتقديم",
    },
    toast: {
      success: "تم تقديم الطلب بنجاح",
      successDesc: "تم إنشاء المرجع ADV-2025-04412.",
    },
    steps: [
      { label: "البيانات الشخصية", description: "الهوية والتواصل" },
      { label: "المؤهلات", description: "الوثائق والشهادات" },
      { label: "التقييم", description: "مراجعة الكفاءات" },
      { label: "القرار", description: "الموافقة وإصدار الترخيص" },
    ],
  },
} as const;

interface AppRow {
  id: string;
  ref: string;
  type: string;
  submitted: string;
  status:
    | "Draft"
    | "Submitted"
    | "UnderReview"
    | "PendingApplicant"
    | "Approved"
    | "Rejected";
  slaElapsed: number;
  slaTotal: number;
}

const rows: AppRow[] = [
  { id: "1", ref: "ADV-2025-04412", type: "Initial Licence", submitted: "2025-04-18", status: "UnderReview",      slaElapsed: 56, slaTotal: 72 },
  { id: "2", ref: "ADV-2025-04305", type: "Renewal",          submitted: "2025-04-12", status: "PendingApplicant", slaElapsed: 12, slaTotal: 72 },
  { id: "3", ref: "ADV-2025-04190", type: "Specialisation",   submitted: "2025-04-08", status: "Approved",         slaElapsed: 70, slaTotal: 72 },
  { id: "4", ref: "ADV-2025-04088", type: "Initial Licence",  submitted: "2025-04-05", status: "Submitted",        slaElapsed: 22, slaTotal: 72 },
  { id: "5", ref: "ADV-2025-03982", type: "Renewal",          submitted: "2025-03-28", status: "Rejected",         slaElapsed: 72, slaTotal: 72 },
];

const Inner: React.FC<{ lang: Lang; setLang: (l: Lang) => void }> = ({
  lang,
  setLang,
}) => {
  const L = t[lang];
  const { push } = useToast();
  const [activeNav, setActiveNav] = React.useState("applications");
  const [step, setStep] = React.useState(1);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [emailErr, setEmailErr] = React.useState<string>();

  const navItems = [
    { id: "dashboard",    label: L.nav.dashboard,    icon: <LayoutDashboard size={18} /> },
    { id: "applications", label: L.nav.applications, icon: <FileText size={18} />,        badge: <Badge variant="gold">12</Badge> },
    { id: "assessments",  label: L.nav.assessments,  icon: <ClipboardList size={18} /> },
    { id: "licenses",     label: L.nav.licenses,     icon: <Award size={18} /> },
    { id: "providers",    label: L.nav.providers,    icon: <Users size={18} /> },
    { id: "audit",        label: L.nav.audit,        icon: <Shield size={18} /> },
    { id: "settings",     label: L.nav.settings,     icon: <Settings size={18} /> },
  ];

  const submitApplication = () => {
    setConfirmOpen(false);
    push({
      type: "success",
      title: L.toast.success,
      description: L.toast.successDesc,
    });
  };

  const validateEmail = (v: string) => {
    if (!v) return setEmailErr(undefined);
    setEmailErr(/.+@.+\..+/.test(v) ? undefined : "Please enter a valid email");
  };

  return (
    <div className="min-h-screen bg-surface-50 text-ink-primary">
      {/* ============ Top Bar ============ */}
      <header className="bg-surface-0 border-b border-border-default sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-surface-0/95">
        <div className="container flex h-16 items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-navy-900 inline-flex items-center justify-center text-ink-inverse font-bold ring-2 ring-gold-500/40">
              <GraduationCap size={20} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-wide text-navy-900">
                {L.brand}
              </p>
              <p className="text-xs text-ink-secondary hidden sm:block">
                {L.sub}
              </p>
            </div>
          </div>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 bg-surface-50 rounded-md px-3 py-1.5 ring-1 ring-border-default w-72">
            <Search size={16} className="text-ink-muted" />
            <input
              placeholder={lang === "ar" ? "بحث..." : "Search applications…"}
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-ink-muted"
            />
          </div>
          <LanguageToggle value={lang} onChange={setLang} />
          <Avatar name="Layla Hassan" size="md" />
        </div>
      </header>

      <div className="container grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 py-6">
        {/* ============ Sidebar ============ */}
        <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] bg-navy-900 rounded-lg p-3 flex flex-col">
          <nav className="flex flex-col gap-1">
            {navItems.map((n) => (
              <SidebarNavItem
                key={n.id}
                asButton
                onSelect={() => setActiveNav(n.id)}
                active={activeNav === n.id}
                icon={n.icon}
                label={n.label}
                badge={n.badge}
              />
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t border-navy-800">
            <div className="rounded-md bg-navy-800 p-3 text-ink-inverse">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400 font-semibold">
                <Shield size={14} /> Secure session
              </div>
              <p className="text-xs mt-1 text-ink-inverse/80">
                UAE Pass verified · Session expires in 28 min
              </p>
            </div>
          </div>
        </aside>

        {/* ============ Main ============ */}
        <main className="flex flex-col gap-8 min-w-0">
          {/* Hero */}
          <section className="rounded-xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-ink-inverse p-8 md:p-10 shadow-lg relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -start-10 -bottom-10 h-48 w-48 rounded-full bg-gold-500/5 blur-2xl"
            />
            <div className="relative max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-3">
                <span className="h-px w-8 bg-gold-400" />
                {L.hero.eyebrow}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                {L.hero.title}
              </h1>
              <p className="mt-3 text-ink-inverse/80 text-pretty">
                {L.hero.desc}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="gold" size="lg" iconEnd={<ChevronRight size={16} className="rtl-flip" />}>
                  {L.hero.primary}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-transparent text-ink-inverse border-ink-inverse/30 hover:bg-ink-inverse/10"
                >
                  {L.hero.secondary}
                </Button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{L.sections.overview}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card variant="government">
                <CardHeader>
                  <CardDescription>{L.cards.active}</CardDescription>
                  <CardTitle className="text-3xl">2,847</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge status="Approved" />
                </CardContent>
              </Card>
              <Card variant="government">
                <CardHeader>
                  <CardDescription>{L.cards.pending}</CardDescription>
                  <CardTitle className="text-3xl">142</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge status="UnderReview" />
                </CardContent>
              </Card>
              <Card variant="government">
                <CardHeader>
                  <CardDescription>{L.cards.sla}</CardDescription>
                  <CardTitle className="text-3xl">96.4%</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <SLAClock elapsedHours={56} totalHours={72} />
                  <div className="text-xs text-ink-secondary">
                    Avg decision time<br />
                    <span className="text-ink-primary font-semibold">2.3 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Stepper */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{L.sections.lifecycle}</h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  ← Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStep((s) => Math.min(L.steps.length - 1, s + 1))}
                >
                  Next →
                </Button>
              </div>
            </div>
            <Card variant="bordered">
              <CardContent className="pt-6">
                <Stepper steps={[...L.steps]} currentStep={step} />
              </CardContent>
            </Card>
          </section>

          {/* Form */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{L.sections.submit}</h2>
            <Card>
              <CardHeader>
                <CardTitle>{L.steps[0].label}</CardTitle>
                <CardDescription>{L.steps[0].description}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label={L.form.fullName}
                  required
                  placeholder={lang === "ar" ? "ليلى حسن" : "Layla Hassan"}
                />
                <Input
                  label={L.form.email}
                  required
                  type="email"
                  iconStart={<Mail size={16} />}
                  placeholder="layla@adveti.ae"
                  error={emailErr}
                  onBlur={(e) => validateEmail(e.target.value)}
                />
                <Select
                  label={L.form.emirate}
                  required
                  placeholder={L.form.placeholder}
                  defaultValue=""
                  options={[
                    { value: "AUH", label: "Abu Dhabi" },
                    { value: "AAN", label: "Al Ain" },
                    { value: "AGR", label: "Al Dhafra" },
                  ]}
                />
                <Select
                  label={L.form.specialization}
                  placeholder={L.form.placeholder}
                  defaultValue=""
                  options={[
                    { value: "STEM",     label: "STEM Education" },
                    { value: "LANG",     label: "Languages" },
                    { value: "VOC",      label: "Vocational Training" },
                    { value: "EARLY",    label: "Early Childhood" },
                  ]}
                />
                <Input
                  label={L.form.experience}
                  type="number"
                  defaultValue={8}
                  success="Meets minimum requirement"
                />
                <Input label="Password" type="password" placeholder="••••••••" />
                <div className="md:col-span-2">
                  <Textarea
                    label={L.form.bio}
                    helperText={L.form.bioHelp}
                    rows={4}
                    placeholder={
                      lang === "ar"
                        ? "أؤمن بأن التعليم..."
                        : "I believe education should empower…"
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="ghost">{L.form.cancel}</Button>
                <Button variant="secondary" iconStart={<Download size={16} />}>
                  Save Draft
                </Button>
                <Button variant="primary" onClick={() => setConfirmOpen(true)}>
                  {L.form.submit}
                </Button>
              </CardFooter>
            </Card>
          </section>

          {/* Alerts */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert type="info" title="Document verification in progress">
              Your Emirates ID is being matched against UAE Pass records.
            </Alert>
            <Alert type="warning" title="Action required">
              Upload your latest professional certificate before 30 April.
            </Alert>
          </section>

          {/* Table */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{L.sections.myApps}</h2>
            <Table<AppRow>
              rowKey={(r) => r.id}
              data={rows}
              columns={[
                { key: "ref",        header: L.table.ref,       sortable: true, width: "180px" },
                { key: "type",       header: L.table.type,      sortable: true },
                { key: "submitted",  header: L.table.submitted, sortable: true, width: "140px" },
                {
                  key: "status",
                  header: L.table.status,
                  width: "180px",
                  render: (r) => <Badge status={r.status} />,
                },
                {
                  key: "sla",
                  header: L.table.sla,
                  width: "100px",
                  align: "center",
                  render: (r) => (
                    <div className="flex justify-center">
                      <SLAClock
                        elapsedHours={r.slaElapsed}
                        totalHours={r.slaTotal}
                        size={44}
                      />
                    </div>
                  ),
                },
              ]}
              onRowClick={() => undefined}
            />
          </section>

          {/* Design system reference */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{L.sections.design}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-base">Buttons</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="gold">Gold CTA</Button>
                  <Button variant="primary" loading>Loading</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-base">Status Badges</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {([
                    "Draft",
                    "Submitted",
                    "UnderReview",
                    "PendingApplicant",
                    "Approved",
                    "Incomplete",
                    "Rejected",
                    "Expired",
                    "Suspended",
                    "Revoked",
                  ] as const).map((s) => (
                    <Badge key={s} status={s} />
                  ))}
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-base">Toasts</CardTitle>
                  <CardDescription>
                    Click to trigger semantic toasts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      push({
                        type: "success",
                        title: "Saved",
                        description: "Your draft has been stored.",
                      })
                    }
                  >
                    Success
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      push({
                        type: "warning",
                        title: "Heads up",
                        description: "SLA approaching.",
                      })
                    }
                  >
                    Warning
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      push({
                        type: "error",
                        title: "Submission failed",
                        description: "Try again in a moment.",
                      })
                    }
                  >
                    Error
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      push({
                        type: "info",
                        title: "Reminder",
                        description: "Renewal opens in 30 days.",
                      })
                    }
                  >
                    Info
                  </Button>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-base">Avatars & Brand</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Avatar name="Layla Hassan" size="sm" />
                    <span className="text-xs text-ink-muted">sm</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Avatar name="Omar Al Mansouri" size="md" />
                    <span className="text-xs text-ink-muted">md</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Avatar name="Fatima Saeed" size="lg" />
                    <span className="text-xs text-ink-muted">lg</span>
                  </div>
                  <div className="ms-auto flex items-center gap-2">
                    <BookOpen size={20} className="text-navy-700" />
                    <span className="text-sm font-semibold text-navy-900">
                      ADVETI · Abu Dhabi
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <footer className="border-t border-border-default pt-6 mt-4 text-xs text-ink-muted flex flex-wrap items-center gap-4 justify-between">
            <p>© 2025 ADVETI · Government of Abu Dhabi</p>
            <p className="flex items-center gap-2">
              <Shield size={12} /> Secured · Bilingual · WCAG AA
            </p>
          </footer>
        </main>
      </div>

      {/* Confirm modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={L.modal.title}
        description={L.modal.desc}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {L.form.cancel}
            </Button>
            <Button variant="primary" onClick={submitApplication}>
              {L.modal.confirm}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-ink-secondary">
          <p>
            By submitting, you confirm that the information provided is accurate
            and complete to the best of your knowledge.
          </p>
          <div className="rounded-md bg-surface-50 border border-border-default p-3 flex items-center justify-between">
            <span className="font-medium text-ink-primary">Application type</span>
            <Badge variant="info">Initial Licence</Badge>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Index: React.FC = () => {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    const initial = getInitialLang();
    setLangState(initial);
    applyLang(initial);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    applyLang(l);
  };

  return <Inner lang={lang} setLang={setLang} />;
};

export default Index;
