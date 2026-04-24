import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Role, useAuth } from "./AuthContext";

export interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(
          location.pathname + location.search,
        )}`}
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};