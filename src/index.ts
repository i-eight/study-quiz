import 'dotenv/config';
import fs from 'node:fs';
import { agentInfoWrapper, GraphAI, GraphData } from 'graphai';
import agents from '@graphai/agents';
import { cloudVisionAgent } from '../app/lib/cloudvisionAgent';
import {
  getWorkflow,
  isQuestionType,
  QuestionType,
} from '../app/api/generate-questions/workflow';

interface QueryResult {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export function getTextWorkflow(
  filepath: string,
  type?: QuestionType,
): GraphData {
  const value = fs.readFileSync(filepath, 'utf-8');
  const graph = getWorkflow(filepath, type);
  return {
    ...graph,
    nodes: {
      ...graph.nodes,
      inputData: {
        value,
      },
    },
  };
}

const loadText = true;

async function main() {
  const arg = process.argv[2];
  const workflow = loadText
    ? getTextWorkflow(
        'inputs/img_h-kyozai_01_page_03.txt',
        isQuestionType(arg) ? arg : undefined,
      )
    : getWorkflow(
        'inputs/img_h-kyozai_01_page_03.png',
        isQuestionType(arg) ? arg : undefined,
      );

  const graph = new GraphAI(workflow, {
    ...agents,
    cloudVisionAgent: agentInfoWrapper(cloudVisionAgent),
  });
  const result = await graph.run<QueryResult>();

  console.log('Result:');
  // console.log(JSON.stringify(result, null, 2));
  result.query?.choices.forEach((choice, index) => {
    console.log(`${index + 1}: ${choice.message.content}`);
  });
}

main().catch(console.error);
