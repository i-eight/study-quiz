'use client';

import { useState } from 'react';
import CameraComponent from '../components/CameraComponent';
import QuestionGenerator from '../components/QuestionGenerator';
import QuizComponent from '../components/QuizComponent';
import ResultsComponent from '../components/ResultsComponent';
import { Question, QuestionsResponse } from './types';

export interface QuizState {
  questions: Question[];
  userAnswers: number[];
  currentQuestionIndex: number;
  isComplete: boolean;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    userAnswers: [],
    currentQuestionIndex: 0,
    isComplete: false,
  });

  const handleImageCapture = (imageData: string) => {
    setImage(imageData);
  };

  const handleGenerateQuestions = async () => {
    if (!image) return;

    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate the API call with a timeout
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = (await response.json()) as QuestionsResponse;

      setQuizState({
        questions: data.questions,
        userAnswers: Array<number>(data.questions.length).fill(-1),
        currentQuestionIndex: 0,
        isComplete: false,
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      // In a real app, you would show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizState((prev) => {
      const newUserAnswers = [...prev.userAnswers];
      newUserAnswers[questionIndex] = answerIndex;

      // If this is the last question, mark the quiz as complete
      const isComplete = questionIndex === prev.questions.length - 1;

      return {
        ...prev,
        userAnswers: newUserAnswers,
        currentQuestionIndex: isComplete
          ? prev.currentQuestionIndex
          : prev.currentQuestionIndex + 1,
        isComplete,
      };
    });
  };

  const handleReset = () => {
    setImage(null);
    setQuizState({
      questions: [],
      userAnswers: [],
      currentQuestionIndex: 0,
      isComplete: false,
    });
  };

  // Determine which component to show based on the current state
  const renderContent = () => {
    if (!image) {
      return <CameraComponent onCapture={handleImageCapture} />;
    }

    if (quizState.questions.length === 0) {
      return (
        <QuestionGenerator
          image={image}
          onGenerate={handleGenerateQuestions}
          isLoading={isLoading}
          onReset={handleReset}
        />
      );
    }

    if (!quizState.isComplete) {
      return <QuizComponent quizState={quizState} onAnswer={handleAnswer} />;
    }

    return <ResultsComponent quizState={quizState} onReset={handleReset} />;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-blue-600 py-6 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Study Quiz App</h1>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="container mx-auto max-w-2xl px-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
