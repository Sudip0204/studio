import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Contact Us</CardTitle>
          <CardDescription>We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            For any inquiries, feedback, or support, please reach out to us at <a href="mailto:contact@ecocity.com" className="text-primary hover:underline">contact@ecocity.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
