import { getInput, printStreamChunk } from './utils.js';
import {
  getPrompt,
  invoke,
  outputText,
  user,
  withOptions,
  withPreviousResponse,
} from 'baby-prompts';

import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./localstorage');

const prompt = getPrompt();

const lastResponse = localStorage.getItem('lastResponse');
let response = lastResponse ? JSON.parse(lastResponse) : null;

while (true) {
  const input = await getInput();
  response = await prompt(user(input))
    .pipe(withOptions({ stream: true }))
    .pipe(withPreviousResponse(response))
    .pipe(invoke);

  for await (const chunk of response) {
    if (chunk.type === 'response.completed') {
      response = chunk.response;
      localStorage.setItem('lastResponse', JSON.stringify(response));
    } else {
      printStreamChunk(chunk);
    }
  }
  process.stdout.write('\n');
}
