import { GraphData } from 'graphai';

export const QuestionKind = [
  'words',
  'cloze',
  'sentence',
  'translation',
] as const;
export type QuestionType = (typeof QuestionKind)[number];
export function isQuestionType(type?: string): type is QuestionType {
  return QuestionKind.includes(type as QuestionType);
}

function getQuestionTemplate(type?: QuestionType): string {
  switch (type) {
    case 'words':
      return '特に学習が必要と予想できる英単語を抜き出して、英単語の正しい意味を当てる選択肢問題を5問作成します。';
    case 'cloze':
      return '英単語の穴埋め問題を作成します。テキストの中から英語学習する上で重要度の高いと思われる英単語を一つ選び、その単語を用いた短い「英文」とその「和訳文」をそれぞれ作り、その英文の中だけ対象の単語をアンダースコア（例: __ ）で隠してください。英文と和訳文は併記して示し、隠された単語の選択肢を4つ用意してください。同じ仕様の問題を5問作成してください。';
    case 'sentence':
      return '短文の内容理解を問う選択問題を作成します。テキストから学習するのに重要と思われる1文の英文を抜き出し、その内容の正しい和訳を当てる選択肢を4つ用意してください。同じ仕様の問題を5問作成してください。';
    case 'translation':
      return '英文作成能力を養う問題を作成します。テキストから学習するのに重要と思われる1文の英文を抜き出し、その和訳だけを示してください。さらに問題として正しい英文を選択する選択肢を4つ用意してください。同じ仕様の問題を5問作成してください。';
    default: {
      const kind =
        QuestionKind[Math.floor(Math.random() * QuestionKind.length)];
      console.log('kind', kind);
      return getQuestionTemplate(kind);
    }
  }
}

export function getWorkflow(filepath: string, type?: QuestionType): GraphData {
  return {
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
      inputData: {
        agent: 'cloudVisionAgent',
        inputs: {
          filepath,
        },
      },
      prompt: {
        agent: 'stringTemplateAgent',
        inputs: {
          inputData: ':inputData',
        },
        params: {
          template: `以下のテキストの内容を元に、${getQuestionTemplate(type)}
問題は選択問題の形式で、正解が１つ間違いが３つの４択問題にしてください。正解の位置は常に最初にしてください。
最初の２問は簡単な問題、次の２問は普通の問題、最後の１問は難しい問題にしてください。

### テキストの内容 ###

\${inputData}

### 問題のフォーマット ###

問題は以下のJSONフォーマットで出力してください。

{
  "questions": [
    {
      "question": ["問題文1", "問題文2"],
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
          temperature: 0.8,
        },
        isResult: true,
      },
    },
    verbose: true,
  };
}
