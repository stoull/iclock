import logo from './logo.svg';
import './App.css';

import { Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/APPContext';

import Home from './pages/Home';
import Analysis from './pages/Analysis';
import BackStage from './pages/BackStage';
import Examples from './pages/Examples';
import TestView from './pages/TestView';

function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}

export default App;
