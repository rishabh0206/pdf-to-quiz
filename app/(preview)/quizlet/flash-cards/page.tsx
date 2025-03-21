"use client"

import FlashCard from "@/components/flash-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { flashCardsSchema } from "@/lib/schemas";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

type QuizProps = {
};

export default function Quiz({
}: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  const [flashCards, setFlashCards] = useState<z.infer<typeof flashCardsSchema>>(
    [],
  );


  useEffect(() => {
    const flashCards = localStorage.getItem("flash-cards")
    if (flashCards) {
      setFlashCards(JSON.parse(flashCards));
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentQuestionIndex / flashCards.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, flashCards.length]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < flashCards.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const currentQuestion = flashCards[currentQuestionIndex];

  if (flashCards.length === 0) {
    return <></>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="relative">
          {!isSubmitted && <Progress value={progress} className="h-1 mb-8" />}
          <div className="min-h-[400px]">
            {" "}
            {/* Prevent layout shift */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isSubmitted ? "results" : currentQuestionIndex}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  <FlashCard
                    question={currentQuestion}
                  />
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      variant="ghost"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <span className="text-sm font-medium">
                      {currentQuestionIndex + 1} / {flashCards.length}
                    </span>
                    <Button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === flashCards.length - 1}
                      variant="ghost"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
