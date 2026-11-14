import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { cancelMatch, getMatch, openHostLobby, startMatch } from './liveMatches';

/*
  LIVE-05  Host Lobby  (FR-16) — educators only
  Shows the join code large and clear, the players as they join, and Start / Cancel.
  - Start needs at least one player → LIVE-06 Host Question
  - Cancel → confirm; players in the waiting room are told the match was cancelled
  - Match not found, or over → message
  (Only published quizzes can be hosted: createMatch refuses the rest, so no check is needed here.)
  - Match already running → LIVE-06
  TODO(auth): only the match's host (an educator) should reach this page.
*/

const ROUTES = {
  hostGame: (matchId) => `/live/${matchId}/host/play`, // LIVE-06
  dashboard: '/dashboard',
};

// One page back; if there is no previous page in the app, go to the dashboard
function useGoBack() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => (location.key !== 'default' ? navigate(-1) : navigate(ROUTES.dashboard));
}

// How often to refresh the player list (mock polling; a real backend would push updates)
const POLL_MS = 2000;

const MESSAGES = {
  'not-found': { title: 'Match not found', text: 'This match does not exist.' },
  over: { title: 'This match is over', text: 'It was cancelled or has finished.' },
};

export default function HostLobby() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [match, setMatch] = useState(null);
  const [view, setView] = useState('loading'); // loading | lobby | not-found | over
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    openHostLobby(matchId);

    // Fetch the match and decide what to show
    async function check() {
      const latest = await getMatch(matchId);
      if (cancelled) return;

      if (!latest) setView('not-found');
      else if (latest.status === 'in-progress') navigate(ROUTES.hostGame(latest.id), { replace: true });
      else if (latest.status !== 'waiting') setView('over');
      else {
        setMatch(latest);
        setView('lobby');
      }
    }

    check(); // first check straight away
    const intervalId = setInterval(check, POLL_MS); // then every 2 seconds

    return () => {
      cancelled = true;
      clearInterval(intervalId); // stop checking when the page closes
    };
  }, [matchId, navigate]);

  async function handleStart() {
    setStarting(true);
    await startMatch(matchId);
    navigate(ROUTES.hostGame(matchId), { replace: true });
  }

  async function handleCancel() {
    await cancelMatch(matchId);
    navigate(ROUTES.dashboard, { replace: true });
  }

  if (view === 'loading') {
    return (
      <div className="live-join-page">
        <div className="live-join-card live-center" role="status">
          <span className="live-spinner" aria-hidden="true" />
          <p>Loading match…</p>
        </div>
      </div>
    );
  }

  if (view !== 'lobby') {
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

  const playerCount = match.players.length;
  const lastPlayer = match.players[playerCount - 1];

  return (
    <div className="live-join-page">
      <div className="live-join-card live-host-card">
        <nav className="live-topnav" aria-label="Page">
          <button type="button" onClick={goBack}>← Back</button>
        </nav>

        <div className="live-title-row">
          <h1>{match.title}</h1>
          <span className="live-title-tag">Lobby</span>
        </div>

        <div className="live-code-display">
          <p className="live-code-label">Join code</p>
          <p className="live-code-digits">
            {match.code.slice(0, 3)} {match.code.slice(3)}
          </p>
        </div>

        <div className="live-lobby-body">
          <div className="live-lobby-actions">
            <button
              type="button"
              className="live-primary-button"
              onClick={handleStart}
              disabled={playerCount === 0 || starting}
            >
              {starting ? 'Starting…' : 'Start match'}
            </button>
            <button type="button" className="live-secondary-button" onClick={() => setConfirmingCancel(true)}>
              Cancel match
            </button>
            {playerCount === 0 && <p className="live-host-hint">Start becomes available once a player joins.</p>}
          </div>

          <section className="live-players-panel" aria-label="Players">
            <p className="live-player-total">
              <span className="live-player-total-number">{playerCount}</span>
              {playerCount === 1 ? 'player' : 'players'}
            </p>

            {playerCount === 0 ? (
              <div className="live-waiting-status" role="status">
                <span className="live-spinner" aria-hidden="true" />
                <span>Waiting for players to join…</span>
              </div>
            ) : (
              <>
                <ul className="live-avatar-row">
                  {match.players.map((player) => (
                    <li key={player.id} className="live-avatar" title={player.name}>
                      <span aria-hidden="true">{player.name.charAt(0)}</span>
                      <span className="live-visually-hidden">{player.name}</span>
                    </li>
                  ))}
                </ul>
                <p className="live-last-joined" aria-live="polite">
                  <strong>{lastPlayer.name}</strong> just joined
                </p>
              </>
            )}
          </section>
        </div>
      </div>

      {confirmingCancel && (
        <CancelDialog onKeep={() => setConfirmingCancel(false)} onCancel={handleCancel} />
      )}
    </div>
  );
}

/* "Cancel this match?" confirmation box, shown on top of the page while confirmingCancel is true */
function CancelDialog({ onKeep, onCancel }) {
  return (
    <div className="live-overlay">
      <div className="live-modal">
        <h2>Cancel this match?</h2>
        <p>Players in the waiting room will be told the match was cancelled, and the code will stop working.</p>
        <div className="live-modal-actions">
          <button type="button" className="live-secondary-button" onClick={onKeep}>Keep match</button>
          <button type="button" className="live-danger-button" onClick={onCancel}>Cancel match</button>
        </div>
      </div>
    </div>
  );
}
