import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

export function TabBar({ items, pathname }: { items: TabItem[]; pathname: string }) {
  return (
    <nav aria-label="Main navigation" className="asv-tabbar asv-tabbar--premium">
      {items.map((item) => {
        const isActive = item.match
          ? item.match(pathname)
          : item.to === "/"
            ? pathname === "/"
            : pathname.startsWith(item.to);
        const isFeatured = item.to === "/assistant";
        const Icon = isFeatured ? MessageCircle : item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive ? "page" : undefined}
            aria-label={isFeatured ? "Asvior AI" : item.label}
            className={cn("asv-tab", isFeatured && "asv-tab--featured", isActive && "asv-tab--active")}
          >
            <span className="asv-tab-icon-wrap">
              <Icon className="asv-tab-icon" strokeWidth={isActive ? 2.25 : 2} />
            </span>
            {!isFeatured && <span className="asv-tab-label">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
