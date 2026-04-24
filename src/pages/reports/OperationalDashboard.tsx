import * as React from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Bell,
  CircleDollarSign,
  Clock,
  FileCheck2,
  FilePlus2,
  Gauge,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Badge, Card } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { formatAED, formatNumber } from "@/lib/format";
import {
  ASSESSOR_WORKLOAD,
  DECISION_OUTCOMES,
  FUNNEL,
  KPIS,
  REVENUE_TREND,
  SLA_ON_TIME_PCT,
  TODAYS_FEED,
} from "@/lib/mockSeed";
import { cn } from "@/lib/utils";

/* ---------- Tiny SVG primitives (no chart library) ---------- */

const Sparkline: React.FC<{ values: number[]; tone?: "navy" | "gold" | "success" }> = ({
  values,
  tone = "navy",
}) => {
  const w = 120;
  const h = 36;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  const stroke =
    tone === "gold"
      ? "hsl(var(--gold-500))"
      : tone === "success"
        ? "hsl(var(--success-600))"
        : "hsl(var(--navy-700))";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9" aria-hidden focusable="false">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
};

interface KpiCardProps {
  icon: React.ReactNode;
  labelEn: string;
  labelAr: string;
  value: string;
  deltaPct: number;
  spark: number[];
  primary?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  labelEn,
  labelAr,
  value,
  deltaPct,
  spark,
  primary,
}) => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const positive = deltaPct >= 0;
  return (
    <Card
      variant="elevated"
      className={cn(
        "relative overflow-hidden p-5 flex flex-col gap-3",
        "transition-all duration-fast hover:-translate-y-[2px] hover:shadow-lg",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-secondary font-semibold">
            {isAr ? labelAr : labelEn}
          </p>
          <p className="text-4xl font-bold text-navy-900 mt-2 leading-none tabular-nums">
            {value}
          </p>
        </div>
        <span className="h-10 w-10 rounded-md bg-gold-100 text-gold-600 inline-flex items-center justify-center shrink-0 ring-1 ring-gold-300">
          {icon}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 ring-1 ring-inset",
            positive
              ? "text-success-600 bg-success-100 ring-success-600/30"
              : "text-danger-600 bg-danger-100 ring-danger-600/30",
          )}
        >
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(deltaPct)}%
        </span>
        <span className="text-[10px] text-ink-muted">
          {isAr ? "مقابل الشهر السابق" : "vs last month"}
        </span>
      </div>
      <Sparkline values={spark} tone={positive ? "success" : "navy"} />
      {primary && (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
        />
      )}
    </Card>
  );
};

/* ---------- Revenue area chart ---------- */

const RevenueChart: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const data = REVENUE_TREND;
  const w = 720;
  const h = 220;
  const padX = 36;
  const padY = 24;
  const max = Math.max(...data.map((d) => d.revenueAed));
  const min = 0;
  const range = max - min;
  const stepX = (w - padX * 2) / (data.length - 1);
  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padY + (1 - (d.revenueAed - min) / range) * (h - padY * 2),
    d,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area =
    `M ${points[0].x} ${h - padY} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x} ${h - padY} Z`;

  const yTicks = 4;
  const tickLabels = Array.from({ length: yTicks + 1 }).map((_, i) => {
    const v = (max / yTicks) * (yTicks - i);
    return Math.round(v / 1000);
  });

  const [hover, setHover] = React.useState<number | null>(null);

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-[220px]"
        role="img"
        aria-label={isAr ? "اتجاه الإيرادات الشهرية" : "Monthly revenue trend"}
      >
        <defs>
          <linearGradient id="rev-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--navy-700))" stopOpacity={0.18} />
            <stop offset="100%" stopColor="hsl(var(--navy-700))" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {tickLabels.map((label, i) => {
          const y = padY + (i / yTicks) * (h - padY * 2);
          return (
            <g key={i}>
              <line x1={padX} x2={w - padX} y1={y} y2={y} stroke="hsl(var(--surface-200))" strokeDasharray="3 4" />
              <text
                x={padX - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-[hsl(var(--text-muted))]"
                fontSize={10}
              >
                {`${formatNumber(label, lang)}K`}
              </text>
            </g>
          );
        })}

        {/* area + line */}
        <path d={area} fill="url(#rev-grad)" />
        <path d={path} fill="none" stroke="hsl(var(--navy-700))" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />

        {/* points */}
        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
          >
            <circle cx={p.x} cy={p.y} r={hover === i ? 5 : 3} fill="hsl(var(--surface-0))" stroke="hsl(var(--navy-700))" strokeWidth={2} />
            <text
              x={p.x}
              y={h - 6}
              textAnchor="middle"
              className="fill-[hsl(var(--text-secondary))]"
              fontSize={10}
            >
              {isAr ? p.d.monthAr.slice(0, 3) : p.d.monthEn}
            </text>
          </g>
        ))}
      </svg>

      {hover !== null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none bg-navy-900 text-ink-inverse text-xs rounded-md px-3 py-2 shadow-lg"
          style={{
            left: `${(points[hover].x / w) * 100}%`,
            top: `${(points[hover].y / h) * 100}%`,
          }}
          role="status"
        >
          <p className="font-semibold">
            {isAr ? points[hover].d.monthAr : points[hover].d.monthEn}
          </p>
          <p className="tabular-nums">{formatAED(points[hover].d.revenueAed, lang)}</p>
          <p className="text-ink-inverse/70">
            {formatNumber(points[hover].d.applications, lang)}{" "}
            {isAr ? "طلب" : "applications"}
          </p>
        </div>
      )}
    </div>
  );
};

/* ---------- Funnel ---------- */

const Funnel: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const max = Math.max(...FUNNEL.map((f) => f.count));
  return (
    <ol className="space-y-2">
      {FUNNEL.map((row) => {
        const widthPct = (row.count / max) * 100;
        return (
          <li key={row.keyEn} className="grid grid-cols-[140px_1fr_64px] items-center gap-3">
            <span className="text-xs font-medium text-ink-secondary truncate">
              {isAr ? row.keyAr : row.keyEn}
            </span>
            <div className="h-7 bg-surface-100 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-slow ease-out"
                style={{ width: `${widthPct}%`, background: row.color }}
              />
            </div>
            <span className="text-sm font-semibold text-ink-primary tabular-nums text-end">
              {formatNumber(row.count, lang)}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

/* ---------- SLA Gauge (270° arc with animated needle) ---------- */

const SLAGauge: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const pct = SLA_ON_TIME_PCT / 100;
  const size = 200;
  const r = 78;
  const stroke = 14;
  const cx = size / 2;
  const cy = size / 2 + 6;

  const arcAngle = 270; // degrees
  const startAngle = -arcAngle / 2 - 90;
  const endAngle = startAngle + arcAngle;
  const valueAngle = startAngle + arcAngle * pct;

  const polar = (angleDeg: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const arcPath = (a1: number, a2: number) => {
    const p1 = polar(a1);
    const p2 = polar(a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
  };

  const [needleAngle, setNeedleAngle] = React.useState(startAngle);
  React.useEffect(() => {
    const id = window.setTimeout(() => setNeedleAngle(valueAngle), 80);
    return () => window.clearTimeout(id);
  }, [valueAngle]);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[220px]"
        role="img"
        aria-label={
          isAr ? `نسبة الالتزام بالـ SLA ${SLA_ON_TIME_PCT}%` : `SLA on-time ${SLA_ON_TIME_PCT}%`
        }
      >
        {/* breached portion (background of full track) */}
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="hsl(var(--danger-600) / 0.18)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* on-time portion */}
        <path
          d={arcPath(startAngle, valueAngle)}
          fill="none"
          stroke="hsl(var(--success-600))"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* needle */}
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: `rotate(${needleAngle + 90}deg)`,
            transition: "transform 1500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 6} stroke="hsl(var(--navy-900))" strokeWidth={3} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={5} fill="hsl(var(--navy-900))" />
        </g>
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          className="fill-[hsl(var(--navy-900))] font-bold"
          fontSize={32}
        >
          {SLA_ON_TIME_PCT}%
        </text>
      </svg>
      <p className="text-xs text-ink-secondary -mt-2">
        {isAr ? "في الوقت المحدد" : "On-time decisions"}
      </p>
    </div>
  );
};

/* ---------- Decision outcomes stacked bar ---------- */

const DecisionOutcomes: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const total = DECISION_OUTCOMES.reduce((s, o) => s + o.count, 0);
  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full rounded-full overflow-hidden ring-1 ring-border-default">
        {DECISION_OUTCOMES.map((o) => (
          <div
            key={o.keyEn}
            style={{ width: `${(o.count / total) * 100}%`, background: o.color }}
            aria-label={`${isAr ? o.keyAr : o.keyEn}: ${o.count}`}
          />
        ))}
      </div>
      <ul className="space-y-1.5">
        {DECISION_OUTCOMES.map((o) => (
          <li key={o.keyEn} className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-2 text-ink-secondary">
              <span className="h-2 w-2 rounded-full" style={{ background: o.color }} />
              {isAr ? o.keyAr : o.keyEn}
            </span>
            <span className="font-semibold text-ink-primary tabular-nums">
              {formatNumber(o.count, lang)} ·{" "}
              <span className="text-ink-muted">
                {Math.round((o.count / total) * 100)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ---------- Today's live feed ---------- */

const FEED_ICON: Record<string, React.ReactNode> = {
  submission: <FilePlus2 size={14} />,
  payment: <CircleDollarSign size={14} />,
  issued: <Award size={14} />,
  rfi: <Bell size={14} />,
  approval: <UserCheck size={14} />,
  login: <Activity size={14} />,
};

const FEED_TONE: Record<string, string> = {
  submission: "text-info-600 bg-info-100",
  payment: "text-gold-600 bg-gold-100",
  issued: "text-success-600 bg-success-100",
  rfi: "text-warning-600 bg-warning-100",
  approval: "text-navy-900 bg-surface-100",
  login: "text-ink-secondary bg-surface-100",
};

const LiveFeed: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";

  // Staggered fade-in
  const refs = React.useRef<(HTMLLIElement | null)[]>([]);
  React.useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(6px)";
      window.setTimeout(() => {
        el.style.transition = "opacity 320ms ease-out, transform 320ms ease-out";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 80 * i);
    });
  }, []);

  return (
    <ul className="space-y-2.5">
      {TODAYS_FEED.map((ev, i) => (
        <li
          key={ev.id}
          ref={(el) => (refs.current[i] = el)}
          className="flex items-start gap-2.5"
        >
          <span
            className={cn(
              "h-7 w-7 inline-flex items-center justify-center rounded-md shrink-0",
              FEED_TONE[ev.kind],
            )}
          >
            {FEED_ICON[ev.kind]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-primary leading-snug">
              {isAr ? ev.textAr : ev.textEn}
            </p>
            <p className="text-[10px] text-ink-muted mt-0.5">
              {isAr ? `قبل ${ev.minutesAgo} دقيقة` : `${ev.minutesAgo} minutes ago`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

/* ---------- Card chrome ---------- */

interface PanelProps {
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  icon,
  className,
  children,
}) => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  return (
    <Card
      variant="elevated"
      className={cn(
        "p-5 transition-all duration-fast hover:-translate-y-[2px] hover:shadow-lg",
        className,
      )}
    >
      <header className="flex items-start gap-3 mb-4">
        <span className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-navy-900 text-gold-400 shrink-0">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-ink-primary leading-tight">
            {isAr ? titleAr : titleEn}
          </h3>
          {(subtitleEn || subtitleAr) && (
            <p className="text-xs text-ink-secondary mt-0.5">
              {isAr ? subtitleAr : subtitleEn}
            </p>
          )}
        </div>
      </header>
      {children}
    </Card>
  );
};

/* ---------- Page ---------- */

const OperationalDashboard: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";

  return (
    <div className="space-y-6">
      {/* Page header — editorial */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold-600 font-semibold">
            <Activity size={14} />
            {isAr ? "لوحة التشغيل" : "Operational dashboard"}
          </p>
          <h1 className="text-3xl font-bold text-ink-primary mt-2">
            {isAr ? "صورة حية لمنصة أدفيتي" : "ADVETI · live operational view"}
          </h1>
          <p className="text-sm text-ink-secondary mt-1 max-w-xl">
            {isAr
              ? "ملخّص الإيرادات، قمع الطلبات، أداء الـ SLA، ومخرجات القرارات لآخر 30 يومًا."
              : "Revenue, application funnel, SLA health and decision outcomes — rolling 30-day window."}
          </p>
        </div>
        <Badge variant="success" className="text-xs">
          {isAr ? "البيانات حيّة" : "Live · refreshed just now"}
        </Badge>
      </header>

      {/* Bento grid — 6 columns; cards span 2 each on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-[minmax(0,auto)]">
        {/* Row 1 — KPIs (3 × 2 cols each) */}
        <div className="lg:col-span-2 md:col-span-1">
          <KpiCard
            icon={<FilePlus2 size={18} />}
            labelEn={KPIS.newApplications.en}
            labelAr={KPIS.newApplications.ar}
            value={formatNumber(KPIS.newApplications.value, lang)}
            deltaPct={KPIS.newApplications.deltaPct}
            spark={KPIS.newApplications.spark}
            primary
          />
        </div>
        <div className="lg:col-span-2 md:col-span-1">
          <KpiCard
            icon={<FileCheck2 size={18} />}
            labelEn={KPIS.certificatesIssued.en}
            labelAr={KPIS.certificatesIssued.ar}
            value={formatNumber(KPIS.certificatesIssued.value, lang)}
            deltaPct={KPIS.certificatesIssued.deltaPct}
            spark={KPIS.certificatesIssued.spark}
            primary
          />
        </div>
        <div className="lg:col-span-2 md:col-span-2">
          <KpiCard
            icon={<CircleDollarSign size={18} />}
            labelEn={KPIS.revenueAed.en}
            labelAr={KPIS.revenueAed.ar}
            value={formatAED(KPIS.revenueAed.value, lang)}
            deltaPct={KPIS.revenueAed.deltaPct}
            spark={KPIS.revenueAed.spark}
            primary
          />
        </div>

        {/* Row 2 — Revenue (4 cols) + SLA gauge (2 cols) */}
        <Panel
          icon={<TrendingUp size={18} />}
          titleEn="Revenue trend"
          titleAr="اتجاه الإيرادات"
          subtitleEn="Last 12 months — AED, all categories"
          subtitleAr="آخر 12 شهرًا — درهم، جميع الفئات"
          className="lg:col-span-4 md:col-span-2"
        >
          <RevenueChart />
        </Panel>
        <Panel
          icon={<Gauge size={18} />}
          titleEn="SLA health"
          titleAr="أداء الـ SLA"
          subtitleEn="On-time decisions vs target"
          subtitleAr="القرارات في الوقت مقابل الهدف"
          className="lg:col-span-2 md:col-span-2"
        >
          <SLAGauge />
        </Panel>

        {/* Row 3 — Funnel (4 cols) + Outcomes (2 cols) */}
        <Panel
          icon={<Activity size={18} />}
          titleEn="Application funnel"
          titleAr="قمع الطلبات"
          subtitleEn="Submitted → Issued conversion"
          subtitleAr="من التقديم إلى الإصدار"
          className="lg:col-span-4 md:col-span-2"
        >
          <Funnel />
        </Panel>
        <Panel
          icon={<UserCheck size={18} />}
          titleEn="Decision outcomes"
          titleAr="مخرجات القرارات"
          subtitleEn="Quarter-to-date"
          subtitleAr="ربع السنة حتى الآن"
          className="lg:col-span-2 md:col-span-2"
        >
          <DecisionOutcomes />
        </Panel>

        {/* Row 4 — Assessor workload (4 cols) + Live feed (2 cols) */}
        <Panel
          icon={<UserCheck size={18} />}
          titleEn="Assessor workload"
          titleAr="حِمل المقيّمين"
          subtitleEn="Open queue and average decision time"
          subtitleAr="قائمة الانتظار وزمن القرار المتوسط"
          className="lg:col-span-4 md:col-span-2"
        >
          <ul className="divide-y divide-border-default">
            {ASSESSOR_WORKLOAD.map((a, i) => (
              <li
                key={a.nameEn}
                className={cn(
                  "py-2.5 grid grid-cols-[1fr_auto_auto] items-center gap-3",
                  i % 2 === 1 && "bg-surface-50/40 -mx-5 px-5",
                )}
              >
                <span className="text-sm font-medium text-ink-primary">
                  {isAr ? `${a.nameAr} / ${a.nameEn}` : `${a.nameEn} / ${a.nameAr}`}
                </span>
                <span className="text-xs text-ink-secondary inline-flex items-center gap-1">
                  <Clock size={12} className="text-ink-muted" />
                  {isAr ? `${a.avgDays} يوم` : `${a.avgDays}d avg`}
                </span>
                <Badge variant={a.queue >= 4 ? "warning" : "neutral"}>
                  {isAr ? `${a.queue} في الانتظار` : `${a.queue} in queue`}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          icon={<Bell size={18} />}
          titleEn="Today's highlights"
          titleAr="أحداث اليوم"
          subtitleEn="Last 5 platform events"
          subtitleAr="آخر 5 أحداث على المنصة"
          className="lg:col-span-2 md:col-span-2"
        >
          <LiveFeed />
        </Panel>
      </div>
    </div>
  );
};

export default OperationalDashboard;
