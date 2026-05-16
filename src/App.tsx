import { ExplanationScreen } from './screens/ExplanationScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TopScreen } from './screens/TopScreen';
import { useSession } from './hooks/useSession';

export function App() {
  const { state } = useSession();
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
