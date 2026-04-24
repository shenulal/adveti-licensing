import * as React from "react";
import { useLocation } from "react-router-dom";

export interface PlaceholderProps {
  title?: string;
  description?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  title,
  description,
}) => {
  const { pathname } = useLocation();
  return (
    <div className="rounded-lg border border-dashed border-border-default bg-surface-0 p-10 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-gold-600 font-semibold">
        Route placeholder
      </p>
      <h1 className="mt-3 text-2xl font-bold text-ink-primary">
        {title ?? pathname}
      </h1>
      <p className="mt-2 text-sm text-ink-secondary">
        {description ??
          "This screen is part of the routing skeleton. Page content will be implemented in a later prompt."}
      </p>
      <code className="mt-4 inline-block text-xs bg-surface-100 px-3 py-1 rounded font-mono text-ink-secondary">
        {pathname}
      </code>
    </div>
  );
};

export default Placeholder;