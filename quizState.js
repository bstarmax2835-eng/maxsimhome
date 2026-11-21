import { scoreAnswers } from './scoring.js';

export function createQuiz(questions, styleKeys) {
  const answers = [];
  let index = 0;

  return {
    current: () => ({ index, question: questions[index] }),
    answer(optionIndex) {
      if (index >= questions.length) return;
      answers[index] = optionIndex;
      index += 1;
    },
    back() {
      index = Math.max(index - 1, 0);
    },
    isDone: () => index >= questions.length,
    result: () => ({ style: scoreAnswers(answers, questions, styleKeys) }),
  };
}
