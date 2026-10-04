const SESSION_KEY = "analytics_session";
const SESSION_TIMEOUT = 30 * 60 * 1000; 

type StoredSession = {
  sessionId: string;
  lastActivityAt: number;
};

function createSessionId(): string {
  return crypto.randomUUID();
}

export function getSessionId(): string {
  const stored = localStorage.getItem(SESSION_KEY);

  if (!stored) {
    return createNewSession();
  }

  const session: StoredSession = JSON.parse(stored);

  const now = Date.now();
  const inactiveFor = now - session.lastActivityAt;

  if (inactiveFor < SESSION_TIMEOUT) {
    session.lastActivityAt = now;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );

    return session.sessionId;
  }

  return createNewSession();
}

function createNewSession(): string {
  const session: StoredSession = {
    sessionId: createSessionId(),
    lastActivityAt: Date.now(),
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  return session.sessionId;
}