import 'dotenv/config';
import { agentInfoWrapper, GraphAI } from 'graphai';
import agents from '@graphai/agents';
import { cloudVisionAgent } from '../app/lib/cloudvisionAgent.js';
import { workflow } from './workflow.js';

interface QueryResult {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function main() {
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
