'use client';

import { useState } from 'react';
import { QuizState } from '../app/page';

interface QuizComponentProps {
  quizState: QuizState;
  onAnswer: (questionIndex: number, answerIndex: number) => void;
}

export default function QuizComponent({
  quizState,
  onAnswer,
}: QuizComponentProps) {
  const { questions, userAnswers, currentQuestionIndex } = quizState;
  const currentQuestion = questions[currentQuestionIndex];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(() => {
    if (userAnswers?.[currentQuestionIndex] !== undefined) {
      const answer = userAnswers[currentQuestionIndex];
      return answer >= 0 ? answer : null;
    }
    return null;
  });

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswer(currentQuestionIndex, selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          問題 {currentQuestionIndex + 1}/{questions.length}
        </h2>
        <div className="text-sm text-gray-500">
          {Array.from({ length: questions.length }).map((_, index) => (
            <span
              key={index}
              className={`mx-1 inline-block size-3 rounded-full ${
                index < currentQuestionIndex
                  ? 'bg-green-500'
                  : index === currentQuestionIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-4 text-lg font-medium">{currentQuestion?.question}</p>

        <div className="space-y-3">
          {currentQuestion?.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`mr-3 flex size-6 items-center justify-center rounded-full ${
                    selectedAnswer === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{choice}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className={`btn btn-primary ${
            selectedAnswer === null ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {currentQuestionIndex === questions.length - 1
            ? '結果を見る'
            : '次へ'}
        </button>
      </div>
    </div>
  );
}
