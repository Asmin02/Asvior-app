import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

export function TabBar({ items, pathname }: { items: TabItem[]; pathname: string }) {
  return (
    <nav aria-label="Main navigation" className="asv-tabbar">
      {items.map((item) => {
        const isActive = item.match
          ? item.match(pathname)
          : item.to === "/"
            ? pathname === "/"
            : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive ? "page" : undefined}
            className={cn("asv-tab", isActive && "asv-tab--active")}
          >
            <span className="asv-tab-icon-wrap">
              <Icon className="asv-tab-icon" strokeWidth={isActive ? 2.25 : 2} />
            </span>
            <span className="asv-tab-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
