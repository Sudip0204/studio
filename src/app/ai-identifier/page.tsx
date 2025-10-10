"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Info, Search, Pin, Camera } from "lucide-react";
import { aiWasteClassification, AiWasteClassificationOutput } from '@/ai/flows/ai-waste-classification';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function AiIdentifierPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<AiWasteClassificationOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setClassificationResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClassify = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please upload an image to classify."
      });
      return;
    }

    setIsClassifying(true);
    setClassificationResult(null);

    try {
      const result = await aiWasteClassification({ photoDataUri: selectedImage });
      setClassificationResult(result);
    } catch (error) {
      console.error("AI Classification Error:", error);
      toast({
        variant: "destructive",
        title: "Classification Failed",
        description: "The AI model could not process the image. Please try again."
      });
    } finally {
      setIsClassifying(false);
    }
  };
  
  const googleSearchUrl = classificationResult?.isWaste ? 
    `https://www.google.com/search?q=${encodeURIComponent(classificationResult.wasteType)}&tbm=isch` : null;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">AI Waste Identifier</CardTitle>
            <CardDescription className="text-lg">
              Upload a photo of a waste item, and our AI will classify it and tell you how to dispose of it properly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="bg-muted rounded-lg p-4 border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-md flex items-center justify-center">
                {selectedImage ? (
                  <Image src={selectedImage} alt="Selected waste item" layout="fill" objectFit="contain" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="mx-auto h-12 w-12" />
                    <p className="mt-2 font-semibold">Click to upload an image</p>
                    <p className="text-sm">or drag and drop</p>
                  </div>
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" 
              />
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleClassify} disabled={isClassifying || !selectedImage} size="lg">
                {isClassifying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-5 w-5" />
                    Classify Waste
                  </>
                )}
              </Button>
            </div>

            {classificationResult && (
              <Card className="mt-6 bg-background/50">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Classification Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {classificationResult.isWaste ? (
                    <>
                      <div>
                        <h3 className="font-semibold text-lg text-primary">{classificationResult.wasteType}</h3>
                        <p className="text-muted-foreground mt-1">{classificationResult.disposalInstructions}</p>
                      </div>
                      <Separator />
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild variant="outline" className="flex-1">
                          <a href={googleSearchUrl!} target="_blank" rel="noopener noreferrer">
                            <Search className="mr-2" /> View similar images
                          </a>
                        </Button>
                        <Button asChild className="flex-1">
                          <Link href="/recycling-centers">
                            <Pin className="mr-2" /> Find nearest center
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Not a Waste Product</AlertTitle>
                        <AlertDescription>
                           {classificationResult.disposalInstructions}
                        </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
