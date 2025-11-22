import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Insights } from './pages/Insights';
import { Routes as RoutesPage } from './pages/Routes';
import { Devices } from './pages/Devices';
import { Profile } from './pages/Profile';
import { BottomNav } from './components/BottomNav';
import { ChatDrawer } from './components/ChatDrawer';

function App() {
  useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard />
                <BottomNav />
                <ChatDrawer />
              </>
            }
          />
          <Route
            path="/insights"
            element={
              <>
                <Insights />
                <BottomNav />
                <ChatDrawer />
              </>
            }
          />
          <Route
            path="/routes"
            element={
              <>
                <RoutesPage />
                <BottomNav />
                <ChatDrawer />
              </>
            }
          />
          <Route
            path="/devices"
            element={
              <>
                <Devices />
                <BottomNav />
                <ChatDrawer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Profile />
                <BottomNav />
                <ChatDrawer />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
