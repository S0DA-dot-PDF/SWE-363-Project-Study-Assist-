import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, joinMatch } from './liveMatches';

/*
  LIVE-01  Join Match  (FR-09)
  Logged-in users only. Enter a 6-digit code and join.
  - Valid code → waiting room (LIVE-02), which sends the player on to the game if it's running
  - Invalid code or ended match → error
  The player appears under their account name.
*/

const ROUTES = {
  waitingRoom: (matchId) => `/live/${matchId}/waiting`, // LIVE-02
  dashboard: '/dashboard',
};

// One page back; if there is no previous page in the app, go to the dashboard
function useGoBack() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => (location.key !== 'default' ? navigate(-1) : navigate(ROUTES.dashboard));
}

const CODE_LENGTH = 6;

const ERROR_MESSAGES = {
  invalid: 'Invalid match code.',
  ended: 'This match has ended.',
};

export default function JoinMatch() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [user, setUser] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser().then((u) => {
      if (!cancelled) setUser(u);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCodeChange(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (code.length !== CODE_LENGTH) {
      setError(ERROR_MESSAGES.invalid);
      return;
    }

    setJoining(true);
    const result = await joinMatch(code, user);
    setJoining(false);

    if (result.ok) navigate(ROUTES.waitingRoom(result.match.id));
    else setError(ERROR_MESSAGES[result.error]);
  }

  return (
    <div className="live-join-page">
      <div className="live-join-card">
        <nav className="live-topnav" aria-label="Page">
          <button type="button" onClick={goBack}>← Back</button>
        </nav>

        <h1>Join a live match</h1>
        <p>Enter the code your instructor shared.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="match-code">Match code</label>
          <input
            id="match-code"
            className="live-code-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000000"
            value={code}
            onChange={handleCodeChange}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'match-code-error' : undefined}
          />
          {error && (
            <p className="error-message" id="match-code-error" role="alert">{error}</p>
          )}

          <button type="submit" className="live-primary-button" disabled={joining || !user}>
            {joining ? 'Joining…' : 'Join match'}
          </button>
        </form>
      </div>
    </div>
  );
}
