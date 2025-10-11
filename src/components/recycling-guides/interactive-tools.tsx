import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Calculator, FileText, Download } from "lucide-react";

const tools = [
  {
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    title: "Waste Sorting Quiz",
    description: "Test your recycling knowledge and become a sorting expert.",
    href: "#",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Recycling Symbol Guide",
    description: "A quick guide to decode all the different recycling symbols on packaging.",
    href: "#",
  },
  {
    icon: <Download className="h-8 w-8 text-primary" />,
    title: "Downloadable PDF Guides",
    description: "Get print-friendly versions of our most popular disposal guides.",
    href: "#",
  },
];

export function InteractiveTools() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Interactive Tools</div>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
            Sharpen Your Green Skills
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Engage with our tools to make learning about sustainability fun and practical.
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link href={tool.href} key={tool.title} className="group">
              <Card className="h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <CardHeader>
                  {tool.icon}
                  <CardTitle className="mt-4 font-headline">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {tool.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
