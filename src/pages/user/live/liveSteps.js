import { LIVE_TIMING } from './liveMatches';

/*
  The timeline of one live question, shared by the player's screen (LIVE-03) and the host's (LIVE-06),
  so both always show the same step at the same moment.
  game needs: questionStartedAt, questionTimeSeconds, questionIndex, totalQuestions
*/

// Which step of the question we are in, worked out from when the question started
export function getStep(game, now) {
  const { countdownSeconds, readingSeconds, revealSeconds } = LIVE_TIMING;
  const elapsed = (now - game.questionStartedAt) / 1000;
  const answerStarts = countdownSeconds + readingSeconds;
  const revealStarts = answerStarts + game.questionTimeSeconds;
  const roundEnds = revealStarts + revealSeconds;
  const isLastQuestion = game.questionIndex === game.totalQuestions - 1;

  if (elapsed < countdownSeconds) {
    // Before the question starts (the match's start delay), elapsed is negative: show "Ready?"
    if (elapsed < 0) return { name: 'countdown', word: 'Ready?' };
    // First question: "Ready?" then "Go!" for the last second
    if (game.questionIndex === 0) return { name: 'countdown', word: elapsed < countdownSeconds - 1 ? 'Ready?' : 'Go!' };
    // Every other question: 3, 2, 1
    return { name: 'countdown', number: Math.ceil(countdownSeconds - elapsed) };
  }
  if (elapsed < answerStarts) return { name: 'reading' };
  if (elapsed < revealStarts) {
    const left = revealStarts - elapsed;
    return { name: 'answering', secondsLeft: Math.ceil(left), percentLeft: (left / game.questionTimeSeconds) * 100 };
  }
  if (elapsed < roundEnds || isLastQuestion) return { name: 'reveal', percentLeft: 0 }; // after the last one: results page

  // The next question's 3, 2, 1 starts straight away; the next check brings its details
  return { name: 'countdown', number: Math.max(1, Math.ceil(countdownSeconds - (elapsed - roundEnds))) };
}
