import type { ReactNode } from "react";
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="pageHeader"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}
export function Card({ children, className="" }: { children: ReactNode; className?: string }) { return <section className={`card ${className}`}>{children}</section>; }
export function Badge({ children, tone="neutral" }: { children: ReactNode; tone?: "success"|"warning"|"danger"|"info"|"neutral" }) { return <span className={`badge ${tone}`}>{children}</span>; }
