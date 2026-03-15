import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './components/home';
import { MAZO_JUJUTSU } from './components/cartas';

function App() {
  return (
    <Home cartas={MAZO_JUJUTSU} />
  );
}

export default App;