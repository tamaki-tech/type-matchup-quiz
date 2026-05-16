import { AppHeader } from '../components/AppHeader';
import { GhostButton } from '../components/GhostButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { TypeChip } from '../components/TypeChip';
import {
  selectRecentAccuracy,
  selectTotalAnswered,
  selectTotalCorrect,
  selectWeakTypes,
} from '../state/selectors';
import { useQuizFlow } from '../hooks/useQuizFlow';

export function ResultScreen() {
  const { state, next, goToTop, resetStats } = useQuizFlow();
  const accuracy = selectRecentAccuracy(state, 10);
  const total = selectTotalAnswered(state);
  const correct = selectTotalCorrect(state);
  const weaknesses = selectWeakTypes(state, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader logoMark="∑" title="成績" meta="SESSION" />
      <div className="flex-1 px-5 py-5 pb-8 max-w-md mx-auto w-full flex flex-col">
        <div className="text-center pt-5 pb-6 border-b border-border-base mb-6">
          <div className="font-mono text-[10px] tracking-widest3 text-accent mb-2.5">
            直近10問の正答率
          </div>
          <div className="font-display text-[64px] leading-none tracking-tight mb-1.5">
            {accuracy}
            <span className="text-[32px] text-text-dim ml-0.5">%</span>
          </div>
          <div className="font-mono text-[11px] text-text-dim tracking-wider2">ACCURACY</div>
        </div>

        <div className="grid grid-cols-3 gap-px bg-border-base border border-border-base mb-6">
          <div className="bg-surface px-2 py-3.5 text-center">
            <div className="font-mono text-xl font-bold leading-none mb-1">{total}</div>
            <div className="font-mono text-[9px] text-text-mute tracking-wider2">総回答数</div>
          </div>
          <div className="bg-surface px-2 py-3.5 text-center">
            <div className="font-mono text-xl font-bold leading-none mb-1">{correct}</div>
            <div className="font-mono text-[9px] text-text-mute tracking-wider2">正解数</div>
          </div>
          <div className="bg-surface px-2 py-3.5 text-center">
            <div className="font-mono text-xl font-bold leading-none mb-1">{state.bestStreak}</div>
            <div className="font-mono text-[9px] text-text-mute tracking-wider2">連続ベスト</div>
          </div>
        </div>

        <div className="bg-surface border border-border-base p-3.5 mb-6">
          <div className="font-mono text-[10px] tracking-wider2 text-text-dim mb-3 flex justify-between items-center">
            <span>苦手タイプ</span>
            <span className="bg-incorrect-bg text-incorrect px-1.5 py-0.5 text-[9px] font-mono">
              {weaknesses.length}件
            </span>
          </div>
          {weaknesses.length === 0 ? (
            <div className="text-[12px] text-text-mute text-center py-3">
              まだデータがありません
            </div>
          ) : (
            weaknesses.map((w, i) => (
              <div
                key={w.type}
                className={`flex items-center justify-between py-2.5 ${i === 0 ? '' : 'border-t border-border-base'}`}
              >
                <div className="flex items-center gap-2.5">
                  <TypeChip type={w.type} />
                  <span className="text-[11px] text-text-dim">
                    {w.mistakeCount}回 / {w.totalAppearances}回
                  </span>
                </div>
                <span className="font-mono text-xs text-incorrect font-bold">
                  {w.errorRate}%
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2.5 mt-auto">
          <PrimaryButton onClick={next}>
            もう一度プレイ
            <span aria-hidden="true" className="font-mono font-bold">
              →
            </span>
          </PrimaryButton>
          <GhostButton onClick={goToTop}>トップへ戻る</GhostButton>
          <GhostButton onClick={resetStats}>成績をリセット</GhostButton>
        </div>
      </div>
    </div>
  );
}
