'use client';
import { useState } from 'react';

// Import question types from workflow
import { QuestionType, QuestionKind } from '../app/api/generate-questions/workflow';

interface QuestionGeneratorProps {
  image: string;
  onGenerate: (questionType: QuestionType) => Promise<void>;
  isLoading: boolean;
  onReset: () => void;
}

// Question type descriptions
const questionTypeDescriptions: Record<QuestionType, string> = {
  words: '英単語の意味を当てる選択問題',
  cloze: '英単語のスペルを意識する穴埋め問題',
  sentence: '短文の内容理解を問う選択問題',
  translation: '英文の和訳を問う選択問題',
};

export default function QuestionGenerator({
  image,
  onGenerate,
  isLoading,
  onReset,
}: QuestionGeneratorProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>('words');
  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">画像から問題を生成</h2>

      <div className="mb-4">
        <div className="relative">
          <img
            src={image}
            alt="Captured textbook page"
            className="w-full rounded-lg border border-gray-300"
          />
          <button
            onClick={onReset}
            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md"
            aria-label="Reset"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-medium">問題タイプを選択</h3>
<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
  {QuestionKind.map((type) => (
    <button
      key={type}
      onClick={() => setSelectedType(type)}
      className={`h-full rounded-md px-3 py-2 text-center text-sm transition-colors ${
        selectedType === type
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {questionTypeDescriptions[type]}
    </button>
  ))}
</div>
        <p className="mt-2 text-sm text-gray-600">
          {selectedType === 'words' && '特に学習が必要と予想できる英単語を抜き出して、英単語の正しい意味を当てる選択肢問題を生成します。'}
          {selectedType === 'cloze' && '英単語のスペルを意識できるように、テキストから選んだ単語を隠した穴埋め問題を生成します。'}
          {selectedType === 'sentence' && '読解力を養うために、テキストから抜き出した短文の内容理解を問う選択問題を生成します。'}
          {selectedType === 'translation' && '読解力を鍛えるために、テキストの内容に関連した英文の和訳を問う選択問題を生成します。'}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onGenerate(selectedType)}
          disabled={isLoading}
          className={`btn btn-primary flex items-center justify-center ${
            isLoading ? 'cursor-not-allowed opacity-70' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="-ml-1 mr-3 size-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              問題を生成中...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 size-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              問題を生成する
            </>
          )}
        </button>
      </div>
    </div>
  );
}
