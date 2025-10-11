
"use client";

import { useState } from 'react';
import { quizQuestions, QuizQuestion } from '@/app/recycling-guides/quiz-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { CheckCircle, XCircle, RotateCw } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export function WasteSortingQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const image = PlaceHolderImages.find(p => p.id === currentQuestion.imageId);

  const handleNext = () => {
    if (!isAnswered) {
      // Check answer
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
      setIsAnswered(true);
    } else {
      // Move to next question or finish quiz
      setSelectedAnswer(null);
      setIsAnswered(false);
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizFinished(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  if (quizFinished) {
    return (
      <div className="text-center p-8">
        <CardTitle className="text-2xl font-headline mb-4">Quiz Complete!</CardTitle>
        <CardDescription className="text-lg mb-6">
          You scored {score} out of {quizQuestions.length}.
        </CardDescription>
        <div className="flex justify-center">
            <Button onClick={handleRestart}><RotateCw className="mr-2"/>Restart Quiz</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
            <p className="text-sm font-semibold text-primary">Score: {score}</p>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Card>
        <CardHeader>
            <div className="relative aspect-video w-full max-w-sm mx-auto rounded-md overflow-hidden mb-4">
                {image && (
                    <Image
                        src={image.imageUrl}
                        alt={currentQuestion.question}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                    />
                )}
            </div>
          <CardTitle className="text-xl font-semibold text-center">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswer || undefined}
            onValueChange={setSelectedAnswer}
            disabled={isAnswered}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = option === selectedAnswer;
              let stateClass = '';
              if (isAnswered) {
                if (isCorrect) stateClass = 'bg-green-100 border-green-400';
                else if (isSelected && !isCorrect) stateClass = 'bg-red-100 border-red-400';
              }
              
              return (
                <Label
                  key={option}
                  htmlFor={option}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors",
                     !isAnswered && "hover:bg-muted/50",
                    isSelected && !isAnswered && "bg-muted",
                    stateClass
                  )}
                >
                  <RadioGroupItem value={option} id={option} />
                  <span>{option}</span>
                   {isAnswered && isCorrect && <CheckCircle className="ml-auto text-green-600" />}
                   {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto text-red-600" />}
                </Label>
              );
            })}
          </RadioGroup>
          
          {isAnswered && (
             <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                <p className="font-semibold">{selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite!'}</p>
                <p className="text-sm text-muted-foreground mt-1">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={handleNext} disabled={!selectedAnswer}>
              {isAnswered ? 'Next' : 'Check Answer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
