import { NextRequest, NextResponse } from 'next/server';
import { Question } from '../../types';
// import { writeFile } from 'fs/promises';
// import path from 'path';
// import { callVisionApi } from '../../../src/cloudvisionAgent';
// import { GraphAI, agentInfoWrapper } from 'graphai';
// import agents from '@graphai/agents';

// Mock questions for testing
const mockQuestions = [
  {
    question: '「appreciate」の意味として最も適切なものはどれですか？',
    choices: ['感謝する', '理解する', '批評する', '無視する'],
    answer: 0,
  },
  {
    question: '「diverse」の意味として最も適切なものはどれですか？',
    choices: ['多様な', '分散した', '分割された', '異なる'],
    answer: 0,
  },
  {
    question: '「implement」の意味として最も適切なものはどれですか？',
    choices: ['実行する', '輸入する', '改善する', '印象づける'],
    answer: 0,
  },
  {
    question: '「substantial」の意味として最も適切なものはどれですか？',
    choices: ['かなりの', '本質的な', '物質的な', '補助的な'],
    answer: 0,
  },
  {
    question: '「unprecedented」の意味として最も適切なものはどれですか？',
    choices: ['前例のない', '予測できない', '理解できない', '比類のない'],
    answer: 0,
  },
] satisfies Question[];

export async function POST(_request: NextRequest) {
  try {
    // const { image } = await request.json();

    // In a real implementation, we would:
    // 1. Save the image to a temporary file
    // 2. Process the image with Google Cloud Vision
    // 3. Generate questions using the workflow

    // For demo purposes, we'll just return mock questions after a delay
    // to simulate processing time

    // Uncomment this code for a real implementation:
    /*
    // Convert base64 image to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Save to temporary file
    const tempFilePath = path.join(process.cwd(), 'temp-image.jpg');
    await writeFile(tempFilePath, buffer);
    
    // Extract text from image
    const extractedText = await callVisionApi(tempFilePath);
    
    // Use the workflow to generate questions
    const workflow = {
      version: 0.5,
      nodes: {
        sources: {
          value: {
            messages: [
              {
                role: 'developer',
                content:
                  'あなたは優秀な日本語学校の先生です。これからテキストの内容を生徒に学んでもらうために、書いてある内容を元にクイズ形式で問題を出してもらいます。',
              },
            ],
          },
        },
        prompt: {
          agent: 'stringTemplateAgent',
          inputs: {
            inputData: extractedText,
          },
          params: {
            template: `以下のテキストの内容を元に、特に学習が必要と予想できる英単語を抜き出して、英単語の正しい意味を当てる選択肢問題を5問作成します。
問題は選択問題の形式で、正解が１つ間違いが３つの４択問題にしてください。
最初の２問は簡単な問題、次の２問は普通の問題、最後の１問は難しい問題にしてください。

### テキストの内容 ###

\${inputData}

### 問題のフォーマット ###

問題は以下のJSONフォーマットで出力してください。

{
  "questions": [
    {
      "question": "問題文",
      "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "answer": 正解の選択肢のインデックス
    },
  ],
]
`,
          },
        },
        query: {
          agent: 'openAIAgent',
          params: {
            model: 'gpt-4o-mini',
          },
          inputs: {
            messages: [
              ':sources.messages.$0',
              {
                role: 'user',
                content: ':prompt',
              },
            ],
            response_format: { type: 'json_object' },
          },
        },
      },
      verbose: false,
    };
    
    const graph = new GraphAI(workflow, {
      ...agents,
    });
    
    const result = await graph.run();
    const questions = result.query?.choices[0]?.message?.content;
    
    // Parse the JSON response
    const parsedQuestions = JSON.parse(questions).questions;
    
    return NextResponse.json({ questions: parsedQuestions });
    */

    // For demo purposes, return mock questions after a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({ questions: mockQuestions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 },
    );
  }
}
