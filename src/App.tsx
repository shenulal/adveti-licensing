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
import About from "@/pages/public/About";
import Eligibility from "@/pages/public/Eligibility";
import Fees from "@/pages/public/Fees";
import Contact from "@/pages/public/Contact";
import Verify from "@/pages/public/Verify";
import Privacy from "@/pages/public/Privacy";
import Terms from "@/pages/public/Terms";
import RefundPolicy from "@/pages/public/RefundPolicy";
import Accessibility from "@/pages/public/Accessibility";
import Login from "@/pages/auth/Login";
import Mfa from "@/pages/auth/Mfa";
import ResetPassword from "@/pages/auth/ResetPassword";
import SetNewPassword from "@/pages/auth/SetNewPassword";
import Lockout from "@/pages/auth/Lockout";
import Welcome from "@/pages/auth/Welcome";
import Forbidden from "@/pages/Forbidden";
import NotFound from "./pages/NotFound";
import Placeholder from "@/pages/Placeholder";
import Dashboard from "@/pages/portal/Dashboard";
import Apply from "@/pages/portal/Apply";
import ApplyWizard from "@/pages/portal/ApplyWizard";
import ApplicationsList from "@/pages/portal/ApplicationsList";
import ApplicationDetail from "@/pages/portal/ApplicationDetail";
import Documents from "@/pages/portal/Documents";
import Payment from "@/pages/portal/Payment";
import Receipt from "@/pages/portal/Receipt";
import Certificate from "@/pages/portal/Certificate";
import Renew from "@/pages/portal/Renew";
import Profile from "@/pages/portal/Profile";
import PortalNotifications from "@/pages/portal/Notifications";
import AssessorQueue from "@/pages/assessor/Queue";
import ApplicationReview from "@/pages/assessor/ApplicationReview";
import DecisionCapture from "@/pages/assessor/DecisionCapture";
import ApprovalQueue from "@/pages/senior/ApprovalQueue";
import ApproveOverride from "@/pages/senior/ApproveOverride";
import Committee from "@/pages/senior/Committee";
import Reassign from "@/pages/senior/Reassign";
import AutoAssignmentConfig from "@/pages/senior/AutoAssignmentConfig";
import SeniorReports from "@/pages/senior/Reports";
import FinanceReconciliation from "@/pages/finance/Reconciliation";
import FinanceRefunds from "@/pages/finance/Refunds";
import FinanceReports from "@/pages/finance/Reports";
import FinanceVatReturn from "@/pages/finance/VatReturn";
import AuditLog from "@/pages/audit/AuditLog";
import ConsentLog from "@/pages/audit/ConsentLog";
import DsrRegister from "@/pages/audit/DsrRegister";
import DecisionsReport from "@/pages/audit/DecisionsReport";
import ExportsReport from "@/pages/audit/ExportsReport";
import ContentTemplates from "@/pages/content/Templates";
import OperationalDashboard from "@/pages/reports/OperationalDashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminRoles from "@/pages/admin/Roles";
import AdminCategories from "@/pages/admin/Categories";
import AdminRubrics from "@/pages/admin/Rubrics";

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
                <Route path="/about" element={<About />} />
                <Route path="/eligibility" element={<Eligibility />} />
                <Route path="/fees" element={<Fees />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/accessibility" element={<Accessibility />} />
              </Route>

              {/* ===== Auth (standalone, no shell) ===== */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/mfa" element={<Mfa />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/reset-password/:token" element={<SetNewPassword />} />
              <Route path="/auth/lockout" element={<Lockout />} />
              <Route path="/auth/welcome" element={<Welcome />} />

              {/* ===== Applicant portal ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["applicant"]}>
                    <PortalShell />
                  </RoleGuard>
                }
              >
                <Route path="/portal" element={<Navigate to="/portal/dashboard" replace />} />
                <Route path="/portal/dashboard" element={<Dashboard />} />
                <Route path="/portal/apply" element={<Apply />} />
                <Route path="/portal/apply/:id/step/:n" element={<ApplyWizard />} />
                <Route path="/portal/applications" element={<ApplicationsList />} />
                <Route path="/portal/applications/:id" element={<ApplicationDetail />} />
                <Route path="/portal/applications/:id/documents" element={<Documents />} />
                <Route path="/portal/applications/:id/payment" element={<Payment />} />
                <Route path="/portal/applications/:id/payment/receipt" element={<Receipt />} />
                <Route path="/portal/applications/:id/renew" element={<Renew />} />
                <Route path="/portal/certificate/:id" element={<Certificate />} />
                <Route path="/portal/profile" element={<Profile />} />
                <Route path="/portal/notifications" element={<PortalNotifications />} />
              </Route>

              {/* ===== Assessor ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["assessor", "senior_assessor", "appeals_officer", "system_admin", "super_admin"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/assessor/queue" element={<AssessorQueue />} />
                <Route path="/assessor/applications/:id" element={<ApplicationReview />} />
                <Route path="/assessor/applications/:id/decision" element={<DecisionCapture />} />
              </Route>

              {/* ===== Senior assessor ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["senior_assessor", "system_admin", "super_admin"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/senior/queue" element={<ApprovalQueue />} />
                <Route path="/senior/applications/:id/approve" element={<ApproveOverride />} />
                <Route path="/senior/applications/:id/committee" element={<Committee />} />
                <Route path="/senior/applications/:id/reassign" element={<Reassign />} />
                <Route path="/senior/assignment-rules" element={<AutoAssignmentConfig />} />
                <Route path="/senior/reports" element={<SeniorReports />} />
              </Route>

              {/* ===== Finance ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["finance_officer", "system_admin", "super_admin"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/finance/reconciliation" element={<FinanceReconciliation />} />
                <Route path="/finance/refunds" element={<FinanceRefunds />} />
                <Route path="/finance/reports" element={<FinanceReports />} />
                <Route path="/finance/vat" element={<FinanceVatReturn />} />
              </Route>

              {/* ===== Admin ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["system_admin", "super_admin"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/roles" element={<AdminRoles />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/rubrics" element={<AdminRubrics />} />
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
                <Route path="/content/templates" element={<ContentTemplates />} />
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
                <Route path="/reports/operational" element={<OperationalDashboard />} />
                <Route path="/reports/decisions" element={<DecisionsReport />} />
                <Route path="/reports/exports" element={<ExportsReport />} />
              </Route>

              {/* ===== Audit ===== */}
              <Route
                element={
                  <RoleGuard allowedRoles={["system_admin", "super_admin", "auditor"]}>
                    <BackOfficeShell />
                  </RoleGuard>
                }
              >
                <Route path="/audit/log" element={<AuditLog />} />
                <Route path="/audit/consent" element={<ConsentLog />} />
                <Route path="/audit/dsr" element={<DsrRegister />} />
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
