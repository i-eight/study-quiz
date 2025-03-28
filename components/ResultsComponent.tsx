'use client';

import { QuizState } from '../app/page';
import React, { useState } from 'react';

interface ResultsComponentProps {
  quizState: QuizState;
  onReset: () => void;
}

export default function ResultsComponent({
  quizState,
  onReset,
}: ResultsComponentProps) {
  const { questions, userAnswers, explanations } = quizState;
  const [activeExplanationIndex, setActiveExplanationIndex] = useState<
    number | null
  >(null);

  // Calculate score
  const correctAnswers = questions.filter(
    (question, index) => question.answer === userAnswers[index],
  ).length;

  const score = Math.round((correctAnswers / questions.length) * 100);

  // Determine feedback based on score
  const getFeedback = () => {
    if (score >= 90) return '素晴らしい！';
    if (score >= 70) return '良くできました！';
    if (score >= 50) return 'もう少し頑張りましょう！';
    return '復習が必要です。';
  };

  return (
    <div className="card">
      <h2 className="mb-6 text-xl font-bold">クイズ結果</h2>

      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex size-32 items-center justify-center rounded-full bg-blue-100">
          <span className="text-3xl font-bold text-blue-600">{score}%</span>
        </div>
        <p className="text-lg font-medium">{getFeedback()}</p>
        <p className="text-gray-600">
          {questions.length}問中{correctAnswers}問正解
        </p>
      </div>

      <div className="mb-8 space-y-6">
        <h3 className="text-lg font-semibold">解答詳細</h3>

        {questions.map((question, index) => {
          const isCorrect = question.answer === userAnswers[index];

          return (
            <div
              key={index}
              className={`rounded-lg border p-4 ${
                isCorrect
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <p className="mb-2 font-medium">
                {index + 1}. {question.question}
              </p>

              <div className="mb-2 space-y-1">
                {question.choices.map((choice, choiceIndex) => (
                  <div
                    key={choiceIndex}
                    className={`rounded px-3 py-2 ${
                      choiceIndex === question.answer
                        ? 'bg-green-200 text-green-800'
                        : choiceIndex === userAnswers[index] &&
                            choiceIndex !== question.answer
                          ? 'bg-red-200 text-red-800'
                          : 'bg-gray-100'
                    }`}
                  >
                    <span className="inline-block w-6">
                      {String.fromCharCode(65 + choiceIndex)}.
                    </span>
                    {choice}
                    {choiceIndex === question.answer && (
                      <span className="ml-2 text-green-600">✓ 正解</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                className={`mt-2 rounded border px-4 py-2 text-sm ${
                  explanations?.[index]?.text &&
                  explanations[index].text.length > 0
                    ? 'border-blue-500 bg-transparent text-blue-600 hover:bg-blue-50'
                    : 'cursor-not-allowed border-gray-300 bg-transparent text-gray-400'
                }`}
                onClick={() => {
                  if (
                    explanations?.[index]?.text &&
                    explanations[index].text.length > 0
                  ) {
                    setActiveExplanationIndex(index);
                  }
                }}
                disabled={
                  !explanations?.[index]?.text ||
                  explanations[index].text.length === 0
                }
              >
                解説
              </button>
              {activeExplanationIndex === index &&
                explanations?.[index]?.text && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50"
                    onClick={() => setActiveExplanationIndex(null)}
                  >
                    <div
                      className="mx-4 rounded bg-white p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="mb-2 text-lg font-bold">解説</h2>
                      {explanations[index].text.map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                      <div className="mt-4 flex justify-center">
                        <button
                          className="rounded bg-blue-500 px-4 py-2 text-sm text-white"
                          onClick={() => setActiveExplanationIndex(null)}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button onClick={onReset} className="btn btn-primary">
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
}
