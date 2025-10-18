import inquirer from 'inquirer';
import chalk from 'chalk';
import { outputText } from 'baby-prompts';

export async function getInput() {
  const userInput = [
    {
      type: 'input',
      name: 'content',
      message: chalk.bgBlue('You: (CTRL+C to exit)'),
    },
  ];

  return inquirer
    .prompt(userInput)
    .then((answer) => answer.content?.trim())
    .catch(exitHandler);
}

export function printSingleAnswer(answer) {
  console.log(
    '  ' + chalk.bgMagenta('AI Agent:') + chalk.magenta(` ${answer}`)
  );
}

export async function printStreamChunk(chunk) {
  if (chunk.type == 'response.output_text.delta')
    process.stdout.write(chalk.magenta(chunk.delta));
}

function exitHandler() {
  printSingleAnswer('Bye 👋');
  process.exit(0);
}

// handle CTRL+C gracefully
// Remove global SIGINT handler to avoid double handling with inquirer
process.on('uncaughtException', (err) => {
  if (err.name === 'ExitPromptError') {
    exitHandler();
    return;
  }
  throw err; // let other errors crash normally
});
