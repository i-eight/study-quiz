export interface QuestionsResponse {
  questions: Question[];
}

export interface Question {
  question: string;
  choices: string[];
  answer: number;
}
