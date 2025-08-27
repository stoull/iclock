import logo from './logo.svg';
import './App.css';

import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Analysis from './pages/Analysis';
import BackStage from './pages/BackStage';
import Examples from './pages/Examples';
import TestView from './pages/TestView';

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
        <Route path="/testview" element={<TestView />} />
      </Routes>
    </div>
  );
}

export default App;
