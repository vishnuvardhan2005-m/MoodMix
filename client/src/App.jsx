import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Header from './components/Header';
import MiniPlayer from './components/MiniPlayer';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="h-screen w-screen overflow-hidden bg-[#F4F0E7] text-[#111111] flex flex-col antialiased">
          <Header />

          <main className="flex-1 overflow-hidden relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/player" element={<PlayerPage />} />
            </Routes>
          </main>

          <MiniPlayer />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
