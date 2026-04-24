import * as React from "react";
import { Download, FileText } from "lucide-react";
import { Button, Card, CardContent } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";
import PageHero from "@/components/public/PageHero";

export interface PolicySection {
  id: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string[];
  bodyAr: string[];
}

export interface PolicyDocumentProps {
  eyebrowEn: string;
  eyebrowAr: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  effectiveDate: string;
  pdfHref: string;
  sections: PolicySection[];
}

const PolicyDocument: React.FC<PolicyDocumentProps> = ({
  eyebrowEn,
  eyebrowAr,
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  effectiveDate,
  pdfHref,
  sections,
}) => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [activeId, setActiveId] = React.useState(sections[0]?.id ?? "");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="space-y-10">
      <PageHero
        eyebrowEn={eyebrowEn}
        eyebrowAr={eyebrowAr}
        titleEn={titleEn}
        titleAr={titleAr}
        subtitleEn={subtitleEn}
        subtitleAr={subtitleAr}
        isAr={isAr}
      >
        <div className="flex flex-wrap items-center gap-4">
          <a href={pdfHref} download>
            <Button variant="gold" iconStart={<Download size={16} />}>
              {isAr ? "تنزيل PDF" : "Download PDF"}
            </Button>
          </a>
          <p className="text-sm text-ink-inverse/70">
            {isAr ? "تاريخ السريان: " : "Effective from: "}
            <span className="font-semibold text-ink-inverse">{effectiveDate}</span>
          </p>
        </div>
      </PageHero>

      <div className="grid gap-10 lg:grid-cols-4">
        {/* Sticky TOC */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-600 font-semibold mb-3 flex items-center gap-2">
              <FileText size={14} />
              {isAr ? "المحتويات" : "On this page"}
            </p>
            <nav>
              <ol className="space-y-1 text-sm border-s-2 border-border-default ps-3">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setActiveId(s.id)}
                      className={cn(
                        "block py-1.5 pe-2 ps-3 -ms-[2px] border-s-2 transition-colors focus-ring rounded",
                        activeId === s.id
                          ? "border-navy-800 text-navy-900 font-semibold"
                          : "border-transparent text-ink-secondary hover:text-navy-800",
                      )}
                    >
                      {i + 1}. {isAr ? s.titleAr : s.titleEn}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        {/* Body */}
        <div className="lg:col-span-3">
          <Card variant="bordered">
            <CardContent className="pt-6 pb-8 space-y-10">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <p className="text-xs uppercase tracking-[0.15em] text-gold-600 font-semibold">
                    {isAr ? `القسم ${i + 1}` : `Section ${i + 1}`}
                  </p>
                  <h2 className="text-xl font-semibold text-ink-primary mt-1">
                    {isAr ? s.titleAr : s.titleEn}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm text-ink-secondary leading-relaxed">
                    {(isAr ? s.bodyAr : s.bodyEn).map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </CardContent>
          </Card>

          <p className="mt-4 text-xs text-ink-muted">
            {isAr
              ? "في حال وجود تعارض بين النصين العربي والإنجليزي، يُعتمد النص العربي."
              : "In case of conflict between the English and Arabic versions, the Arabic text shall prevail."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyDocument;
