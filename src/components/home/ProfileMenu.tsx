import { Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  Settings,
  Luggage,
  SlidersHorizontal,
  LifeBuoy,
  Info,
  LogIn,
  LogOut,
  Bell,
  Languages,
  Moon,
  History,
  Compass,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const GROUPS: Array<Array<{ to: string; label: string; icon: typeof User }>> = [
  [
    { to: "/profile", label: "Profile", icon: User },
    { to: "/profile", label: "Account", icon: ShieldCheck },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  [
    { to: "/trips", label: "Saved trips", icon: Luggage },
    { to: "/history", label: "Recent searches", icon: History },
    { to: "/favorites", label: "Continue planning", icon: Compass },
  ],
  [
    { to: "/settings", label: "Preferences", icon: SlidersHorizontal },
    { to: "/settings", label: "Language", icon: Languages },
    { to: "/settings", label: "Theme", icon: Moon },
    { to: "/settings", label: "Notifications", icon: Bell },
  ],
  [
    { to: "/support", label: "Help & Support", icon: LifeBuoy },
    { to: "/about", label: "About Asvior", icon: Info },
  ],
];

export function ProfileMenu({
  signedIn,
  name,
  email,
}: {
  signedIn: boolean;
  name: string | null;
  email: string | null;
}) {
  const navigate = useNavigate();
  const initial = (name || email || "").trim().charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="spring-press inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-sm font-semibold text-foreground shadow-sm outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {signedIn && initial ? initial : <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="max-h-[70vh] w-64 overflow-y-auto rounded-2xl p-1.5"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {signedIn ? name || "Traveller" : "Welcome to Asvior"}
          </p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {signedIn ? email || "Signed in" : "Sign in to sync your trips"}
          </p>
        </DropdownMenuLabel>

        {GROUPS.map((group, gi) => (
          <div key={gi}>
            <DropdownMenuSeparator />
            {group.map(({ to, label, icon: Icon }) => (
              <DropdownMenuItem key={label} asChild className="rounded-xl px-3 py-2.5">
                <Link to={to}>
                  <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                  <span className="text-sm">{label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        ))}

        <DropdownMenuSeparator />
        {signedIn ? (
          <DropdownMenuItem
            className="rounded-xl px-3 py-2.5 text-destructive focus:text-destructive"
            onSelect={() => {
              void supabase.auth.signOut();
            }}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            <span className="text-sm">Log out</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="rounded-xl px-3 py-2.5"
            onSelect={() => {
              void navigate({ to: "/auth" });
            }}
          >
            <LogIn className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
            <span className="text-sm">Sign in</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
