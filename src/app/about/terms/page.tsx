
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Terms & Conditions</CardTitle>
          <CardDescription>Please read our terms carefully.</CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h3 className="text-foreground">1. Acceptance of Terms</h3>
            <p>By accessing or using the EcoCity application ("Service"), you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the Service.</p>
            
            <h3 className="text-foreground">2. User Accounts</h3>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

            <h3 className="text-foreground">3. Marketplace</h3>
            <p>EcoCity provides a marketplace for users to buy and sell second-hand, upcycled, or recycled goods. EcoCity is not a party to any transaction between buyers and sellers. We do not guarantee the quality, safety, or legality of items advertised.</p>

            <h3 className="text-foreground">4. Intellectual Property</h3>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of EcoCity and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.</p>

            <h3 className="text-foreground">5. Termination</h3>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h3 className="text-foreground">6. Limitation Of Liability</h3>
            <p>In no event shall EcoCity, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h3 className="text-foreground">7. Governing Law</h3>
            <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
            
            <h3 className="text-foreground">8. Changes</h3>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.</p>

            <h3 className="text-foreground">Contact Us</h3>
            <p>If you have any questions about these Terms, please <a href="/about/contact" className="text-primary hover:underline">contact us</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
