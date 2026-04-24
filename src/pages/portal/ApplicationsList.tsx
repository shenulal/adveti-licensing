import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Plus, Search } from "lucide-react";
import { Badge, Button, Card, CardContent, Input } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatDate } from "@/lib/format";
import { mockApplications } from "@/lib/mockApplicant";

const ApplicationsList: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [q, setQ] = React.useState("");

  const filtered = mockApplications.filter(
    (a) =>
      a.id.toLowerCase().includes(q.toLowerCase()) ||
      a.licenceCategory.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">
            {isAr ? "طلباتي" : "My Applications"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isAr ? "جميع طلباتك في مكان واحد" : "All your applications in one place"}
          </p>
        </div>
        <Link to="/portal/apply">
          <Button variant="gold" iconStart={<Plus size={16} />}>
            {isAr ? "طلب جديد" : "New Application"}
          </Button>
        </Link>
      </header>

      <div className="max-w-sm">
        <Input
          iconStart={<Search size={16} />}
          placeholder={isAr ? "ابحث برقم الطلب أو الفئة…" : "Search by ID or category…"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((a) => (
          <Card key={a.id} variant="bordered">
            <CardContent className="pt-5 pb-5 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p
                    className="font-mono font-semibold text-ink-primary"
                    dir="ltr"
                  >
                    {a.id}
                  </p>
                  <Badge status={a.status} />
                </div>
                <p className="text-sm text-ink-secondary mt-1">
                  {isAr
                    ? a.licenceCategory === "Teacher"
                      ? "معلم"
                      : a.licenceCategory === "Counsellor"
                      ? "مرشد"
                      : "مدرّب"
                    : a.licenceCategory}
                  {a.submittedAt && (
                    <>
                      {" · "}
                      {isAr ? "قُدّم في " : "Submitted "}
                      {formatDate(a.submittedAt, lang)}
                    </>
                  )}
                </p>
              </div>
              <Link to={`/portal/applications/${a.id}`}>
                <Button
                  variant="secondary"
                  iconEnd={<ChevronRight size={14} className="rtl-flip" />}
                >
                  {isAr ? "عرض" : "Open"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card variant="bordered">
            <CardContent className="pt-10 pb-10 text-center text-sm text-ink-secondary">
              {isAr ? "لا توجد طلبات مطابقة." : "No applications match your search."}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
