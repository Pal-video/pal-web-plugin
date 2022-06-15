import {PalSession} from './models/session.model';

const sessionKey = 'PalSession';

export class LocalstorageService {
  private _session: PalSession | null = null;

  constructor() {
    const saveSession =
      sessionStorage.getItem(sessionKey) || localStorage.getItem(sessionKey);
    if (saveSession) {
      this._session = JSON.parse(saveSession);
    }
  }

  /**
   * Check if user has a session stored
   * @returns True if the user session is set.
   */
  hasSession(): boolean {
    return !!this.session;
  }

  /**
   * Gets the user session stored.
   * @return The user session or null if no session found.
   */
  get session(): PalSession | null {
    return this._session;
  }

  /**
   * Sets the user session.
   * Otherwise, the credentials are only persisted for the current session.
   * @param session The user session.
   * @param remember True to remember credentials across sessions (default true).
   */
  setSession(session?: PalSession, remember?: boolean) {
    this._session = session || null;

    if (session) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(sessionKey, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(sessionKey);
      localStorage.removeItem(sessionKey);
    }
  }
}
