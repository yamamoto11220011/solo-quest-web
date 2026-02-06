import { useStore } from "./store/useStore";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./components/features/dashboard/Dashboard";
import { FocusView } from "./components/features/focus/FocusView";
import { WeeklyReport } from "./components/features/analysis/WeeklyReport";

function App() {
  const { view } = useStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {view === 'dashboard' && <Header />}

      <main className="flex-1 w-full">
        {view === 'dashboard' && <Dashboard />}
        {view === 'analysis' && <WeeklyReport />}
        {view === 'focus' && <FocusView />}
      </main>
    </div>
  )
}

export default App
