import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getStandings } from './liveMatches';

/*
  LIVE-04  Host Leaderboard  (FR-16) — educators only
  The top players after the match, on a podium (places 4–5 listed underneath):
  - more than 15 players → top 5
  - 3 to 15 players      → top 3
  - fewer than 3         → everyone
  Details: a table of how the players answered each question. Hovering (or tabbing to) a question
  pops up the full question, its choices and how many picked each one.
  TODO(auth): only the match's host (an educator) should reach this page.
*/

const ROUTES = {
  dashboard: '/dashboard',
};

// One page back; if there is no previous page in the app, go to the dashboard
function useGoBack() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => (location.key !== 'default' ? navigate(-1) : navigate(ROUTES.dashboard));
}

// How many players to show, based on how many played
function topCount(playerCount) {
  if (playerCount > 15) return 5;
  if (playerCount >= 3) return 3;
  return playerCount;
}

const MESSAGES = {
  'not-found': { title: 'Match not found', text: 'This match does not exist.' },
  'not-finished': { title: 'Results are not ready yet', text: 'They appear when the match ends.' },
};

export default function HostLeaderboard() {
  const { matchId } = useParams();
  const goBack = useGoBack();
  const [results, setResults] = useState(null);
  const [view, setView] = useState('loading'); // loading | results | not-found | not-finished
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await getStandings(matchId);
      if (cancelled) return;

      if (response.ok) {
        setResults(response);
        setView('results');
      } else setView(response.error);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

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
          <Link to={ROUTES.dashboard} className="live-primary-button live-button-link">Go to dashboard</Link>
        </div>
      </div>
    );
  }

  const shown = results.standings.slice(0, topCount(results.standings.length));
  const podium = shown.slice(0, 3); // 1st, 2nd, 3rd (CSS places 2nd left and 3rd right)
  const below = shown.slice(3); // 4th and 5th, when showing the top 5

  return (
    <div className="live-join-page live-stars-page">
      <div className="live-join-card live-host-card">
        <nav className="live-topnav" aria-label="Page">
          <button type="button" onClick={goBack}>← Back</button>
        </nav>

        <h1>{results.title}</h1>

        {shown.length === 0 ? (
          <p className="live-results-summary">No one played this match.</p>
        ) : (
          <ol className="live-podium">
            {podium.map((player, index) => (
              <li key={player.id} className={`live-podium-place live-podium-${index + 1}`}>
                <span className="live-podium-avatar" aria-hidden="true">{player.name.charAt(0)}</span>
                <span className="live-podium-name">{player.name}</span>
                <span className="live-podium-points">{player.points.toLocaleString()} pts</span>
                <span className="live-podium-block">
                  <span className="live-visually-hidden">Rank </span>
                  {player.rank}
                </span>
              </li>
            ))}
          </ol>
        )}

        {below.length > 0 && (
          <ol className="live-ranking">
            {below.map((player) => (
              <li key={player.id} className="live-rank-row">
                <span className="live-rank-number">{player.rank}</span>
                <span className="live-rank-name">{player.name}</span>
                <span className="live-rank-score">{player.points.toLocaleString()} pts</span>
              </li>
            ))}
          </ol>
        )}

        {shown.length > 0 && (
          <button
            type="button"
            className="live-secondary-button live-details-button"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
          >
            {showDetails ? 'Hide details' : 'Details'}
          </button>
        )}

        {showDetails && <QuestionTable stats={results.questionStats} />}

        <Link to={ROUTES.dashboard} className="live-primary-button live-button-link">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

/*
  One row per question: how many players got it right, wrong, or didn't answer.
  The popup (CSS :hover / :focus-within) shows the full question and how many picked each choice.
*/
function QuestionTable({ stats }) {
  return (
    <div className="live-stats">
      <table className="live-stats-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Question</th>
            <th scope="col">Right</th>
            <th scope="col">Wrong</th>
            <th scope="col">No answer</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((question, index) => (
            <tr key={question.id} className="live-stats-row" tabIndex={0} aria-describedby={`popup-${question.id}`}>
              <td>{index + 1}</td>
              <td className="live-stats-question">
                <span className="live-stats-question-text">{question.text}</span>
                <div id={`popup-${question.id}`} className="live-stats-popup" role="tooltip">
                  <p className="live-stats-popup-question">{question.text}</p>
                  <ul className="live-stats-choices">
                    {question.options.map((option, i) => (
                      <li
                        key={option}
                        className={i === question.correctIndex ? 'live-stats-choice live-stats-choice-right' : 'live-stats-choice'}
                      >
                        <span>
                          {option}
                          {i === question.correctIndex && <span className="live-visually-hidden"> (right answer)</span>}
                        </span>
                        <strong>{question.counts[i]}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
              <td className="live-stats-right">{question.correct}</td>
              <td className="live-stats-wrong">{question.wrong}</td>
              <td>{question.noAnswer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
