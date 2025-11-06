
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Info, Search, Pin, Camera, Recycle, Trash2 } from "lucide-react";
import { aiWasteClassification, AiWasteClassificationOutput } from '@/ai/flows/ai-waste-classification';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// Particle background component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const numberOfParticles = 50;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      angle: number;
      spin: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2; // Leaf size
        this.speedY = Math.random() * 1.5 + 0.5; // Fall speed
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 0.1;
      }

      update() {
        this.y += this.speedY;
        this.angle += this.spin;
        if (this.y > canvas.height) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        // Simple leaf shape
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size / 2, -this.size / 2, 0, 0);
        ctx.quadraticCurveTo(-this.size / 2, -this.size / 2, 0, -this.size);
        ctx.closePath();
        ctx.fillStyle = 'rgba(46, 125, 50, 0.4)'; // Calm, translucent green
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 w-full h-full" />;
};


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
        setClassificationResult(null); // Reset result when new image is selected
        setIsClassifying(false);
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
        <ParticleBackground />

        <div className="container mx-auto py-12 px-4 flex justify-center">
            <div className="w-full max-w-4xl space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="overflow-hidden shadow-xl bg-stone-100/95 backdrop-blur-sm border-stone-200/80">
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
                                className="bg-background/50 rounded-lg p-4 border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors cursor-pointer"
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
                        </CardContent>
                    </Card>
                </motion.div>

                <AnimatePresence>
                    {(isClassifying || classificationResult) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="shadow-xl bg-stone-100/95 backdrop-blur-sm border-stone-200/80">
                                <CardHeader>
                                <CardTitle className="font-headline text-2xl">Classification Result</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                {isClassifying ? (
                                    <div className="space-y-6">
                                        <div>
                                            <Skeleton className="h-7 w-1/3 mb-2" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-2/3 mt-1" />
                                        </div>
                                        <Separator />
                                        <div className="space-y-4">
                                            <div className="flex gap-4 items-start">
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                                <div>
                                                    <Skeleton className="h-5 w-32 mb-2" />
                                                    <Skeleton className="h-4 w-full" />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-start">
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                                <div>
                                                    <Skeleton className="h-5 w-32 mb-2" />
                                                    <Skeleton className="h-4 w-full" />
                                                </div>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Skeleton className="h-10 flex-1" />
                                            <Skeleton className="h-10 flex-1" />
                                        </div>
                                    </div>
                                ) : classificationResult?.isWaste ? (
                                    <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-lg text-primary">{classificationResult.wasteType}</h3>
                                        <p className="text-muted-foreground mt-1">{classificationResult.description}</p>
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        <div className="flex gap-4 items-start">
                                        <Trash2 className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Disposal Instructions</h4>
                                            <p className="text-muted-foreground">{classificationResult.disposalInstructions}</p>
                                        </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                        <Recycle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Recycling & Reuse</h4>
                                            <p className="text-muted-foreground">{classificationResult.recyclingInfo}</p>
                                        </div>
                                        </div>
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
                                    </div>
                                ) : (
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Not a Waste Product</AlertTitle>
                                        <AlertDescription>
                                        {classificationResult?.description}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}

