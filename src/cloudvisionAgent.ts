import 'dotenv/config';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { AgentFunction } from 'graphai';

const client = new ImageAnnotatorClient({
  projectId: process.env.GOOGLE_CLOUD_QUOTA_PROJECT,
});

export async function callVisionApi(imageFilePath: string) {
  const [documentResult] = await client.documentTextDetection(imageFilePath);
  return documentResult.fullTextAnnotation?.text ?? undefined;
}

export const cloudVisionAgent: AgentFunction<
  unknown,
  string,
  { filepath: string }
> = async (context) => {
  const { filepath } = context.namedInputs;
  return callVisionApi(filepath);
};
