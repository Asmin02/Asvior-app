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

  const links = [
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/trips", label: "Saved Trips", icon: Luggage },
    { to: "/settings", label: "Preferences", icon: SlidersHorizontal },
    { to: "/support", label: "Help & Support", icon: LifeBuoy },
    { to: "/about", label: "About Asvior", icon: Info },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="spring-press inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-sm font-semibold text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {signedIn && initial ? initial : <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-60 rounded-2xl p-1.5">
        <DropdownMenuLabel className="px-3 py-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {signedIn ? name || "Traveller" : "Welcome to Asvior"}
          </p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {signedIn ? email || "Signed in" : "Sign in to sync your trips"}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map(({ to, label, icon: Icon }) => (
          <DropdownMenuItem key={label} asChild className="rounded-xl px-3 py-2.5">
            <Link to={to}>
              <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
              <span className="text-sm">{label}</span>
            </Link>
          </DropdownMenuItem>
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
            <span className="text-sm">Sign out</span>
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
