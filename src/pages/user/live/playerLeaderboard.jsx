import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, getPlayerResult } from './liveMatches';

/*
  LIVE-04  Player Leaderboard  (FR-09)
  The player's own points after the match, with an option to review their mistakes.
  Each mistake shows the player's answer in red and the right one in green, with an "Ask AI" button.
  - Match not found or not finished → message
  - Not a player in this match → Join Match
  TODO: "score saved to profile" (FR-09) once profiles store results.
*/

const ROUTES = {
  joinMatch: '/live/join', // LIVE-01
  dashboard: '/dashboard',
  askAi: '/summaries',
};

function useGoBack() {
  const navigate = useNavigate();
  return () => navigate(ROUTES.dashboard);
}

const MESSAGES = {
  'not-found': { title: 'Match not found', text: 'Check the code and try again.' },
  'not-finished': { title: 'Results are not ready yet', text: 'They appear when the match ends.' },
};

export default function PlayerLeaderboard() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [result, setResult] = useState(null);
  const [view, setView] = useState('loading'); // loading | results | not-found | not-finished
  const [showMistakes, setShowMistakes] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const user = await getCurrentUser();
      const response = await getPlayerResult(matchId, user.id);
      if (cancelled) return;

      if (response.ok) {
        setResult(response);
        setView('results');
      } else if (response.error === 'not-player') navigate(ROUTES.joinMatch, { replace: true });
      else setView(response.error);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [matchId, navigate]);

  if (view === 'loading') {
    return (
      <div className="live-join-page">
        <div className="live-join-card live-center" role="status">
          <span className="live-spinner" aria-hidden="true" />
          <p>Loading results…</p>
        </div>
      </div>
    );
  }

  if (view !== 'results') {
    const message = MESSAGES[view];
    return (
      <div className="live-join-page">
        <div className="live-join-card live-center">
          <h1>{message.title}</h1>
          <p>{message.text}</p>
          <Link to={ROUTES.joinMatch} className="live-primary-button live-button-link">Go to Join match</Link>
        </div>
      </div>
    );
  }

  const mistakeCount = result.mistakes.length;

  return (
    <div className="live-join-page live-stars-page">
      <div className="live-join-card">
        <nav className="live-topnav" aria-label="Page">
          <button type="button" onClick={goBack}>← Back</button>
        </nav>

        <h1>{result.title}</h1>

        <div className="live-score-display">
          <p className="live-code-label">Your score</p>
          <p className="live-score-number">{result.points.toLocaleString()}</p>
          <p className="live-score-caption">points</p>
        </div>

        {mistakeCount === 0 ? (
          <p className="live-perfect">Perfect score — no mistakes!</p>
        ) : (
          <button
            type="button"
            className="live-secondary-button"
            onClick={() => setShowMistakes(!showMistakes)}
            aria-expanded={showMistakes}
          >
            {showMistakes ? 'Hide mistakes' : `Review mistakes (${mistakeCount})`}
          </button>
        )}

        {showMistakes && (
          <ol className="live-mistakes">
            {result.mistakes.map((mistake) => (
              <li key={mistake.id} className="live-mistake">
                <div className="live-mistake-text">
                  <p className="live-mistake-question">{mistake.text}</p>
                  <p className="live-answer-wrong">
                    <span className="live-visually-hidden">Your answer: </span>
                    {mistake.yourAnswer ?? 'No answer'}
                  </p>
                  <p className="live-answer-right">
                    <span className="live-visually-hidden">Correct answer: </span>
                    {mistake.correctAnswer}
                  </p>
                </div>
                <Link
                  to={ROUTES.askAi}
                  state={{
                    mode: 'explanation',
                    question: mistake.text,
                    selectedAnswer: mistake.yourAnswer ?? 'No answer',
                    correctAnswer: mistake.correctAnswer,
                    returnTo: `/live/${matchId}/results`,
                  }}
                  className="live-ask-ai"
                >
                  Ask AI
                </Link>
              </li>
            ))}
          </ol>
        )}

        <Link to={ROUTES.joinMatch} className="live-primary-button live-button-link">Join another match</Link>
      </div>
    </div>
  );
}
