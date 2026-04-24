import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "@/components/adveti";
import { LangProvider } from "@/hooks/useLang";
import { AuthProvider } from "@/auth/AuthContext";
import { RoleGuard } from "@/auth/RoleGuard";
import PublicShell from "@/shells/PublicShell";
import PortalShell from "@/shells/PortalShell";
import BackOfficeShell from "@/shells/BackOfficeShell";
import Home from "@/pages/public/Home";
import Login from "@/pages/auth/Login";
import Forbidden from "@/pages/Forbidden";
import NotFound from "./pages/NotFound";
import Placeholder from "@/pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <BrowserRouter>
        <LangProvider>
          <AuthProvider>
            <Routes>
              {/* ===== Public marketing shell ===== */}
              <Route element={<PublicShell />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<Placeholder title="About the Licence" />} />
                <Route path="/eligibility" element={<Placeholder title="Eligibility" />} />
                <Route path="/fees" element={<Placeholder title="Fees & Process" />} />
                <Route path="/contact" element={<Placeholder title="Contact" />} />
                <Route path="/verify" element={<Placeholder title="QR Licence Verification" />} />
                <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
                <Route path="/terms" element={<Placeholder title="Terms & Conditions" />} />
                <Route path="/refund-policy" element={<Placeholder title="Refund Policy" />} />
                <Route path="/accessibility" element={<Placeholder title="Accessibility Statement" />} />
              </Route>

              {/* ===== Auth (standalone, no shell) ===== */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/mfa" element={<Placeholder title="MFA Verification" />} />
              <Route path="/auth/reset-password" element={<Placeholder title="Reset Password" />} />
              <Route path="/auth/reset-password/:token" element={<Placeholder title="Set New Password" />} />
              <Route path="/auth/lockout" element={<Placeholder title="Account Locked" />} />
              <Route path="/auth/welcome" element={<Placeholder title="Welcome" />} />

              {/* ===== Applicant portal ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["applicant"]}>
                    <PortalShell />
                  </RoleGuard>
                }
              >
                <Route path="/portal" element={<Navigate to="/portal/dashboard" replace />} />
                <Route path="/portal/dashboard" element={<Placeholder title="Applicant Dashboard" />} />
                <Route path="/portal/apply" element={<Placeholder title="Start New Application" />} />
                <Route path="/portal/apply/:id/step/:n" element={<Placeholder title="Application Wizard" />} />
                <Route path="/portal/applications" element={<Placeholder title="Application History" />} />
                <Route path="/portal/applications/:id" element={<Placeholder title="Application Detail" />} />
                <Route path="/portal/applications/:id/documents" element={<Placeholder title="Document Upload" />} />
                <Route path="/portal/applications/:id/payment" element={<Placeholder title="Payment" />} />
                <Route path="/portal/applications/:id/payment/receipt" element={<Placeholder title="Payment Receipt" />} />
                <Route path="/portal/certificate/:id" element={<Placeholder title="Certificate Download" />} />
                <Route path="/portal/profile" element={<Placeholder title="Profile Settings" />} />
                <Route path="/portal/notifications" element={<Placeholder title="Notification Centre" />} />
              </Route>

              {/* ===== Assessor ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["assessor", "senior_assessor", "appeals_officer"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/assessor/queue" element={<Placeholder title="Review Queue" />} />
                <Route path="/assessor/applications/:id" element={<Placeholder title="Application Review" />} />
                <Route path="/assessor/applications/:id/rubric" element={<Placeholder title="Rubric Checklist" />} />
                <Route path="/assessor/applications/:id/decision" element={<Placeholder title="Decision Capture" />} />
              </Route>

              {/* ===== Senior assessor ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["senior_assessor", "system_admin", "super_admin"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/senior/queue" element={<Placeholder title="Approval Queue" />} />
                <Route path="/senior/applications/:id/approve" element={<Placeholder title="Approve / Override" />} />
                <Route path="/senior/reports" element={<Placeholder title="Senior Reports" />} />
              </Route>

              {/* ===== Finance ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["finance_officer", "system_admin", "super_admin"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/finance/reconciliation" element={<Placeholder title="Reconciliation Dashboard" />} />
                <Route path="/finance/refunds" element={<Placeholder title="Refund Approval Queue" />} />
                <Route path="/finance/reports" element={<Placeholder title="Revenue Reports" />} />
                <Route path="/finance/vat" element={<Placeholder title="VAT Return Export" />} />
              </Route>

              {/* ===== Admin ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["system_admin", "super_admin"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/admin/users" element={<Placeholder title="User Management" />} />
                <Route path="/admin/roles" element={<Placeholder title="Role & Permission Editor" />} />
                <Route path="/admin/categories" element={<Placeholder title="Licence Category Config" />} />
                <Route path="/admin/rubrics" element={<Placeholder title="Rubric Builder" />} />
                <Route path="/admin/config" element={<Placeholder title="System Configuration" />} />
                <Route path="/admin/flags" element={<Placeholder title="Feature Flags" />} />
                <Route path="/admin/calendar" element={<Placeholder title="Working Calendar" />} />
                <Route path="/admin/security" element={<Placeholder title="Security Settings" />} />
                <Route path="/admin/suspension" element={<Placeholder title="Suspension / Revocation" />} />
                <Route path="/admin/dsr" element={<Placeholder title="DSR Workflow" />} />
                <Route path="/admin/breach" element={<Placeholder title="Breach Notification" />} />
                <Route path="/admin/api" element={<Placeholder title="API Key Management" />} />
                <Route path="/admin/webhooks" element={<Placeholder title="Webhook Configuration" />} />
                <Route path="/admin/api-docs" element={<Placeholder title="API Documentation Portal" />} />
              </Route>

              {/* ===== Content ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["content_editor", "system_admin", "super_admin"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/content/pages" element={<Placeholder title="CMS Page Editor" />} />
                <Route path="/content/media" element={<Placeholder title="Media Library" />} />
                <Route path="/content/faqs" element={<Placeholder title="FAQ Manager" />} />
                <Route path="/content/templates" element={<Placeholder title="Notification Templates" />} />
                <Route path="/content/seo" element={<Placeholder title="Meta Tag Editor" />} />
              </Route>

              {/* ===== Reports ===== */}
              <Route
                element={
                  <RoleGuard
                    allowedRoles={[
                      "senior_assessor",
                      "finance_officer",
                      "system_admin",
                      "super_admin",
                      "auditor",
                    ]}
                  >
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/reports/operational" element={<Placeholder title="Operational Dashboard" />} />
                <Route path="/reports/decisions" element={<Placeholder title="Decision Ratio Report" />} />
                <Route path="/reports/exports" element={<Placeholder title="Data Export" />} />
              </Route>

              {/* ===== Audit ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["system_admin", "super_admin", "auditor"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/audit/log" element={<Placeholder title="Audit Log Search" />} />
                <Route path="/audit/consent" element={<Placeholder title="Consent Log" />} />
                <Route path="/audit/dsr" element={<Placeholder title="DSR Register" />} />
              </Route>

              {/* ===== Errors ===== */}
              <Route path="/403" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LangProvider>
      </BrowserRouter>
    </ToastProvider>
  </QueryClientProvider>
);

export default App;
