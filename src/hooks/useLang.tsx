import * as React from "react";
import { applyLang, getInitialLang, Lang } from "@/components/adveti";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <T extends Record<Lang, unknown>>(dict: T) => T[Lang];
}

const LangContext = React.createContext<LangContextValue | undefined>(undefined);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = React.useState<Lang>(() => getInitialLang());

  React.useEffect(() => {
    applyLang(lang);
  }, [lang]);

  const setLang = React.useCallback((l: Lang) => setLangState(l), []);

  const value = React.useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: (dict) => dict[lang],
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = () => {
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
};