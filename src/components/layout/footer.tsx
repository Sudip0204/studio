import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EcoCityLogo } from "../icons";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <EcoCityLogo className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">
                EcoCity
              </span>
            </Link>
            <p className="text-sm">
              Making waste management easy and rewarding for a sustainable future.
            </p>
            <div className="flex gap-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-primary" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-primary" /></Link>
              <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 hover:text-primary" /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/recycling-guides" className="hover:text-primary">Recycling Guides</Link></li>
              <li><Link href="/recycling-centers" className="hover:text-primary">Find Centers</Link></li>
              <li><Link href="/marketplace" className="hover:text-primary">Marketplace</Link></li>
              <li><Link href="/rewards" className="hover:text-primary">Rewards</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-sm font-semibold uppercase tracking-wider text-foreground">About</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary">Our Mission</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Partners</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-sm font-semibold uppercase tracking-wider text-foreground">Newsletter</h3>
            <p className="mt-4 text-sm">Subscribe to get our latest updates.</p>
            <form className="mt-2 flex gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1 bg-background" />
              <Button type="submit" variant="secondary">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} EcoCity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
