import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import * as agents from '@graphai/agents';
import { GraphAI, agentInfoWrapper } from 'graphai';
import { NextRequest, NextResponse } from 'next/server';
import { cloudVisionAgent } from '../../lib/cloudvisionAgent';
import { getWorkflow, isQuestionType, QuestionType } from './workflow';
import { Question, QuestionsResponse } from '../../types';
import { swap } from '../../lib/swap';

interface QueryResult {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Mock questions for testing
// const mockQuestions = [
//   {
//     question: '「appreciate」の意味として最も適切なものはどれですか？',
//     choices: ['感謝する', '理解する', '批評する', '無視する'],
//     answer: 0,
//   },
//   {
//     question: '「diverse」の意味として最も適切なものはどれですか？',
//     choices: ['多様な', '分散した', '分割された', '異なる'],
//     answer: 0,
//   },
//   {
//     question: '「implement」の意味として最も適切なものはどれですか？',
//     choices: ['実行する', '輸入する', '改善する', '印象づける'],
//     answer: 0,
//   },
//   {
//     question: '「substantial」の意味として最も適切なものはどれですか？',
//     choices: ['かなりの', '本質的な', '物質的な', '補助的な'],
//     answer: 0,
//   },
//   {
//     question: '「unprecedented」の意味として最も適切なものはどれですか？',
//     choices: ['前例のない', '予測できない', '理解できない', '比類のない'],
//     answer: 0,
//   },
// ] satisfies Question[];

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { image, questionType } = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '') as string;
    const buffer = Buffer.from(base64Data, 'base64');

    const tempPath = path.join(os.tmpdir(), 'quiz-');
    const basePath = await fs.mkdtemp(tempPath);
    const tempFilePath = path.join(basePath, 'temp-image.jpg');
    await fs.writeFile(tempFilePath, buffer);
    console.log('Image saved to:', tempFilePath);

    // Validate and use the question type
    let validQuestionType: QuestionType | undefined = undefined;
    if (isQuestionType(questionType as string)) {
      validQuestionType = questionType as QuestionType;
    }
    console.log('Using question type:', validQuestionType);

    const workflow = getWorkflow(tempFilePath, validQuestionType);

    const graph = new GraphAI(workflow, {
      ...agents,
      cloudVisionAgent: agentInfoWrapper(cloudVisionAgent),
    });

    const result = await graph.run<QueryResult>();
    const questions = result.query?.choices[0]?.message?.content;
    console.log('result:', result);
    console.log('Questions:', questions);

    const parsedQuestions = JSON.parse(questions ?? '{}') as QuestionsResponse;

    // Randomize choices if questions exist
    if (
      parsedQuestions?.questions &&
      Array.isArray(parsedQuestions.questions)
    ) {
      // Type assertion to help TypeScript understand the structure
      const typedQuestions = parsedQuestions.questions;
      parsedQuestions.questions = randomizeChoices(typedQuestions);
    }

    return NextResponse.json(parsedQuestions);

    // // For demo purposes, return mock questions after a delay
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // return NextResponse.json({ questions: mockQuestions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 },
    );
  }
}

// Function to randomize choices and update answer index
function randomizeChoices(questions: Question[]): Question[] {
  return questions.map((question) => {
    // Original choices and answer
    const originalChoices = [...question.choices];
    const originalAnswer = question.answer;

    // Make sure the answer index is valid
    if (originalAnswer < 0 || originalAnswer >= originalChoices.length) {
      return question; // Return unchanged if invalid
    }

    const correctChoice = originalChoices[originalAnswer];

    // Shuffle choices using Fisher-Yates algorithm (more reliable)
    const shuffledChoices = [...originalChoices];
    for (let i = shuffledChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      swap(shuffledChoices, i, j);
    }

    // Find new index of the correct answer
    const newAnswerIndex = shuffledChoices.findIndex(
      (choice) => choice === correctChoice,
    );

    return {
      ...question,
      choices: shuffledChoices,
      answer: newAnswerIndex >= 0 ? newAnswerIndex : originalAnswer, // Fallback to original if not found
    };
  });
}
