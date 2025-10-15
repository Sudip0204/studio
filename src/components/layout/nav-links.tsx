
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { EcoCityLogo } from "../icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recycling-guides", label: "Recycling Guides" },
  { href: "/ai-identifier", label: "AI Identifier" },
  { href: "/carbon-calculator", label: "Carbon Calculator" },
  { href: "/recycling-centers", label: "Recycling Centers" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/gamification", label: "Gamification" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "transition-colors hover:text-primary",
            pathname === link.href ? "text-primary" : "text-foreground/70"
          )}
          prefetch={false}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNavLinks() {
    const pathname = usePathname();
    return (
        <nav className="grid gap-6 text-lg font-medium">
            <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
            prefetch={false}
            >
            <EcoCityLogo className="h-6 w-6 text-primary" />
            <span className="font-headline">EcoCity</span>
            </Link>
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    "transition-colors hover:text-primary",
                    pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                prefetch={false}
                >
                {link.label}
                </Link>
            ))}
        </nav>
    );
}
