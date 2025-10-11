import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Privacy Policy</CardTitle>
          <CardDescription>Your privacy is important to us.</CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h3 className="text-foreground">Introduction</h3>
            <p>Welcome to EcoCity. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
            
            <h3 className="text-foreground">Information We Collect</h3>
            <p>We collect personal information that you voluntarily provide to us when you register on the app, express an interest in obtaining information about us or our products and services, when you participate in activities on the app or otherwise when you contact us.</p>
            
            <h3 className="text-foreground">How We Use Your Information</h3>
            <p>We use personal information collected via our app for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            
            <h3 className="text-foreground">Will Your Information Be Shared?</h3>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

            <h3 className="text-foreground">Contact Us</h3>
            <p>If you have questions or comments about this policy, you may email us at <a href="mailto:privacy@ecocity.com" className="text-primary hover:underline">privacy@ecocity.com</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
