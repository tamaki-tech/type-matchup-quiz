import { useEffect } from 'react';
import { ExplanationScreen } from './screens/ExplanationScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TopScreen } from './screens/TopScreen';
import { useSession } from './hooks/useSession';

export function App() {
  const { state } = useSession();

  // SPA画面遷移ごとにページ最上部へリセット。スマホで前画面のスクロール位置を引き継ぐと、
  // 解説の正誤バナーやヘッダーが画面外になる事故を防ぐ。
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.screen, state.currentQuestion?.id]);

  switch (state.screen) {
    case 'top':
      return <TopScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'explanation':
      return <ExplanationScreen />;
    case 'result':
      return <ResultScreen />;
    default:
      return null;
  }
}
