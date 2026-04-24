import * as React from "react";

export type Role =
  | "guest"
  | "applicant"
  | "assessor"
  | "senior_assessor"
  | "appeals_officer"
  | "finance_officer"
  | "content_editor"
  | "system_admin"
  | "super_admin"
  | "auditor"
  | "verifier";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  setRole: (role: Role) => void;
  signOut: () => void;
}

const STORAGE_KEY = "adveti.role";

const ROLE_LABELS: Record<Role, string> = {
  guest: "Guest",
  applicant: "Applicant",
  assessor: "Assessor",
  senior_assessor: "Senior Assessor",
  appeals_officer: "Appeals Officer",
  finance_officer: "Finance Officer",
  content_editor: "Content Editor",
  system_admin: "System Admin",
  super_admin: "Super Admin",
  auditor: "Auditor",
  verifier: "Verifier",
};

export const roleLabel = (r: Role) => ROLE_LABELS[r];

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const buildUser = (role: Role): AuthUser | null => {
  if (role === "guest") return null;
  return {
    id: `mock-${role}`,
    name:
      role === "applicant"
        ? "Layla Hassan"
        : role === "assessor"
        ? "Omar Al Marzooqi"
        : role === "senior_assessor"
        ? "Sara Al Suwaidi"
        : role === "finance_officer"
        ? "Khalid Al Hosani"
        : role === "system_admin" || role === "super_admin"
        ? "Aisha Al Mansoori"
        : role === "content_editor"
        ? "Noura Al Ali"
        : role === "auditor"
        ? "Mohammed Al Shamsi"
        : "ADVETI User",
    email: `${role}@adveti.ae`,
    role,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = React.useState<Role>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Role | null;
      return saved ?? "guest";
    } catch {
      return "guest";
    }
  });

  const setRole = React.useCallback((r: Role) => {
    setRoleState(r);
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = React.useCallback(() => setRole("guest"), [setRole]);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user: buildUser(role), setRole, signOut }),
    [role, setRole, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};