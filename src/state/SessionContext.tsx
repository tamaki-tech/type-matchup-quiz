import { createContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { SessionState } from '../types/session';
import { initialSessionState, sessionReducer, type SessionAction } from './sessionReducer';

export type SessionContextValue = {
  state: SessionState;
  dispatch: Dispatch<SessionAction>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);
  return (
    <SessionContext.Provider value={{ state, dispatch }}>{children}</SessionContext.Provider>
  );
}
