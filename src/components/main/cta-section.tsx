"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";

export function CtaSection() {
  const { user } = useUser();

  // Only show this section if the user is not logged in
  if (user) {
    return null;
  }

  return (
    <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
            Start Your Eco Journey Today
          </h2>
          <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Join thousands of others in making a tangible difference. Create your free account and start earning rewards for your green habits.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-4">
            <Link href="/login">Sign Up Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
