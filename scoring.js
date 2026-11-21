const TIEBREAK_QUESTION_INDEX = 6; // Q7

const styleOf = (questions, answers, i) => questions[i]?.options[answers[i]]?.style;

export function scoreAnswers(answers, questions, styleKeys) {
  const tally = Object.fromEntries(styleKeys.map((k) => [k, 0]));
  questions.forEach((_, i) => {
    const style = styleOf(questions, answers, i);
    if (style in tally) tally[style] += 1;
  });

  const top = Math.max(...Object.values(tally));
  const tied = styleKeys.filter((k) => tally[k] === top);
  const tiebreak = styleOf(questions, answers, TIEBREAK_QUESTION_INDEX);
  return tied.includes(tiebreak) ? tiebreak : tied[0];
}
