export interface QuestionsResponse {
  questions: Question[];
}

export interface Question {
  question: string;
  choices: string[];
  answer: number;
}

export interface ExplanationsResponse {
  explanations: Explanation[];
}

export interface Explanation {
  text: string;
}
