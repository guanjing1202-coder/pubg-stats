import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Player from './pages/Player';
import Match from './pages/Match';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/player/:platform/:playerName" element={<Player />} />
              <Route path="/match/:platform/:matchId" element={<Match />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
