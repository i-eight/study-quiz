'use client';

interface QuestionGeneratorProps {
  image: string;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
  onReset: () => void;
}

export default function QuestionGenerator({
  image,
  onGenerate,
  isLoading,
  onReset,
}: QuestionGeneratorProps) {
  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">画像から問題を生成</h2>

      <div className="mb-6">
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

      <div className="flex justify-center">
        <button
          onClick={onGenerate}
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
