import { useCallback } from 'react';
import type { Difficulty, Mode } from '../types/quiz';
import { useSession } from './useSession';

export function useQuizFlow() {
  const { state, dispatch } = useSession();

  const setMode = useCallback((mode: Mode) => dispatch({ type: 'SET_MODE', mode }), [dispatch]);
  const setDifficulty = useCallback(
    (difficulty: Difficulty) => dispatch({ type: 'SET_DIFFICULTY', difficulty }),
    [dispatch],
  );
  const start = useCallback(() => dispatch({ type: 'START_QUIZ' }), [dispatch]);
  const submit = useCallback(
    (selectedChoiceIndex: number) =>
      dispatch({ type: 'SUBMIT_ANSWER', selectedChoiceIndex }),
    [dispatch],
  );
  const skip = useCallback(
    () => dispatch({ type: 'SUBMIT_ANSWER', selectedChoiceIndex: null }),
    [dispatch],
  );
  const next = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), [dispatch]);
  const goToResult = useCallback(() => dispatch({ type: 'GO_TO_RESULT' }), [dispatch]);
  const goToTop = useCallback(() => dispatch({ type: 'GO_TO_TOP' }), [dispatch]);
  const resetStats = useCallback(() => dispatch({ type: 'RESET_STATS' }), [dispatch]);

  return {
    state,
    setMode,
    setDifficulty,
    start,
    submit,
    skip,
    next,
    goToResult,
    goToTop,
    resetStats,
  };
}
