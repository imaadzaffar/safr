import { FlightProvider, useFlights } from './context/FlightContext';
import { AppShell } from './components/Layout/AppShell';
import { GlobeView } from './components/Globe/GlobeView';
import { MapView } from './components/Map/MapView';
import { Sidebar } from './components/Layout/Sidebar';
import { ViewToggle } from './components/UI/ViewToggle';

const AppContent: React.FC = () => {
  const { viewMode } = useFlights();

  return (
    <AppShell>
      {/* Background View */}
      <div className="absolute inset-0 z-0">
        {viewMode === '3D' ? <GlobeView /> : <MapView />}
      </div>

      {/* UI Overlays */}
      <Sidebar />
      <ViewToggle />
    </AppShell>
  );
};

function App() {
  return (
    <FlightProvider>
      <AppContent />
    </FlightProvider>
  );
}

export default App;
