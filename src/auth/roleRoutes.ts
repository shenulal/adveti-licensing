import type { Role } from "@/auth/AuthContext";

export const BACK_OFFICE_ROLES: Role[] = [
  "assessor",
  "senior_assessor",
  "appeals_officer",
  "finance_officer",
  "content_editor",
  "system_admin",
  "super_admin",
  "auditor",
];

export const AUTHENTICATED_ROLES: Role[] = ["applicant", ...BACK_OFFICE_ROLES, "verifier"];

export const getHomeForRole = (role: Role): string => {
  switch (role) {
    case "applicant":
      return "/portal/dashboard";
    case "assessor":
    case "appeals_officer":
      return "/assessor/queue";
    case "senior_assessor":
      return "/senior/queue";
    case "finance_officer":
      return "/finance/reconciliation";
    case "content_editor":
      return "/content/templates";
    case "system_admin":
    case "super_admin":
    case "auditor":
      return "/reports/operational";
    case "verifier":
      return "/verify";
    case "guest":
    default:
      return "/";
  }
};

export const isAdminRole = (role: Role) =>
  role === "system_admin" || role === "super_admin";

export const getBackOfficeNotificationTarget = (role: Role) => {
  switch (role) {
    case "auditor":
      return "/audit/log";
    case "content_editor":
      return "/content/templates";
    case "finance_officer":
      return "/finance/reconciliation";
    case "assessor":
    case "appeals_officer":
      return "/assessor/queue";
    case "senior_assessor":
      return "/senior/queue";
    case "system_admin":
    case "super_admin":
      return "/reports/operational";
    default:
      return getHomeForRole(role);
  }
};
