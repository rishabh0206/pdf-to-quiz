"use client"

import QuestionCard from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { questionsSchema } from "@/lib/schemas";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import QuizReview from "../../../../components/quiz-overview";
import QuizScore from "../../../../components/score";

type QuizProps = {
};

export default function Quiz({
}: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    [],
  );

  const [answers, setAnswers] = useState<string[]>([]);


  useEffect(() => {
    const questions = localStorage.getItem("quiz")
    const title = localStorage.getItem("quiz-title")
    if (questions && title) {
      setQuestions(JSON.parse(questions));
      setAnswers(Array(questions.length).fill(null))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentQuestionIndex / questions.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions.length]);

  const handleSelectAnswer = (answer: string) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (question.answer === answers[index] ? 1 : 0);
    }, 0);
    setScore(correctAnswers);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setScore(null);
    setCurrentQuestionIndex(0);
    setProgress(0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (questions.length === 0) {
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
                {!isSubmitted ? (
                  <div className="space-y-8">
                    <QuestionCard
                      question={currentQuestion}
                      selectedAnswer={answers[currentQuestionIndex]}
                      onSelectAnswer={handleSelectAnswer}
                      isSubmitted={isSubmitted}
                      showCorrectAnswer={false}
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
                        {currentQuestionIndex + 1} / {questions.length}
                      </span>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={answers[currentQuestionIndex] === null}
                        variant="ghost"
                      >
                        {currentQuestionIndex === questions.length - 1
                          ? "Submit"
                          : "Next"}{" "}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <QuizScore
                      correctAnswers={score ?? 0}
                      totalQuestions={questions.length}
                    />
                    <div className="space-y-12">
                      <QuizReview questions={questions} userAnswers={answers} />
                    </div>
                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="bg-muted hover:bg-muted/80 w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
