import { GraphData } from 'graphai';

export function getWorkflow(questions: string): GraphData {
  return {
    version: 0.5,
    nodes: {
      sources: {
        value: {
          messages: [
            {
              role: 'developer',
              content: `あなたは優秀な英語教師です。後に例を示すように、userから入力されるJSON形式のデータには英語のクイズの問題、選択肢、正解の情報が格納されています。この情報を元に、生徒が理解を深められるよう、以下の内容を盛り込んだ解説を日本語で作成してください:
  1. 各問題の正解の理由を中心とした詳細な解説。
  2. 正解ではない選択肢に対して、「なぜ不正解なのか」を簡潔に説明。
  3. 生徒が注意すべき重要なポイント、誤解しやすい部分、及びよくある間違いの傾向についての補足説明。

## user入力例(JSON形式)
{
  questions: [
    {
      question: ['「increase」の意味は何ですか？'],
      choices: [ '増やす', '減らす', '変える', '保存する' ],
      answer: 0
    },
    {
      question: ['「vocabulary」の意味は何ですか？'],
      choices: [ '文法', '語彙', '会話', '発音' ],
      answer: 1
    },
    ...
  ]
}

## 出力例(JSON形式)
{
  explanations: [
    {
      "text": ["'increase' は「増やす」という意味です。この動詞は数量や程度を増加させることを指します。", "例えば、「We need to increase our sales.（私たちは売上を増やす必要があります）」というふうに使います。", "'（B）減らす'は 'decrease' という動詞に該当し、'（C）変える'は 'change'、'（D）保存する'は 'save' に該当するため、意味が異なります。", "この単語を正しく使うためには、増加を伴う状況を意識することが重要です。"]
    },
    {
      "text": ["'vocabulary' は「語彙」を意味します。これは、ある言語における単語や表現の集合を指します。", "言語学習において、語彙を増やすことは非常に重要です。", "'（A）文法'は 'grammar'、'（C）会話'は 'conversation'、'（D）発音'は 'pronunciation' に該当するため、意味が異なります。", "語彙を増やす際には、様々な分野の単語を学ぶことが大切です。"]
    },
    ...
  ]
}
`,
            },
          ],
        },
      },
      inputData: {
        // Pass the questions JSON directly
        value: questions,
      },
      prompt: {
        agent: 'stringTemplateAgent',
        inputs: {
          inputData: ':inputData',
        },
        params: {
          template: `\${inputData}`,
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
