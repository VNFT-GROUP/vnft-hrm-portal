import type { ReactNode } from "react";
import { Download, Plus } from "lucide-react";
import "./MockPage.css";

export type StatCard = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  accent?: "navy" | "orange" | "indigo" | "cyan" | "green" | "red";
};

export type TableRow = Record<string, ReactNode>;
export type TableCol = { key: string; label: string; width?: string };

type Props = {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  stats?: StatCard[];
  tableTitle?: string;
  columns?: TableCol[];
  rows?: TableRow[];
  sideTitle?: string;
  sideContent?: ReactNode;
  primaryAction?: string;
  children?: ReactNode;
};

export default function MockPage({
  icon, iconBg = "linear-gradient(135deg,#1E2062,#2E3192)",
  title, subtitle, stats = [], tableTitle, columns, rows,
  sideTitle, sideContent, primaryAction, children,
}: Props) {
  return (
    <div className="mp-root">
      {/* Header */}
      <div className="mp-header">
        <div className="mp-title-group">
          <div className="mp-icon-wrap" style={{ background: iconBg }}>{icon}</div>
          <div>
            <h1 className="mp-title">{title}</h1>
            {subtitle && <p className="mp-subtitle">{subtitle}</p>}
          </div>
        </div>
        <div className="mp-actions">
          <button className="mp-btn mp-btn-outline">
            <Download size={14} /> Xuất CSV
          </button>
          {primaryAction && (
            <button className="mp-btn mp-btn-primary">
              <Plus size={14} /> {primaryAction}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="mp-stats">
          {stats.map((s, i) => (
            <div key={i} className={`mp-stat-card accent-${s.accent ?? "navy"}`}>
              <div className="mp-stat-label">{s.label}</div>
              <div className="mp-stat-value">{s.value}</div>
              {s.delta && (
                <span className={`mp-stat-delta ${s.trend ?? "flat"}`}>
                  {s.trend === "up" ? "▲" : s.trend === "down" ? "▼" : "—"} {s.delta}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Body */}
      {children ? (
        children
      ) : (
        <div className="mp-body">
          {/* Table */}
          <div className="mp-card">
            {tableTitle && (
              <div className="mp-card-title">
                {tableTitle}
                <span>Xem tất cả →</span>
              </div>
            )}
            {columns && rows ? (
              <table className="mp-table">
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c.key} style={{ width: c.width }}>{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {columns.map((c) => (
                        <td key={c.key}>{row[c.key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="mp-coming">
                <span style={{ fontSize: "2rem" }}>🚧</span>
                <strong>Đang phát triển</strong>
                <span>Module này sẽ sớm ra mắt</span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {sideContent && (
            <div className="mp-card">
              {sideTitle && (
                <div className="mp-card-title">{sideTitle}</div>
              )}
              {sideContent}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
