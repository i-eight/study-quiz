import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { GraphAI } from 'graphai';
import * as agents from '@graphai/agents';
import { getWorkflow } from './workflow';

interface QueryResult {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body which should contain a JSON with a "questions" array
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { questions } = await request.json();
    console.log('questions:', questions);

    // Create a workflow for generating explanations using the provided questions
    const workflow = getWorkflow(JSON.stringify(questions));

    // Initialize GraphAI with the workflow and available agents
    const graph = new GraphAI(workflow, {
      ...agents,
    });

    // Execute the workflow and cast the result to QueryResult
    const result = await graph.run<QueryResult>();
    const explanations = result.query?.choices[0]?.message?.content;
    console.log('result:', result);
    console.log('Explanations:', explanations);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedExplanations = JSON.parse(explanations ?? '{}');
    return NextResponse.json(parsedExplanations);
  } catch (error) {
    console.error('Error generating explanations:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanations' },
      { status: 500 },
    );
  }
}
