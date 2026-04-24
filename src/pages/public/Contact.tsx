import * as React from "react";
import { Clock, Mail, MapPin, Phone, Send, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button, Card, CardContent, Input, Select, Textarea } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import PageHero from "@/components/public/PageHero";

const Contact: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const subjects = [
    { value: "general", label: isAr ? "استفسار عام" : "General Inquiry" },
    { value: "application", label: isAr ? "حالة الطلب" : "Application Status" },
    { value: "payment", label: isAr ? "الدفع" : "Payment" },
    { value: "technical", label: isAr ? "مشكلة تقنية" : "Technical Issue" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="space-y-10">
      <PageHero
        eyebrowEn="Contact"
        eyebrowAr="تواصل معنا"
        titleEn="Get in touch with ADVETI"
        titleAr="تواصل مع أدفيتي"
        subtitleEn="Our support team is available during UAE business hours. Most inquiries are answered within one working day."
        subtitleAr="يتوفر فريق الدعم خلال ساعات العمل الرسمية في الإمارات، ويتم الرد على معظم الاستفسارات خلال يوم عمل واحد."
        isAr={isAr}
      />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: contact details */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="government">
            <CardContent className="pt-6 space-y-5">
              <div className="flex gap-3">
                <span className="h-9 w-9 rounded-md bg-navy-800 text-ink-inverse inline-flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
                    {isAr ? "العنوان" : "Office address"}
                  </p>
                  <p className="text-sm text-ink-primary mt-1 font-medium">
                    Abu Dhabi Department of Education and Knowledge
                    <br />
                    Al Mamoura Building B, Muroor Road
                    <br />
                    Abu Dhabi, United Arab Emirates
                  </p>
                  <p className="text-sm text-ink-secondary mt-2" dir="rtl">
                    دائرة التعليم والمعرفة بأبوظبي
                    <br />
                    مبنى المعمورة (B)، شارع المرور
                    <br />
                    أبوظبي، الإمارات العربية المتحدة
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="h-9 w-9 rounded-md bg-navy-800 text-ink-inverse inline-flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
                    {isAr ? "الهاتف" : "Phone"}
                  </p>
                  <a
                    href="tel:+97128000800"
                    className="text-sm text-navy-800 hover:underline mt-1 block"
                    dir="ltr"
                  >
                    +971 2 800 0800
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="h-9 w-9 rounded-md bg-navy-800 text-ink-inverse inline-flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
                    {isAr ? "البريد الإلكتروني" : "Email"}
                  </p>
                  <a
                    href="mailto:licensing@adveti.ae"
                    className="text-sm text-navy-800 hover:underline mt-1 block"
                  >
                    licensing@adveti.ae
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="h-9 w-9 rounded-md bg-navy-800 text-ink-inverse inline-flex items-center justify-center flex-shrink-0">
                  <Clock size={16} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
                    {isAr ? "ساعات العمل" : "Office hours"}
                  </p>
                  <p className="text-sm text-ink-primary mt-1">
                    {isAr ? "الإثنين – الجمعة" : "Monday – Friday"}
                    <br />
                    08:00 – 17:00 (GST, UTC+4)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map placeholder */}
          <Card variant="bordered">
            <div className="aspect-[4/3] bg-surface-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(var(--surface-200)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--surface-200)) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
              <div className="relative text-center">
                <MapPin size={32} className="mx-auto text-navy-800 mb-2" />
                <p className="text-xs text-ink-secondary">
                  {isAr ? "أبوظبي، الإمارات العربية المتحدة" : "Abu Dhabi, UAE"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: contact form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <Card variant="elevated" className="bg-success-100 border border-success-600/20">
              <CardContent className="pt-8 pb-8 text-center">
                <span className="inline-flex h-14 w-14 rounded-full bg-success-600 text-ink-inverse items-center justify-center mb-4">
                  <CheckCircle2 size={28} />
                </span>
                <h3 className="text-lg font-semibold text-ink-primary">
                  {isAr ? "تم استلام رسالتك" : "Your message has been received"}
                </h3>
                <p className="mt-2 text-sm text-ink-secondary max-w-md mx-auto">
                  {isAr
                    ? "شكراً لتواصلك مع أدفيتي. سيتم الرد على رسالتك خلال يوم عمل واحد."
                    : "Thank you for contacting ADVETI. We will respond to your message within one business day."}
                </p>
                <Button
                  variant="secondary"
                  className="mt-5"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", phone: "", subject: "general", message: "" });
                  }}
                >
                  {isAr ? "إرسال رسالة أخرى" : "Send another message"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card variant="elevated">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold text-ink-primary">
                  {isAr ? "نموذج التواصل" : "Contact form"}
                </h2>
                <p className="mt-1 text-sm text-ink-secondary">
                  {isAr
                    ? "املأ النموذج وسنتواصل معك في أقرب وقت."
                    : "Complete the form and we will reply as soon as possible."}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label={isAr ? "الاسم" : "Name"}
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={isAr ? "اسمك الكامل" : "Your full name"}
                    />
                    <Input
                      label={isAr ? "البريد الإلكتروني" : "Email"}
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.ae"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label={isAr ? "الهاتف (اختياري)" : "Phone (optional)"}
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+971 50 000 0000"
                    />
                    <Select
                      label={isAr ? "الموضوع" : "Subject"}
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      options={subjects}
                    />
                  </div>

                  <Textarea
                    label={isAr ? "رسالتك" : "Message"}
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={isAr ? "اكتب استفسارك هنا…" : "Write your inquiry here…"}
                  />

                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    <ShieldCheck size={14} className="text-success-600" />
                    {isAr
                      ? "محمي من الإرسال التلقائي (CAPTCHA)"
                      : "Protected by CAPTCHA"}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    iconStart={<Send size={16} />}
                  >
                    {isAr ? "إرسال الرسالة" : "Send message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
