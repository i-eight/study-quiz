import { GraphData } from 'graphai';

export function getWorkflow(filepath: string): GraphData {
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
        isResult: true,
      },
    },
    verbose: true,
  };
}
