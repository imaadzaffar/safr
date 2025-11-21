import { useEffect } from 'react';
import { FlightProvider } from './context/FlightContext';
import { AppShell } from './components/Layout/AppShell';
import { GlobeView } from './components/Globe/GlobeView';
import { TopBar } from './components/Layout/TopBar';
import { FlightPanel } from './components/Flight/FlightPanel';
import { loadAirports } from './utils/airports';

const AppContent: React.FC = () => {
  return (
    <AppShell>
      {/* Background View */}
      <div className="absolute inset-0 z-0">
        <GlobeView />
      </div>

      {/* UI Overlays */}
      <TopBar />
      <FlightPanel />
    </AppShell>
  );
};

function App() {
  // Load airports database on app start
  useEffect(() => {
    loadAirports().catch(console.error);
  }, []);

  return (
    <FlightProvider>
      <AppContent />
    </FlightProvider>
  );
}

export default App;
