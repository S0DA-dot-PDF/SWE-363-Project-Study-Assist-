/*
  Mock data for live matches (LIVE-01 … LIVE-06).
  Front-end only: everything lives in memory and resets on page reload.
  Every function waits briefly so loading states can be seen, like a real server.

  Test codes for LIVE-01 (Join Match):
    482915  not started yet  → waiting room (LIVE-02), waits for the host
    118842  not started yet  → a second open match
    905117  already started  → waiting room (LIVE-02), which moves the player into the game
    260388  finished         → "This match has ended."
    anything else            → "Invalid match code."

  Players can be in several matches at once. Leaving a waiting room page removes them
  from that match (being moved into the game does not).

  Pretend host: after you join a match that hasn't started, more players appear
  every few seconds. In the waiting room, press H to make the host start the match.
  (Set HOST_STARTS_AFTER_MS to a number of milliseconds to have it start by itself.)

  Host game (LIVE-06): S skips to the next question, Escape ends the match (after a confirm).
  Host pages, open this address:
    /live/m-2001/host  Dr. Ahmed's match (LIVE-05 Host Lobby), no players yet; players appear every
                       few seconds. Start → the host's game screen (LIVE-06) → host leaderboard.

  Hosting: createMatch(host, quiz) is for the "Host live match" button on a quiz page.
  A host runs one match at a time; asking again returns the match they already have.

  Results (LIVE-04), finished matches with answers, open these addresses:
    /live/m-3001/results       your own score (3 / 5) with 2 mistakes to review
    /live/m-3001/host/results  20 players → host sees the top 5
    /live/m-3002/host/results   8 players → top 3
    /live/m-3003/host/results   2 players → everyone

  Points: a correct answer earns 100–200 points (faster = more), a wrong or missing answer 0.

  Live game (LIVE-03): the first question starts 3 s after the host presses Start (so players' screens
  can catch up). Each question runs in steps, timed from when it starts:
    Countdown (3 s: "Ready?/Go!" on the first question, then 3-2-1) → read the question (4 s) → answer (10 s) → reveal (3 s)
  The reveal shows the right answer and how many players picked each choice. Then the round counts
  and the next question starts by itself; after the last one the match is finished.
  Pretend players answer each round so your rank changes.
  The running test match (905117) waits on question 3 until you join, then its clock starts.
*/

// Steps of each live question, in seconds (shared by the player and host screens)
// startDelaySeconds: the first question starts this long after the host presses Start,
// so every player's screen has time to move from the waiting room into the game
export const LIVE_TIMING = { startDelaySeconds: 3, countdownSeconds: 3, readingSeconds: 4, revealSeconds: 3 };

const firstQuestionStart = () => Date.now() + LIVE_TIMING.startDelaySeconds * 1000;

const SIMULATE_HOST = true;
const NEW_PLAYER_EVERY_MS = 4000;
const HOST_STARTS_AFTER_MS = null; // null = only when you press H
const SIMULATED_PLAYERS = ['Ahmed', 'Sara', 'Lina', 'Yousef', 'Maha'];

const DELAY_MS = 400;

const wait = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => structuredClone(value);

// TODO(auth): replace with the logged-in user from the team's auth/context once it exists
const CURRENT_USER = { id: 'u-jude', name: 'Jude Nasser', role: 'student' };

const SWE363_QUESTIONS = [
  {
    id: 'q1',
    text: 'What does CSS stand for?',
    options: ['Cascading Style Sheets', 'Computer Style Syntax', 'Creative Sheet System', 'Colour Styling Script'],
    correctIndex: 0,
  },
  {
    id: 'q2',
    text: 'Which HTML element is used for the largest heading?',
    options: ['<head>', '<h6>', '<h1>', '<header>'],
    correctIndex: 2,
  },
  {
    id: 'q3',
    text: 'Which React hook stores state inside a component?',
    options: ['useEffect', 'useState', 'useRef', 'useMemo'],
    correctIndex: 1,
  },
  {
    id: 'q4',
    text: 'Which HTTP method is normally used to create a new resource?',
    options: ['GET', 'DELETE', 'POST', 'HEAD'],
    correctIndex: 2,
  },
  {
    id: 'q5',
    text: 'What does the CSS property "display: flex" do?',
    options: [
      'Hides the element',
      'Lays out children in a row or column',
      'Makes text bold',
      'Adds a border',
    ],
    correctIndex: 1,
  },
];

// Questions for live matches: different numbers of choices (2 to 6)
const LIVE_QUESTIONS = [
  {
    id: 'lq1',
    text: 'What does CSS stand for?',
    options: ['Cascading Style Sheets', 'Computer Style Syntax', 'Creative Sheet System', 'Colour Styling Script'],
    correctIndex: 0,
  },
  {
    id: 'lq2',
    text: 'A React component can return a fragment (<>…</>) instead of a wrapping <div>.',
    options: ['True', 'False'],
    correctIndex: 0,
  },
  {
    id: 'lq3',
    text: 'Which hook runs code after the page has been drawn?',
    options: ['useState', 'useEffect', 'useRef'],
    correctIndex: 1,
  },
  {
    id: 'lq4',
    text: 'Which HTTP status code means "Not Found"?',
    options: ['200', '301', '404', '500'],
    correctIndex: 2,
  },
  {
    id: 'lq5',
    text: 'Which of these is NOT a JavaScript data type?',
    options: ['String', 'Boolean', 'Number', 'Float', 'Undefined', 'Symbol'],
    correctIndex: 3,
  },
  {
    id: 'lq6',
    text: 'What does JSX let you write inside JavaScript?',
    options: ['SQL queries', 'HTML-like markup', 'CSS files', 'Python code'],
    correctIndex: 1,
  },
];

const matches = [
  {
    id: 'm-1001',
    code: '482915',
    title: 'SWE 363 · Week 5 review',
    hostId: 'u-dr-sara',
    hostName: 'Dr. Sara',
    status: 'waiting',
    currentQuestionIndex: null,
    questionStartedAt: null,
    questionTimeSeconds: 10,
    players: [
      { id: 'u-layan', name: 'Layan' },
      { id: 'u-zainab', name: 'Zainab' },
      { id: 'u-juana', name: 'Juana' },
    ],
    questions: LIVE_QUESTIONS,
  },
  {
    id: 'm-1003',
    code: '905117',
    title: 'MATH 201 · Limits',
    hostId: 'u-dr-khalid',
    hostName: 'Dr. Khalid',
    status: 'in-progress',
    currentQuestionIndex: 2,
    questionStartedAt: null, // TESTING ONLY: starts when you join (see joinMatch)
    questionTimeSeconds: 10,
    players: [
      { id: 'u-a', name: 'Omar' },
      { id: 'u-a2', name: 'Reem' },
      { id: 'u-a3', name: 'Faisal' },
      { id: 'u-a4', name: 'Lina' },
      { id: 'u-a5', name: 'Yousef' },
      { id: 'u-a6', name: 'Noura' },
    ],
    questions: LIVE_QUESTIONS,
  },
  {
    id: 'm-1004',
    code: '260388',
    title: 'COE 292 · Final review',
    hostId: 'u-dr-huda',
    hostName: 'Dr. Huda',
    status: 'finished',
    currentQuestionIndex: null,
    questionStartedAt: null,
    questionTimeSeconds: 10,
    players: [{ id: 'u-b', name: 'Reem' }],
    questions: LIVE_QUESTIONS,
  },
  {
    id: 'm-1005',
    code: '118842',
    title: 'SWE 363 · Week 6 review',
    hostId: 'u-dr-omar',
    hostName: 'Dr. Omar',
    status: 'waiting',
    currentQuestionIndex: null,
    questionStartedAt: null,
    questionTimeSeconds: 10,
    players: [{ id: 'u-c', name: 'Faisal' }],
    questions: LIVE_QUESTIONS,
  },
  {
    id: 'm-2001',
    code: '640271',
    title: 'SWE 363 · Week 7 review',
    hostId: 'u-dr-ahmed',
    hostName: 'Dr. Ahmed',
    status: 'waiting',
    currentQuestionIndex: null,
    questionStartedAt: null,
    questionTimeSeconds: 10,
    players: [],
    questions: LIVE_QUESTIONS,
  },
];


// ---------- Finished matches with answers, for the results pages (LIVE-04) ----------

// Answers that get exactly `correctCount` questions right (the first ones), the rest wrong
const answersWith = (correctCount) =>
  SWE363_QUESTIONS.map((q, i) => (i < correctCount ? q.correctIndex : (q.correctIndex + 1) % q.options.length));

// Your answers: right, wrong, right, right, no answer → 3 correct
const MY_ANSWERS = [0, 1, 1, 2, null];
// Seconds you took to answer each question (null = no answer)
const MY_TIMES = [6, 9, 4, 12, null];

// Answer times for pretend players: 2–16 seconds, different for each player and question
const timesFor = (playerIndex) => SWE363_QUESTIONS.map((q, i) => 2 + ((playerIndex * 7 + i * 5) % 15));

const RESULT_PLAYERS = [
  ['Layan', 5], ['Omar', 5], ['Zainab', 4], ['Reem', 4], ['Faisal', 4], ['Juana', 4], ['Noura', 3],
  ['Ahmed', 3], ['Sara', 3], ['Lina', 3], ['Yousef', 2], ['Maha', 2], ['Khalid', 2], ['Huda', 2],
  ['Salem', 1], ['Rana', 1], ['Turki', 1], ['Dana', 0], ['Bader', 0],
];

function finishedMatch(id, code, title, otherPlayerCount) {
  const others = RESULT_PLAYERS.slice(0, otherPlayerCount).map(([name, correct], i) => ({
    id: `u-res-${i}`,
    name,
    answers: answersWith(correct),
    times: timesFor(i),
  }));
  return {
    id,
    code,
    title,
    hostId: 'u-dr-ahmed',
    hostName: 'Dr. Ahmed',
    status: 'finished',
    currentQuestionIndex: null,
    questionStartedAt: null,
    questionTimeSeconds: 20,
    players: [{ id: CURRENT_USER.id, name: CURRENT_USER.name, answers: MY_ANSWERS, times: MY_TIMES }, ...others],
    questions: SWE363_QUESTIONS,
  };
}

matches.push(
  finishedMatch('m-3001', '551203', 'SWE 363 · Week 4 review', 19), // 20 players
  finishedMatch('m-3002', '551204', 'SWE 363 · Week 3 review', 7), //  8 players
  finishedMatch('m-3003', '551205', 'SWE 363 · Week 2 review', 1), //  2 players
);

// When pretend players started arriving for each match (matches you joined or are hosting)
const simulationStart = new Map();

function advanceSimulation(match) {
  if (!SIMULATE_HOST || match.status !== 'waiting' || !simulationStart.has(match.id)) return;
  const elapsed = Date.now() - simulationStart.get(match.id);

  const due = Math.min(Math.floor(elapsed / NEW_PLAYER_EVERY_MS), SIMULATED_PLAYERS.length);
  for (let i = 0; i < due; i += 1) {
    const id = `u-sim-${match.id}-${i}`;
    if (!match.players.some((p) => p.id === id)) match.players.push({ id, name: SIMULATED_PLAYERS[i] });
  }

  if (HOST_STARTS_AFTER_MS !== null && elapsed >= HOST_STARTS_AFTER_MS) {
    match.status = 'in-progress';
    match.currentQuestionIndex = 0;
    match.questionStartedAt = firstQuestionStart();
  }
}

export async function getCurrentUser() {
  await wait(100);
  return copy(CURRENT_USER);
}

export async function getMatchByCode(code) {
  await wait();
  const match = matches.find((m) => m.code === code);
  return match ? copy(match) : null;
}

export async function getMatch(matchId) {
  await wait();
  const match = matches.find((m) => m.id === matchId);
  if (!match) return null;
  advanceSimulation(match);
  moveOnWhenRoundEnds(match);
  return copy(match);
}

/*
  Join a match by code, under the user's account name. Anyone with a valid code joins,
  even mid-game. Joining a match you're already in just takes you back to it.
  Returns { ok: true, match } or { ok: false, error }
  error: 'invalid' | 'ended'
*/
export async function joinMatch(code, user) {
  await wait();
  const match = matches.find((m) => m.code === code);

  if (!match) return { ok: false, error: 'invalid' };
  if (match.status === 'finished' || match.status === 'cancelled') return { ok: false, error: 'ended' };
  if (match.players.some((p) => p.id === user.id)) return { ok: true, match: copy(match) };

  match.players.push({ id: user.id, name: user.name });
  if (match.status === 'waiting') simulationStart.set(match.id, Date.now());
  if (match.status === 'in-progress' && match.questionStartedAt === null) match.questionStartedAt = firstQuestionStart(); // TESTING ONLY
  return { ok: true, match: copy(match) };
}

const isActive = (match) => match.status !== 'finished' && match.status !== 'cancelled';

// A new 6-digit code that no other match uses
function newCode() {
  let code;
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
  } while (matches.some((m) => m.code === code));
  return code;
}

/*
  Host a live match for a quiz (for the "Host live match" button on a quiz page).
  A host runs one match at a time: if they already have one that hasn't finished,
  that same match is returned instead of a new one.
  Returns { ok: true, match } or { ok: false, error: 'not-published' }
*/
export async function createMatch(host, quiz) {
  await wait();
  if (!quiz.published) return { ok: false, error: 'not-published' };

  const current = matches.find((m) => m.hostId === host.id && isActive(m));
  if (current) return { ok: true, match: copy(current) };

  const match = {
    id: `m-${Date.now()}`,
    code: newCode(),
    title: quiz.title,
    hostId: host.id,
    hostName: host.name,
    status: 'waiting',
    currentQuestionIndex: null,
    questionStartedAt: null,
    questionTimeSeconds: 10,
    players: [],
    questions: quiz.questions,
  };
  matches.push(match);
  return { ok: true, match: copy(match) };
}

// Host opens the lobby: from now on, pretend players arrive every few seconds
export async function openHostLobby(matchId) {
  if (!simulationStart.has(matchId)) simulationStart.set(matchId, Date.now());
}

// Host starts the match: everyone in the waiting room moves to the game
export async function startMatch(matchId) {
  await wait();
  const match = matches.find((m) => m.id === matchId);
  if (!match || match.status !== 'waiting') return { ok: false };
  match.status = 'in-progress';
  match.currentQuestionIndex = 0;
  match.questionStartedAt = firstQuestionStart();
  return { ok: true };
}

// Host cancels the match: players are told, and the code stops working
export async function cancelMatch(matchId) {
  await wait();
  const match = matches.find((m) => m.id === matchId);
  if (!match) return { ok: false };
  match.status = 'cancelled';
  simulationStart.delete(matchId);
  return { ok: true };
}

// Leave a match. The player can then join another one.
export async function leaveMatch(matchId, userId) {
  await wait();
  const match = matches.find((m) => m.id === matchId);
  if (!match) return { ok: false, error: 'invalid' };
  match.players = match.players.filter((p) => p.id !== userId);
  simulationStart.delete(match.id);
  return { ok: true };
}

// ---------- Results (LIVE-04) ----------

// 100 points for a correct answer, plus up to 100 more for answering quickly.
// upTo: only count questions before this one (for scores during a live game)
function countPoints(match, player, upTo = match.questions.length) {
  const answers = player.answers ?? [];
  const times = player.times ?? [];
  return match.questions.reduce((total, q, i) => {
    if (i >= upTo || answers[i] !== q.correctIndex) return total;
    const secondsLeft = Math.max(0, match.questionTimeSeconds - (times[i] ?? match.questionTimeSeconds));
    return total + 100 + Math.round((100 * secondsLeft) / match.questionTimeSeconds);
  }, 0);
}

/*
  All players' points, best first. Equal points share a rank (1, 2, 2, 4 …).
  Returns { ok: true, title, standings: [{ id, name, points, rank }] }
  or { ok: false, error: 'not-found' | 'not-finished' }
*/
export async function getStandings(matchId) {
  await wait();
  const match = matches.find((m) => m.id === matchId);
  if (!match) return { ok: false, error: 'not-found' };
  moveOnWhenRoundEnds(match);
  if (match.status !== 'finished') return { ok: false, error: 'not-finished' };

  const scored = match.players
    .map((p) => ({ id: p.id, name: p.name, points: countPoints(match, p) }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  const standings = scored.map((p) => ({ ...p, rank: 1 + scored.filter((o) => o.points > p.points).length }));

  // For the host's Details table: how the players answered each question
  const questionStats = match.questions.map((q, index) => {
    const answers = match.players.map((p) => p.answers?.[index] ?? null);
    const counts = q.options.map((_, i) => answers.filter((a) => a === i).length);
    const noAnswer = answers.filter((a) => a === null).length;
    return {
      id: q.id,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      counts,
      correct: counts[q.correctIndex],
      wrong: match.players.length - counts[q.correctIndex] - noAnswer,
      noAnswer,
    };
  });

  return { ok: true, title: match.title, standings, questionStats, playerCount: match.players.length };
}

/*
  One player's own result: their points and the questions they got wrong.
  Returns { ok: true, title, points, mistakes: [{ id, text, yourAnswer, correctAnswer }] }
  (yourAnswer is null when they didn't answer in time)
  or { ok: false, error: 'not-found' | 'not-finished' | 'not-player' }
*/
export async function getPlayerResult(matchId, userId) {
  await wait();
  const match = matches.find((m) => m.id === matchId);
  if (!match) return { ok: false, error: 'not-found' };
  moveOnWhenRoundEnds(match);
  if (match.status !== 'finished') return { ok: false, error: 'not-finished' };
  const player = match.players.find((p) => p.id === userId);
  if (!player) return { ok: false, error: 'not-player' };

  const answers = player.answers ?? [];
  const mistakes = match.questions
    .map((q, i) => ({ q, given: answers[i] }))
    .filter(({ q, given }) => given !== q.correctIndex)
    .map(({ q, given }) => ({
      id: q.id,
      text: q.text,
      yourAnswer: given === null || given === undefined ? null : q.options[given],
      correctAnswer: q.options[q.correctIndex],
    }));

  return { ok: true, title: match.title, points: countPoints(match, player), mistakes };
}

// ---------- Live game (LIVE-03 player, LIVE-06 host) ----------

// Seconds since the answering step of the current question began (negative = not yet)
function answeringSeconds(match) {
  const { countdownSeconds, readingSeconds } = LIVE_TIMING;
  return (Date.now() - match.questionStartedAt) / 1000 - countdownSeconds - readingSeconds;
}

// Points and rank of every player, counting only the rounds the host has finished
function liveStandings(match) {
  const scored = match.players.map((p) => ({
    id: p.id,
    name: p.name,
    points: countPoints(match, p, match.currentQuestionIndex),
  }));
  return scored.map((p) => ({ ...p, rank: 1 + scored.filter((o) => o.points > p.points).length }));
}

/*
  What a player's game screen needs, without the correct answers.
  Returns { ok: true, status, title, hostName, questionIndex, totalQuestions, questionStartedAt,
            questionTimeSeconds, question: { text, options }, myAnswer, points, rank, playerCount,
            completedRounds }
  or { ok: false, error: 'not-found' | 'not-player' }
*/
// The current question, and (once its time is up) the right answer and how many picked each choice.
// The answer and counts are only sent once time is up, so they can't be read early.
function currentRound(match) {
  const index = Math.min(match.currentQuestionIndex ?? 0, match.questions.length - 1);
  const question = match.questions[index];
  const timeUp = match.status === 'in-progress' && answeringSeconds(match) >= match.questionTimeSeconds;
  if (timeUp) answerForPretendPlayers(match);
  const answerCounts = question.options.map((_, i) => match.players.filter((p) => p.answers?.[index] === i).length);

  return {
    status: match.status,
    title: match.title,
    questionIndex: index,
    totalQuestions: match.questions.length,
    questionStartedAt: match.questionStartedAt,
    questionTimeSeconds: match.questionTimeSeconds,
    question: { text: question.text, options: question.options },
    correctIndex: timeUp ? question.correctIndex : null,
    answerCounts: timeUp ? answerCounts : null,
    playerCount: match.players.length,
  };
}

// What a player's game screen shows (LIVE-03): the round, plus their own answer, points and rank
export async function getLiveState(matchId, userId) {
  await wait(150);
  const match = matches.find((m) => m.id === matchId);
  if (!match) return { ok: false, error: 'not-found' };
  moveOnWhenRoundEnds(match);
  const player = match.players.find((p) => p.id === userId);
  if (!player) return { ok: false, error: 'not-player' };

  const round = currentRound(match);
  const me = liveStandings(match).find((p) => p.id === userId);
  return {
    ok: true,
    ...round,
    hostName: match.hostName,
    myAnswer: player.answers?.[round.questionIndex] ?? null,
    points: me.points,
    rank: me.rank,
    completedRounds: round.questionIndex,
  };
}

// What the host's screen shows (LIVE-06): the round only. TODO(auth): only the match's host.
export async function getHostState(matchId) {
  await wait(150);
  const match = matches.find((m) => m.id === matchId);
  if (!match) return { ok: false, error: 'not-found' };
  if (match.status === 'in-progress' && match.questionStartedAt === null) match.questionStartedAt = firstQuestionStart(); // TESTING ONLY
  moveOnWhenRoundEnds(match);
  return { ok: true, ...currentRound(match) };
}

/*
  The player picks (or changes) their answer. Only allowed while the answering step is open.
  It counts when the round ends.
*/
export async function submitAnswer(matchId, userId, questionIndex, optionIndex) {
  await wait(100);
  const match = matches.find((m) => m.id === matchId);
  if (match) moveOnWhenRoundEnds(match);
  if (!match || match.status !== 'in-progress' || match.currentQuestionIndex !== questionIndex) return { ok: false };
  const seconds = answeringSeconds(match);
  if (seconds < 0 || seconds > match.questionTimeSeconds) return { ok: false };

  const player = match.players.find((p) => p.id === userId);
  if (!player) return { ok: false };
  player.answers = player.answers ?? [];
  player.times = player.times ?? [];
  player.answers[questionIndex] = optionIndex;
  player.times[questionIndex] = Math.round(seconds);
  return { ok: true };
}

// Pretend players answer the current question (most get it right, at different speeds)
function answerForPretendPlayers(match, index = match.currentQuestionIndex) {
  const question = match.questions[index];
  const optionCount = question.options.length;
  match.players.forEach((player, k) => {
    if (player.id === CURRENT_USER.id || player.answers?.[index] !== undefined) return;
    player.answers = player.answers ?? [];
    player.times = player.times ?? [];
    const right = (k + index) % 3 !== 0;
    const wrong = (question.correctIndex + 1 + (k % (optionCount - 1))) % optionCount; // spread the wrong picks
    player.answers[index] = right ? question.correctIndex : wrong;
    player.times[index] = 2 + ((k * 7 + index * 5) % (match.questionTimeSeconds - 4));
  });
}

// Seconds from the start of one question to the start of the next
function roundSeconds(match) {
  const { countdownSeconds, readingSeconds, revealSeconds } = LIVE_TIMING;
  return countdownSeconds + readingSeconds + match.questionTimeSeconds + revealSeconds;
}

// The next question starts at startTime, or the match finishes after the last one
function goToNextQuestion(match, startTime) {
  if (match.currentQuestionIndex + 1 < match.questions.length) {
    match.currentQuestionIndex += 1;
    match.questionStartedAt = startTime;
  } else {
    match.status = 'finished';
    match.currentQuestionIndex = match.questions.length;
  }
}

/*
  Questions move on by themselves: once a round's reveal is over, the next question starts.
  Called whenever a match is read, so it catches up on any rounds that ended since.
*/
function moveOnWhenRoundEnds(match) {
  while (match.status === 'in-progress' && match.questionStartedAt !== null) {
    const roundEndsAt = match.questionStartedAt + roundSeconds(match) * 1000;
    if (Date.now() < roundEndsAt) return;
    answerForPretendPlayers(match); // the round counts
    goToNextQuestion(match, roundEndsAt);
  }
}

// The host skips to the next question straight away (S key on LIVE-06). Answers already given still count.
export async function nextQuestion(matchId) {
  await wait(100);
  const match = matches.find((m) => m.id === matchId);
  if (!match || match.status !== 'in-progress') return { ok: false };
  moveOnWhenRoundEnds(match);
  goToNextQuestion(match, Date.now());
  return { ok: true };
}

/*
  The host ends the match early (Escape on LIVE-06). Questions not played yet are dropped, so the
  results only cover what was played. Ended before any question was answered → cancelled instead.
  Returns { ok: true, status: 'finished' | 'cancelled' } or { ok: false }
*/
export async function endMatch(matchId) {
  await wait(100);
  const match = matches.find((m) => m.id === matchId);
  if (!match || match.status !== 'in-progress') return { ok: false };
  moveOnWhenRoundEnds(match);
  if (match.status !== 'in-progress') return { ok: true, status: match.status }; // it had just finished

  const answeringStarted = answeringSeconds(match) >= 0; // players have seen the current question's choices
  const played = match.currentQuestionIndex + (answeringStarted ? 1 : 0);
  if (played === 0) {
    match.status = 'cancelled';
    return { ok: true, status: 'cancelled' };
  }
  match.questions = match.questions.slice(0, played);
  match.currentQuestionIndex = played;
  match.status = 'finished';
  return { ok: true, status: 'finished' };
}

// The running test match (code 905117) is already on question 3: the pretend players answered questions 1–2
const runningMatch = matches.find((m) => m.id === 'm-1003');
for (let i = 0; i < runningMatch.currentQuestionIndex; i += 1) answerForPretendPlayers(runningMatch, i);
