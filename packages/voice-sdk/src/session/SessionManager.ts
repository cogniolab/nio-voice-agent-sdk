import {
  VoiceSession,
  SessionConfig,
  SessionStatus,
  SessionError
} from '../types';
import { randomUUID } from 'crypto';

/**
 * Manages voice sessions
 */
export class SessionManager {
  private sessions: Map<string, VoiceSession> = new Map();

  /**
   * Create a new session
   */
  createSession(config: SessionConfig = {}): VoiceSession {
    const session: VoiceSession = {
      id: config.id || randomUUID(),
      status: SessionStatus.IDLE,
      config,
      startedAt: new Date(),
      metadata: config.metadata || {}
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(id: string): VoiceSession | undefined {
    return this.sessions.get(id);
  }

  /**
   * Update session status
   */
  updateSessionStatus(id: string, status: SessionStatus): void {
    const session = this.getSession(id);
    if (!session) {
      throw new SessionError(`Session not found: ${id}`, id);
    }

    session.status = status;

    if (status === SessionStatus.ENDED) {
      session.endedAt = new Date();
      session.duration = (session.endedAt.getTime() - session.startedAt.getTime()) / 1000;
    }
  }

  /**
   * Update session metadata
   */
  updateSessionMetadata(id: string, metadata: Record<string, any>): void {
    const session = this.getSession(id);
    if (!session) {
      throw new SessionError(`Session not found: ${id}`, id);
    }

    session.metadata = { ...session.metadata, ...metadata };
  }

  /**
   * End session
   */
  endSession(id: string): void {
    const session = this.getSession(id);
    if (!session) {
      throw new SessionError(`Session not found: ${id}`, id);
    }

    this.updateSessionStatus(id, SessionStatus.ENDED);
  }

  /**
   * Delete session
   */
  deleteSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): VoiceSession[] {
    return Array.from(this.sessions.values()).filter(
      s => s.status === SessionStatus.ACTIVE || s.status === SessionStatus.CONNECTING
    );
  }

  /**
   * Clean up ended sessions older than specified duration (default: 1 hour)
   */
  cleanupOldSessions(maxAgeMs: number = 3600000): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, session] of this.sessions.entries()) {
      if (
        session.status === SessionStatus.ENDED &&
        session.endedAt &&
        (now - session.endedAt.getTime()) > maxAgeMs
      ) {
        this.sessions.delete(id);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get session statistics
   */
  getStats(): {
    total: number;
    active: number;
    ended: number;
    error: number;
  } {
    const sessions = Array.from(this.sessions.values());

    return {
      total: sessions.length,
      active: sessions.filter(s => s.status === SessionStatus.ACTIVE).length,
      ended: sessions.filter(s => s.status === SessionStatus.ENDED).length,
      error: sessions.filter(s => s.status === SessionStatus.ERROR).length
    };
  }
}
