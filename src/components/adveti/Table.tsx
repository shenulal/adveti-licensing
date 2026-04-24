import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: React.ReactNode;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
  align?: "start" | "center" | "end";
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: React.ReactNode;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyMessage = "No records found",
  className,
}: TableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a: any, b: any) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-border-default bg-surface-0",
        className,
      )}
    >
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface-50 border-b border-border-default">
          <tr>
            {columns.map((col) => {
              const key = String(col.key);
              const active = sortKey === key;
              return (
                <th
                  key={key}
                  scope="col"
                  style={{ width: col.width }}
                  className={cn(
                    "px-4 py-3 font-semibold text-ink-primary text-xs uppercase tracking-wider",
                    col.align === "end" && "text-end",
                    col.align === "center" && "text-center",
                    !col.align && "text-start",
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(key)}
                      className="inline-flex items-center gap-1 hover:text-navy-800 focus-ring rounded"
                    >
                      {col.header}
                      <span className="flex flex-col">
                        <ChevronUp
                          size={10}
                          className={cn(
                            "-mb-0.5",
                            active && sortDir === "asc"
                              ? "text-navy-800"
                              : "text-ink-muted",
                          )}
                        />
                        <ChevronDown
                          size={10}
                          className={cn(
                            "-mt-0.5",
                            active && sortDir === "desc"
                              ? "text-navy-800"
                              : "text-ink-muted",
                          )}
                        />
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-ink-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-border-default last:border-0 transition-colors duration-fast",
                  onRowClick && "cursor-pointer hover:bg-surface-50",
                )}
              >
                {columns.map((col) => {
                  const key = String(col.key);
                  return (
                    <td
                      key={key}
                      className={cn(
                        "px-4 py-3 text-ink-primary",
                        col.align === "end" && "text-end",
                        col.align === "center" && "text-center",
                      )}
                    >
                      {col.render ? col.render(row) : (row as any)[key]}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
