import logo from './logo.svg';
import './App.css';

import { Route, Routes, Link} from 'react-router-dom';

import Home from './pages/Home';
import Analysis from './pages/Analysis';
import BackStage from './pages/BackStage';
import Examples from './pages/Examples';

function App() {
  console.log('App component rendered');
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/backstage" element={<BackStage />} />
        <Route path="/examples" element={<Examples />} />
      </Routes>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/home">Home</Link>
        <Link to="/analysis">Analysis</Link>
        <Link to="/backstage">BackStage</Link>
        <Link to="/examples">Examples</Link>
      </nav>
    </div>
  );
}

export default App;
