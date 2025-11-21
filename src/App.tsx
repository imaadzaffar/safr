import { FlightProvider } from './context/FlightContext';
import { AppShell } from './components/Layout/AppShell';
import { FlightInput } from './components/Flight/FlightInput';
import { FlightList } from './components/Flight/FlightList';
import { GlobeView } from './components/Globe/GlobeView';
import { StatsOverview } from './components/Dashboard/StatsOverview';

function App() {
  return (
    <FlightProvider>
      <AppShell>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy mb-2">Welcome to Safr</h2>
            <p className="text-lg text-gray-600">Track your journeys around the globe.</p>
          </div>

          <StatsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <GlobeView />
              <FlightList />
            </div>
            <div>
              <FlightInput />
            </div>
          </div>
        </div>
      </AppShell>
    </FlightProvider>
  );
}

export default App;
