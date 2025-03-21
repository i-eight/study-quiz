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
      return '英単語のスペルを意識できるように穴埋め問題を作成します。テキストの中から一つの英単語を選び、その単語を用いた短い英文とその和訳を作り、その英文の中で対象の単語をアンダースコア（例: __ ）で隠してください。和訳した文章を元に隠した単語を当てる問題を5問作成します。';
    case 'sentence':
      return '読解力を養うために短文の内容理解を問う選択問題を作成します。テキストから1〜2文程度の英文を抜き出しその内容について日本語で問いを立て、その問いに対して最も正しい説明を当てる問題を5問作成します。問題文には元となる英文と日本語の問いの両方を含めてください。';
    case 'translation':
      return '読解力を鍛えるために和訳した内容を問う選択問題を作成します。テキストの内容に関連した1つの英文を提示し、その文を和訳したと思われる文章の選択肢の中から正しく和訳できているものを当てる問題を5問作成します。';
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
          temperature: 0.8,
        },
        isResult: true,
      },
    },
    verbose: true,
  };
}
