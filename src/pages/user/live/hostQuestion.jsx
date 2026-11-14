import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { endMatch, getHostState, nextQuestion } from './liveMatches';
import { getStep } from './liveSteps';

/*
  LIVE-06  Host Question  (FR-16) — the host's game screen (e.g. on the classroom projector)
  Shows only the question (the choices are on the players' devices), on the same timeline as the
  players' screens (shared getStep):
  1. Countdown — first question: "Ready?", then "Go!"; after that: 3 → 2 → 1
  2. Read, answer, reveal — the question, large; the timer bar in the footer runs while players answer
  The match moves on by itself. When it finishes → host leaderboard (LIVE-04), where Details shows
  how the players answered each question.
  Keyboard: S skips to the next question; Escape asks to end the match (only played questions count).
  Ended before any question → cancelled → dashboard.
  - Not started yet → host lobby   - Cancelled or not found → message
  TODO(auth): only the match's host (an educator) should reach this page.
*/

const ROUTES = {
  hostLobby: (matchId) => `/live/${matchId}/host`, // LIVE-05
  hostResults: (matchId) => `/live/${matchId}/host/results`, // LIVE-04
  dashboard: '/dashboard',
};

const POLL_MS = 500; // how often to check for the next question and the reveal
const TICK_MS = 250; // how often to redraw the timer

export default function HostQuestion() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [view, setView] = useState('loading'); // loading | playing | not-found | cancelled
  const [now, setNow] = useState(Date.now());
  const [confirmingEnd, setConfirmingEnd] = useState(false);

  // Check the match twice a second: a new question, the reveal's answer and counts, or the match ending
  useEffect(() => {
    let cancelled = false;

    async function check() {
      const latest = await getHostState(matchId);
      if (cancelled) return;

      if (!latest.ok) setView('not-found');
      else if (latest.status === 'finished') navigate(ROUTES.hostResults(matchId), { replace: true });
      else if (latest.status === 'waiting') navigate(ROUTES.hostLobby(matchId), { replace: true });
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

  // Keyboard: S skips to the next question, Escape asks to end the match
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 's' || event.key === 'S') nextQuestion(matchId);
      if (event.key === 'Escape') setConfirmingEnd(true);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [matchId]);

  async function handleEnd() {
    const response = await endMatch(matchId);
    if (response.status === 'cancelled') navigate(ROUTES.dashboard, { replace: true });
    else navigate(ROUTES.hostResults(matchId), { replace: true });
  }

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
          <h1>{view === 'cancelled' ? 'This match was cancelled' : 'Match not found'}</h1>
          <Link to={ROUTES.dashboard} className="live-primary-button live-button-link">Go to dashboard</Link>
        </div>
      </div>
    );
  }

  const step = getStep(game, now);
  const progressPercent = ((game.questionIndex + 1) / game.totalQuestions) * 100;
  const timeLow = step.name === 'answering' && step.secondsLeft <= 5;

  // Timer bar: full while players read, shrinks while they answer, empty after (it only ever goes down)
  let timerPercent = 0;
  if (step.name === 'reading') timerPercent = 100;
  if (step.name === 'answering') timerPercent = step.percentLeft;

  return (
    <div className="live-game-page">
      <div className="live-game-card">
        <header className="live-game-top">
          <p className="live-host-match-title">{game.title}</p>
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
          <p className="live-host-keys">
            <kbd>S</kbd> skip · <kbd>Esc</kbd> end
          </p>
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

        {step.name !== 'countdown' && (
          <div className="live-stage">
            <h1 className="live-question-big live-question-host-big">{game.question.text}</h1>
          </div>
        )}

        {/* The footer is there from the reading step on, so the question doesn't move when the timer starts */}
        {step.name !== 'countdown' && (
          <footer
            className={timeLow ? 'live-game-footer live-game-footer-low' : 'live-game-footer'}
            aria-label={step.name === 'answering' ? `${step.secondsLeft} seconds left` : undefined}
          >
            <div className="live-timer-bar">
              <div className="live-timer-fill" style={{ width: `${timerPercent}%` }} />
            </div>
          </footer>
        )}
      </div>

      {confirmingEnd && <EndDialog onKeep={() => setConfirmingEnd(false)} onEnd={handleEnd} />}
    </div>
  );
}

/* "End the match now?" confirmation box, shown on top of the page while confirmingEnd is true */
function EndDialog({ onKeep, onEnd }) {
  return (
    <div className="live-overlay">
      <div className="live-modal">
        <h2>End the match now?</h2>
        <p>Players go to their results. Only the questions played so far count.</p>
        <div className="live-modal-actions">
          <button type="button" className="live-secondary-button" onClick={onKeep}>Keep playing</button>
          <button type="button" className="live-danger-button" onClick={onEnd}>End match</button>
        </div>
      </div>
    </div>
  );
}
