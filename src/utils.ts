import { fileURLToPath } from 'node:url';
import path from 'node:path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.resolve(path.dirname(filename), '..');

export function getDirname() {
  return dirname;
}
