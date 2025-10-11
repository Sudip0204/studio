
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-6 w-6" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-6 w-6" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, href: "#" },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Contact Us</CardTitle>
          <CardDescription className="text-lg">We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left side: Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="font-headline text-xl font-semibold mb-4">Get in Touch</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:contact@ecocity.com" className="hover:text-primary">contact@ecocity.com</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+91-80-1234-5678 (Mon-Fri, 9am-6pm IST)</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-headline text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map(social => (
                    <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label={social.name}>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Feedback Form */}
            <div>
              <h3 className="font-headline text-xl font-semibold mb-4">Send us a Message</h3>
              <ContactForm />
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
