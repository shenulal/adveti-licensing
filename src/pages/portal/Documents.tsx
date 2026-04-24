import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Eye, FileText, Trash2, Upload, RefreshCcw, ShieldCheck, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Alert, Badge, Button, Card, CardContent, Modal, Select } from "@/components/adveti";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";

type ScanStatus = "scanning" | "clean" | "quarantined";

interface UploadedDoc {
  id: string;
  file: File;
  type: string;
  scan: ScanStatus;
  error?: string;
}

const DOC_TYPES = [
  { value: "emirates_id", labelEn: "Emirates ID", labelAr: "الهوية الإماراتية" },
  { value: "degree", labelEn: "Degree Certificate", labelAr: "شهادة الدرجة" },
  { value: "experience", labelEn: "Experience Letter", labelAr: "خطاب الخبرة" },
  { value: "cpd", labelEn: "CPD Evidence", labelAr: "إثبات التطوير المهني" },
  { value: "other", labelEn: "Other", labelAr: "أخرى" },
];

const MAX_SIZE_MB = 5;
const MAX_FILES = 5;

const Documents: React.FC = () => {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const { id } = useParams();
  const [docs, setDocs] = React.useState<UploadedDoc[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const [previewing, setPreviewing] = React.useState<UploadedDoc | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024)
      return isAr ? `الملف يتجاوز ${MAX_SIZE_MB} ميغابايت` : `File exceeds ${MAX_SIZE_MB}MB`;
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type))
      return isAr ? "نوع ملف غير مدعوم" : "Unsupported file type";
    return null;
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    if (docs.length + list.length > MAX_FILES) {
      alert(isAr ? `الحد الأقصى ${MAX_FILES} ملفات` : `Maximum ${MAX_FILES} files`);
      return;
    }
    list.forEach((f) => {
      const error = validate(f);
      const newDoc: UploadedDoc = {
        id: Math.random().toString(36).slice(2),
        file: f,
        type: "",
        scan: error ? "quarantined" : "scanning",
        error: error ?? undefined,
      };
      setDocs((d) => [...d, newDoc]);
      if (!error) {
        // simulate scan
        setTimeout(() => {
          setDocs((d) =>
            d.map((doc) => (doc.id === newDoc.id ? { ...doc, scan: "clean" } : doc)),
          );
        }, 1500);
      }
    });
  };

  const remove = (id: string) => setDocs((d) => d.filter((doc) => doc.id !== id));
  const setType = (id: string, type: string) =>
    setDocs((d) => d.map((doc) => (doc.id === id ? { ...doc, type } : doc)));

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold text-ink-primary">
          {isAr ? "رفع الوثائق" : "Upload documents"}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          {isAr ? "للطلب " : "For application "}
          <span className="font-mono" dir="ltr">{id}</span>
        </p>
      </header>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "border-2 border-dashed rounded-lg p-10 text-center transition-colors",
          dragOver ? "border-navy-800 bg-navy-800/5" : "border-border-strong bg-surface-50",
        )}
      >
        <Upload size={36} className="mx-auto text-navy-800 mb-3 rtl-flip" />
        <p className="text-sm font-medium text-ink-primary">
          {isAr ? "اسحب الملفات هنا أو" : "Drop files here or"}
        </p>
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept="application/pdf,image/jpeg,image/png"
          onChange={(e) => addFiles(e.target.files)}
        />
        <Button
          variant="primary"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
        >
          {isAr ? "تصفّح الملفات" : "Browse files"}
        </Button>
        <p className="text-xs text-ink-muted mt-3">
          {isAr
            ? `PDF / JPG / PNG · حتى ${MAX_SIZE_MB} ميغابايت لكل ملف · حتى ${MAX_FILES} ملفات`
            : `PDF / JPG / PNG · max ${MAX_SIZE_MB}MB per file · up to ${MAX_FILES} files`}
        </p>
      </div>

      {/* Files list */}
      {docs.length > 0 && (
        <Card variant="bordered">
          <ul className="divide-y divide-border-default">
            {docs.map((doc) => (
              <li key={doc.id} className="p-4 flex items-center gap-4 flex-wrap">
                <span className="h-10 w-10 rounded-md bg-surface-100 inline-flex items-center justify-center text-navy-800 shrink-0">
                  <FileText size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary truncate">
                    {doc.file.name}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {(doc.file.size / 1024).toFixed(0)} KB
                  </p>
                  {doc.error && (
                    <p className="text-xs text-danger-600 mt-1 inline-flex items-center gap-1">
                      <AlertTriangle size={11} />
                      {doc.error}
                    </p>
                  )}
                </div>
                <Select
                  className="w-44"
                  value={doc.type}
                  onChange={(e) => setType(doc.id, e.target.value)}
                  placeholder={isAr ? "نوع الوثيقة" : "Document type"}
                  options={DOC_TYPES.map((d) => ({
                    value: d.value,
                    label: isAr ? d.labelAr : d.labelEn,
                  }))}
                />
                <ScanBadge status={doc.scan} isAr={isAr} />
                {!doc.error && doc.scan === "clean" && (
                  <button
                    onClick={() => setPreviewing(doc)}
                    className="p-2 rounded hover:bg-surface-100 text-ink-secondary focus-ring"
                    aria-label="Preview"
                  >
                    <Eye size={16} />
                  </button>
                )}
                <button
                  onClick={() => remove(doc.id)}
                  className="p-2 rounded hover:bg-danger-100 text-danger-600 focus-ring"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {docs.some((d) => d.scan === "quarantined") && (
        <Alert type="error" title={isAr ? "ملف في الحجر" : "File quarantined"}>
          {isAr
            ? "تعذّر معالجة بعض الملفات. احذفها وارفع نسخاً نظيفة."
            : "Some files could not be processed. Remove them and re-upload clean copies."}
        </Alert>
      )}

      {docs.length > 0 && docs.every((d) => d.scan === "clean") && (
        <Alert type="success" title={isAr ? "كل الوثائق جاهزة" : "All documents ready"}>
          {isAr ? "تم فحص جميع الملفات بنجاح." : "All files have been scanned successfully."}
        </Alert>
      )}

      <div className="flex justify-end gap-3">
        <Link to={`/portal/applications/${id}`}>
          <Button variant="ghost">{isAr ? "إلغاء" : "Cancel"}</Button>
        </Link>
        <Button
          variant="primary"
          disabled={docs.length === 0 || docs.some((d) => d.scan !== "clean" || !d.type)}
        >
          {isAr ? "حفظ الوثائق" : "Save documents"}
        </Button>
      </div>

      <Modal
        open={!!previewing}
        onClose={() => setPreviewing(null)}
        title={previewing?.file.name}
        size="lg"
      >
        {previewing && previewing.file.type.startsWith("image/") ? (
          <img
            src={URL.createObjectURL(previewing.file)}
            alt="Preview"
            className="w-full h-auto"
          />
        ) : (
          <div className="h-96 bg-surface-100 rounded flex items-center justify-center text-ink-muted">
            <FileText size={48} />
          </div>
        )}
      </Modal>
    </div>
  );
};

const ScanBadge: React.FC<{ status: ScanStatus; isAr: boolean }> = ({ status, isAr }) => {
  if (status === "scanning")
    return (
      <Badge variant="info">
        <RefreshCcw size={10} className="animate-spin" />
        {isAr ? "جاري الفحص" : "Scanning"}
      </Badge>
    );
  if (status === "quarantined")
    return (
      <Badge variant="danger">
        <X size={10} />
        {isAr ? "محجور" : "Quarantined"}
      </Badge>
    );
  return (
    <Badge variant="success">
      <ShieldCheck size={10} />
      {isAr ? "نظيف" : "Clean"}
    </Badge>
  );
};

export default Documents;
