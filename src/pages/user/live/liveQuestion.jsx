import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, getLiveState, submitAnswer } from './liveMatches';
import { getStep } from './liveSteps';

/*
  LIVE-03  Live Question  (FR-09) — the player's game screen
  Each question runs in steps timed from when it starts, so every player sees the same thing:
  1. Countdown — first question: "Ready?", then "Go!" for the last second; after that: 3 → 2 → 1
                 ("Ready?" also shows while waiting for a question to start)
  2. Read      — the question alone, large
  3. Answer    — question at the top, choices below, a timer bar in the footer (blinks red in the last 5 s);
                 the pick can be changed
  4. Reveal    — 3 s: each choice fades into the number of players who picked it; the right answer turns
                 green, with confetti if right or a shake if wrong. Then the next question's countdown starts.
  The header shows the progress bar, the player's rank (after the first round) and points.
  Menu → Leave match goes back to Join Match (the player can rejoin with the same code; their points stay).
  - Match finished → results (LIVE-04)   - Not started → waiting room   - Not a player → Join Match
*/

const ROUTES = {
  joinMatch: '/live/join', // LIVE-01
  waitingRoom: (matchId) => `/live/${matchId}/waiting`, // LIVE-02
  results: (matchId) => `/live/${matchId}/results`, // LIVE-04
};

const POLL_MS = 500; // how often to check for the next question and the reveal
const TICK_MS = 250; // how often to redraw the timer
const CONFETTI_COLOURS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#9333ea'];

export default function LiveQuestion() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [game, setGame] = useState(null);
  const [view, setView] = useState('loading'); // loading | playing | not-found | cancelled
  const [now, setNow] = useState(Date.now());
  const [pick, setPick] = useState({ questionIndex: null, option: null }); // the player's latest choice
  const [menuOpen, setMenuOpen] = useState(false);

  // Check the match twice a second: a new question, the reveal's answer and counts, or the match ending
  useEffect(() => {
    let cancelled = false;

    async function check() {
      const user = await getCurrentUser();
      const latest = await getLiveState(matchId, user.id);
      if (cancelled) return;
      setUserId(user.id);

      if (!latest.ok && latest.error === 'not-player') navigate(ROUTES.joinMatch, { replace: true });
      else if (!latest.ok) setView('not-found');
      else if (latest.status === 'finished') navigate(ROUTES.results(matchId), { replace: true });
      else if (latest.status === 'waiting') navigate(ROUTES.waitingRoom(matchId), { replace: true });
      else if (latest.status === 'cancelled') setView('cancelled');
      else {
        setGame(latest);
        setView('playing');
      }
    }

    check(); // first check straight away
    const intervalId = setInterval(check, POLL_MS); // then every half second

    return () => {
      cancelled = true;
      clearInterval(intervalId); // stop checking when the page closes
    };
  }, [matchId, navigate]);

  // Redraw the countdown and timer a few times a second
  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(intervalId);
  }, []);

  if (view === 'loading') {
    return (
      <div className="live-game-page">
        <div className="live-game-card live-center" role="status">
          <span className="live-spinner" aria-hidden="true" />
          <p>Loading match…</p>
        </div>
      </div>
    );
  }

  if (view !== 'playing') {
    return (
      <div className="live-game-page">
        <div className="live-game-card live-center">
          <h1>{view === 'cancelled' ? 'The host ended this match' : 'Match not found'}</h1>
          <Link to={ROUTES.joinMatch} className="live-primary-button live-button-link">Go to Join match</Link>
        </div>
      </div>
    );
  }

  const step = getStep(game, now);
  const chosen = pick.questionIndex === game.questionIndex ? pick.option : game.myAnswer;
  const progressPercent = ((game.questionIndex + 1) / game.totalQuestions) * 100;
  const showChoices = step.name === 'answering' || step.name === 'reveal';
  const revealed = step.name === 'reveal' && game.correctIndex !== null; // the right answer has arrived
  const isRight = revealed && chosen === game.correctIndex;
  const timeLow = step.name === 'answering' && step.secondsLeft <= 5;

  function handleChoose(option) {
    if (step.name !== 'answering') return;
    setPick({ questionIndex: game.questionIndex, option });
    submitAnswer(matchId, userId, game.questionIndex, option);
  }

  // Colour of each choice. While answering: the pick is yellow.
  // Revealed: right answer green, a wrong pick red, and the player's own pick keeps a yellow ring;
  // the text fades out and the number of players who picked it fades in.
  function optionClass(index) {
    if (!revealed) return index === chosen ? 'live-option live-option-chosen' : 'live-option';

    let name = 'live-option live-option-revealed';
    if (index === game.correctIndex) name += ' live-option-correct';
    else if (index === chosen) name += ' live-option-wrong';
    if (index === chosen) name += ' live-option-mine';
    return name;
  }

  return (
    <div className="live-game-page">
      <div className="live-game-card">
        <header className="live-game-top">
          <div className="live-menu">
            <button
              type="button"
              className="live-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="live-menu-list"
              aria-label="Menu"
            >
              ☰
            </button>
            {menuOpen && (
              <ul id="live-menu-list" className="live-menu-list">
                <li>
                  <Link to={ROUTES.joinMatch}>Leave match</Link>
                </li>
              </ul>
            )}
          </div>

          <div
            className="live-progress"
            role="progressbar"
            aria-label="Match progress"
            aria-valuemin={0}
            aria-valuemax={game.totalQuestions}
            aria-valuenow={game.questionIndex + 1}
          >
            <div className="live-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="live-game-stats">
            {game.completedRounds > 0 && (
              <p className="live-rank" aria-label={`Rank ${game.rank} of ${game.playerCount}`}>#{game.rank}</p>
            )}
            <p className="live-points" aria-label={`${game.points} points`}>
              {game.points.toLocaleString()}
              <span className="live-points-symbol" aria-hidden="true">★</span>
            </p>
          </div>
        </header>

        {step.name === 'countdown' && (
          <div className="live-stage">
            {/* the key makes the number or word appear fresh when it changes, so its animation replays */}
            {step.number ? (
              <p key={step.number} className="live-countdown-number" aria-live="polite">{step.number}</p>
            ) : (
              <p
                key={step.word}
                className={step.word === 'Go!' ? 'live-countdown-word live-countdown-go' : 'live-countdown-word'}
                aria-live="polite"
              >
                {step.word}
              </p>
            )}
          </div>
        )}

        {step.name === 'reading' && (
          <div className="live-stage">
            <h1 className="live-question-big">{game.question.text}</h1>
          </div>
        )}

        {showChoices && (
          <>
            <h1 className="live-question-small">{game.question.text}</h1>
            <div className="live-options">
              {game.question.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className={optionClass(index)}
                  onClick={() => handleChoose(index)}
                  disabled={step.name === 'reveal'}
                  aria-pressed={chosen === index}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* long answers get a smaller size so they fit their box */}
                  <span className={option.length > 14 ? 'live-option-text live-option-text-long' : 'live-option-text'}>
                    {option}
                  </span>
                  {revealed && (
                    <span className="live-option-count">
                      {game.answerCounts[index]}
                      <span className="live-visually-hidden">
                        {' '}{game.answerCounts[index] === 1 ? 'player' : 'players'} chose this
                        {index === game.correctIndex ? ', the right answer' : ''}
                        {index === chosen ? ', your answer' : ''}
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* The footer stays during the reveal (empty and grey) so the choices don't move */}
        {showChoices && (
          <footer
            className={timeLow ? 'live-game-footer live-game-footer-low' : 'live-game-footer'}
            aria-label={step.name === 'answering' ? `${step.secondsLeft} seconds left` : undefined}
          >
            <div className="live-timer-bar">
              <div className="live-timer-fill" style={{ width: `${step.percentLeft}%` }} />
            </div>
            <span className="live-timer-seconds">{step.name === 'answering' ? step.secondsLeft : ''}</span>
          </footer>
        )}
      </div>

      {isRight && <Confetti />}
    </div>
  );
}

/* Confetti that falls once when the player gets a question right (CSS animation; decoration only) */
function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="live-confetti" aria-hidden="true">
      {pieces.map((i) => (
        <span
          key={i}
          className="live-confetti-piece"
          style={{
            left: `${(i * 37) % 100}%`,
            backgroundColor: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
            animationDelay: `${(i % 10) * 0.08}s`,
            animationDuration: `${2 + (i % 4) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
