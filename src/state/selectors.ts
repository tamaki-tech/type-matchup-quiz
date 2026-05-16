import type { PokemonType } from '../types/pokemon';
import type { QuizResult } from '../types/quiz';
import type { SessionState } from '../types/session';

export function selectTotalAnswered(state: SessionState): number {
  return state.history.length;
}

export function selectTotalCorrect(state: SessionState): number {
  return state.history.filter((h) => h.correct).length;
}

export function selectOverallAccuracy(state: SessionState): number {
  const total = state.history.length;
  if (total === 0) return 0;
  return Math.round((selectTotalCorrect(state) / total) * 100);
}

export function selectRecentAccuracy(state: SessionState, window: number = 10): number {
  if (state.history.length === 0) return 0;
  const recent = state.history.slice(-window);
  const correct = recent.filter((h) => h.correct).length;
  return Math.round((correct / recent.length) * 100);
}

export type WeakTypeEntry = {
  type: PokemonType;
  mistakeCount: number;
  totalAppearances: number;
  errorRate: number;
};

function countTypeAppearancesPerResult(result: QuizResult): PokemonType[] {
  return result.mistakeTypes;
}

export function selectWeakTypes(state: SessionState, top: number = 3): WeakTypeEntry[] {
  const mistakeCounts = new Map<PokemonType, number>();
  const appearCounts = new Map<PokemonType, number>();
  for (const h of state.history) {
    const mistake = countTypeAppearancesPerResult(h);
    for (const t of mistake) {
      mistakeCounts.set(t, (mistakeCounts.get(t) ?? 0) + 1);
    }
    for (const t of mistake) {
      appearCounts.set(t, (appearCounts.get(t) ?? 0) + 1);
    }
  }
  const entries: WeakTypeEntry[] = Array.from(mistakeCounts.entries()).map(([type, mistakeCount]) => {
    const totalAppearances = appearCounts.get(type) ?? mistakeCount;
    return {
      type,
      mistakeCount,
      totalAppearances,
      errorRate: Math.round((mistakeCount / totalAppearances) * 100),
    };
  });
  entries.sort((a, b) => b.mistakeCount - a.mistakeCount);
  return entries.slice(0, top);
}
