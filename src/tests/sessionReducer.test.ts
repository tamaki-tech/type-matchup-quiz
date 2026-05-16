import { describe, expect, it } from 'vitest';
import {
  ROUND_LENGTH,
  initialSessionState,
  sessionReducer,
} from '../state/sessionReducer';

describe('sessionReducer', () => {
  it('SET_MODE / SET_DIFFICULTY', () => {
    let s = initialSessionState;
    s = sessionReducer(s, { type: 'SET_MODE', mode: 'candidate-selection' });
    expect(s.mode).toBe('candidate-selection');
    s = sessionReducer(s, { type: 'SET_DIFFICULTY', difficulty: 'hard' });
    expect(s.difficulty).toBe('hard');
  });

  it('START_QUIZ で screen=quiz / currentQuestion 生成', () => {
    const s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    expect(s.screen).toBe('quiz');
    expect(s.currentQuestion).not.toBeNull();
    expect(s.currentQuestion!.opponents).toHaveLength(6);
  });

  it('SUBMIT_ANSWER (正解) で streak+1 / bestStreak 更新 / history 1件追加', () => {
    let s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    const correctIndex = s.currentQuestion!.correctChoiceIndexes[0];
    s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: correctIndex });
    expect(s.screen).toBe('explanation');
    expect(s.streak).toBe(1);
    expect(s.bestStreak).toBe(1);
    expect(s.history).toHaveLength(1);
    expect(s.history[0].correct).toBe(true);
    expect(s.lastAnswer).not.toBeNull();
    expect(s.lastAnswer!.correct).toBe(true);
    expect(s.lastAnswer!.explanation.length).toBeGreaterThan(0);
  });

  it('SUBMIT_ANSWER (スキップ=null) で streak=0 / history 不正解扱い', () => {
    let s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: null });
    expect(s.streak).toBe(0);
    expect(s.history[0].correct).toBe(false);
    expect(s.history[0].selectedChoiceIndex).toBeNull();
  });

  it('NEXT_QUESTION で新問題生成', () => {
    let s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    const id1 = s.currentQuestion!.id;
    s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: 0 });
    s = sessionReducer(s, { type: 'NEXT_QUESTION' });
    expect(s.screen).toBe('quiz');
    expect(s.currentQuestion!.id).not.toBe(id1);
    expect(s.lastAnswer).toBeNull();
  });

  it('GO_TO_RESULT / GO_TO_TOP', () => {
    let s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    s = sessionReducer(s, { type: 'GO_TO_RESULT' });
    expect(s.screen).toBe('result');
    s = sessionReducer(s, { type: 'GO_TO_TOP' });
    expect(s.screen).toBe('top');
    expect(s.currentQuestion).toBeNull();
    expect(s.lastAnswer).toBeNull();
  });

  it('RESET_STATS で history / streak / bestStreak がクリア', () => {
    let s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    const correctIndex = s.currentQuestion!.correctChoiceIndexes[0];
    s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: correctIndex });
    s = sessionReducer(s, { type: 'RESET_STATS' });
    expect(s.history).toHaveLength(0);
    expect(s.streak).toBe(0);
    expect(s.bestStreak).toBe(0);
  });

  it('START_QUIZ は roundAnswered を0にリセット', () => {
    let s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: 0 });
    expect(s.roundAnswered).toBe(1);
    s = sessionReducer(s, { type: 'START_QUIZ' });
    expect(s.roundAnswered).toBe(0);
  });

  it(`${ROUND_LENGTH}問解くと roundAnswered=${ROUND_LENGTH}、history は累積`, () => {
    let s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    for (let i = 0; i < ROUND_LENGTH; i += 1) {
      s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: 0 });
      if (i < ROUND_LENGTH - 1) s = sessionReducer(s, { type: 'NEXT_QUESTION' });
    }
    expect(s.roundAnswered).toBe(ROUND_LENGTH);
    expect(s.history.length).toBe(ROUND_LENGTH);
  });

  it('連続正解→不正解で streak リセット / bestStreak は保持', () => {
    let s = sessionReducer(initialSessionState, { type: 'START_QUIZ' });
    const idx1 = s.currentQuestion!.correctChoiceIndexes[0];
    s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: idx1 });
    s = sessionReducer(s, { type: 'NEXT_QUESTION' });
    const idx2 = s.currentQuestion!.correctChoiceIndexes[0];
    s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: idx2 });
    expect(s.streak).toBe(2);
    expect(s.bestStreak).toBe(2);
    s = sessionReducer(s, { type: 'NEXT_QUESTION' });
    // 不正解にするため正解と異なるインデックスを選ぶ
    const correctIdx = s.currentQuestion!.correctChoiceIndexes[0];
    const wrongIdx = correctIdx === 0 ? 1 : 0;
    if (s.currentQuestion!.correctChoiceIndexes.length < 2) {
      s = sessionReducer(s, { type: 'SUBMIT_ANSWER', selectedChoiceIndex: wrongIdx });
      expect(s.streak).toBe(0);
      expect(s.bestStreak).toBe(2);
    }
  });
});
