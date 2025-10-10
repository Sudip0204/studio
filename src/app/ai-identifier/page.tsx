"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Info, Search, Pin } from "lucide-react";
import { aiWasteClassification, AiWasteClassificationOutput } from '@/ai/flows/ai-waste-classification';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function AiIdentifierPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<AiWasteClassificationOutput | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API is not supported in this browser.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsClassifying(true);
    setClassificationResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await aiWasteClassification({ photoDataUri });
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
              Snap a photo of a waste item, and our AI will classify it and tell you how to dispose of it properly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Alert variant="destructive" className="w-auto">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access to use this feature.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            
            <div className="flex justify-center">
              <Button onClick={captureImage} disabled={isClassifying || !hasCameraPermission} size="lg">
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