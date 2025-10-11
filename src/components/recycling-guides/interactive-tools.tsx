import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, FileText, Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WasteSortingQuiz } from "./waste-sorting-quiz";
import { RecyclingSymbolGuide } from "./recycling-symbol-guide";


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
          
          <Dialog>
            <DialogTrigger asChild>
               <Card className="h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
                <CardHeader>
                  <HelpCircle className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-4 font-headline">Waste Sorting Quiz</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Test your recycling knowledge and become a sorting expert.
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
               <DialogHeader>
                <DialogTitle className="font-headline text-2xl text-primary">Waste Sorting Quiz</DialogTitle>
              </DialogHeader>
              <WasteSortingQuiz />
            </DialogContent>
          </Dialog>
         
          <Dialog>
            <DialogTrigger asChild>
              <Card className="h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-4 font-headline">Recycling Symbol Guide</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  A quick guide to decode all the different recycling symbols on packaging.
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl text-primary">Recycling Symbol Guide</DialogTitle>
              </DialogHeader>
              <RecyclingSymbolGuide />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Card className="h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
                <CardHeader>
                  <Download className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-4 font-headline">Downloadable PDF Guides</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Get print-friendly versions of our most popular disposal guides.
                </CardContent>
              </Card>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Download Recycling Guide</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to download the "Ultimate Recycling Guide.pdf". This file is for personal use only.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  {/* The actual download link would go here. For now, it just closes the dialog. */}
                  <a href="/placeholder-guide.pdf" download>Download</a>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
}
