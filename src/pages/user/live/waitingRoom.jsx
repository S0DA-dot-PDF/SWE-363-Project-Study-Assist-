import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, getMatch, leaveMatch, startMatch } from './liveMatches';

/*
  LIVE-02  Waiting Room  (FR-09)
  Every player arrives here from Join Match (LIVE-01). This page decides where they belong:
  - Match not started → wait here; the player list updates until the host starts
  - Match running, or the host starts while waiting → the game (LIVE-03)
  - Match ended, cancelled by the host, or not found → message + link back to Join Match
  - Player not in this match (e.g. opened a shared link) → Join Match
  Leaving this page in any way (Back, a link, Leave match) removes the player from the match.
  Only being moved into the game keeps them in it.
  Leave match → confirm, then Join Match.
*/

const ROUTES = {
  joinMatch: '/live/join', // LIVE-01
  game: (matchId) => `/live/${matchId}/play`, // LIVE-03
  dashboard: '/dashboard',
};

// One page back; if there is no previous page in the app, go to the dashboard
function useGoBack() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => (location.key !== 'default' ? navigate(-1) : navigate(ROUTES.dashboard));
}


// How often to check whether the host has started (mock polling; a real backend would push updates)
const POLL_MS = 2000;

const MESSAGES = {
  'not-found': { title: 'Match not found', text: 'Check the code and try joining again.' },
  ended: { title: 'This match has ended', text: 'Join another match with a new code.' },
  cancelled: { title: 'The host cancelled this match', text: 'Join another match with a new code.' },
};

export default function WaitingRoom() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [user, setUser] = useState(null);
  const [match, setMatch] = useState(null);
  const [view, setView] = useState('loading'); // loading | waiting | not-found | ended | cancelled
  const [confirmingLeave, setConfirmingLeave] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let playerId = null; // set once we know the user is in this match
    let goingToGame = false;

    // Fetch the match and decide what to show
    async function check() {
      const currentUser = await getCurrentUser();
      const latest = await getMatch(matchId);
      if (cancelled) return;
      setUser(currentUser);

      if (!latest) setView('not-found');
      else if (latest.status === 'finished') setView('ended');
      else if (latest.status === 'cancelled') setView('cancelled');
      else if (!latest.players.some((p) => p.id === currentUser.id)) navigate(ROUTES.joinMatch, { replace: true });
      else if (latest.status !== 'waiting') {
        goingToGame = true;
        navigate(ROUTES.game(latest.id), { replace: true });
      } else {
        playerId = currentUser.id;
        setMatch(latest);
        setView('waiting');
      }
    }

    check(); // first check straight away
    const intervalId = setInterval(check, POLL_MS); // then every 2 seconds

    return () => {
      cancelled = true;
      clearInterval(intervalId); // stop checking when the page closes
      if (playerId && !goingToGame) leaveMatch(matchId, playerId); // leaving the page = leaving the match
    };
  }, [matchId, navigate]);

  // TESTING ONLY: press H to pretend the host pressed Start. Remove before submitting.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'h' || event.key === 'H') startMatch(matchId);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [matchId]);

  // Closing the page removes the player (see the cleanup above), so leaving is just going to Join Match
  function handleLeave() {
    navigate(ROUTES.joinMatch, { replace: true });
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

  if (view !== 'waiting') {
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

  const others = match.players.filter((p) => p.id !== user.id);
  const me = match.players.find((p) => p.id === user.id);

  return (
    <div className="live-join-page">
      <div className="live-join-card">
        <nav className="live-topnav" aria-label="Page">
          <button type="button" onClick={goBack}>← Back</button>
        </nav>

        <h1>{match.title}</h1>
        <p className="live-host">Hosted by <strong>{match.hostName}</strong></p>

        <div className="live-waiting-status" role="status">
          <span className="live-spinner" aria-hidden="true" />
          <span>Waiting for {match.hostName} to start the match…</span>
        </div>

        <h2 className="live-section-title">
          Players <span className="live-count">{match.players.length}</span>
        </h2>
        <ul className="live-player-list" aria-live="polite">
          <li className="live-player live-player-me">
            <span className="live-player-initial" aria-hidden="true">{me.name.charAt(0)}</span>
            {me.name} <span className="live-you">(you)</span>
          </li>
          {others.map((player) => (
            <li key={player.id} className="live-player">
              <span className="live-player-initial" aria-hidden="true">{player.name.charAt(0)}</span>
              {player.name}
            </li>
          ))}
        </ul>

        <button type="button" className="live-secondary-button" onClick={() => setConfirmingLeave(true)}>
          Leave match
        </button>
      </div>

      {confirmingLeave && (
        <LeaveDialog onStay={() => setConfirmingLeave(false)} onLeave={handleLeave} />
      )}
    </div>
  );
}

/* "Leave the match?" confirmation box, shown on top of the page while confirmingLeave is true */
function LeaveDialog({ onStay, onLeave }) {
  return (
    <div className="live-overlay">
      <div className="live-modal">
        <h2>Leave the match?</h2>
        <p>You'll go back to Join match. You can rejoin later with the same code.</p>
        <div className="live-modal-actions">
          <button type="button" className="live-secondary-button" onClick={onStay}>Stay</button>
          <button type="button" className="live-danger-button" onClick={onLeave}>Leave match</button>
        </div>
      </div>
    </div>
  );
}
