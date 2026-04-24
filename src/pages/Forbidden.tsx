import { Link } from "react-router-dom";
import { Button } from "@/components/adveti";
import { ShieldAlert } from "lucide-react";

const Forbidden = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
    <div className="max-w-md text-center">
      <span className="h-14 w-14 inline-flex items-center justify-center rounded-full bg-danger-100 text-danger-600 mb-4">
        <ShieldAlert size={26} />
      </span>
      <h1 className="text-3xl font-bold text-ink-primary">403 — Forbidden</h1>
      <p className="mt-2 text-ink-secondary">
        Your account does not have permission to view this page.
      </p>
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/">
          <Button variant="primary">Back to home</Button>
        </Link>
        <Link to="/auth/login">
          <Button variant="secondary">Switch account</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default Forbidden;