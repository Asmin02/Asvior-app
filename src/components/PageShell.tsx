import type { ReactNode } from "react";
import { TopBar, ProfileAvatar, AppPageHeader } from "@/components/asvior";
import { EmptyState, LoadingRows } from "@/components/asvior/EmptyState";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  showBrandHeader = true,
  headerLeftAction,
  headerRightAction,
  showProfileAvatar = false,
  profileTo,
}: {
  children: ReactNode;
  phase?: string;
  className?: string;
  showBrandHeader?: boolean;
  headerLeftAction?: ReactNode;
  headerRightAction?: ReactNode;
  showProfileAvatar?: boolean;
  profileTo?: string;
}) {
  const right =
    headerRightAction ??
    (showProfileAvatar ? (
      <ProfileAvatar to={profileTo ?? "/auth"} variant="solid" />
    ) : undefined);

  return (
    <div className={cn("asv-page", className)}>
      {showBrandHeader && <TopBar left={headerLeftAction} right={right} />}
      {children}
    </div>
  );
}

export function PageHeader({
  badge,
  title,
  subtitle,
  action,
  overline,
}: {
  badge?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  overline?: ReactNode;
}) {
  return (
    <AppPageHeader
      overline={overline}
      badge={badge}
      title={title}
      subtitle={subtitle}
      action={action}
    />
  );
}

export function PageBadge({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "champagne" | "primary";
}) {
  return (
    <span className="asv-chip asv-chip--active inline-flex">
      {icon}
      {children}
    </span>
  );
}

export function EmptyStateCard({
  icon,
  title,
  description,
  action,
  illustration,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  illustration?: string;
}) {
  void illustration;
  return (
    <EmptyState
      icon={icon ?? <span className="text-2xl">✦</span>}
      title={title}
      description={description}
      action={action}
    />
  );
}

export { LoadingRows as LoadingSkeleton };
