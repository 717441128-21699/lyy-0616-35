import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import usePortfolioStore from './store/usePortfolioStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WizardPage from './pages/WizardPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioViewPage from './pages/PortfolioViewPage';
import PortfolioPreview from './pages/PortfolioPreview';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const user = useAuthStore((s) => s.user);
  const currentUsername = usePortfolioStore((s) => s.currentUsername);
  const initForUser = usePortfolioStore((s) => s.initForUser);

  useEffect(() => {
    if (user && user.username !== currentUsername) {
      initForUser(user.username);
    }
  }, [user, currentUsername, initForUser]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/wizard" element={<ProtectedRoute><WizardPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/preview/:username" element={<ProtectedRoute><PortfolioPreview /></ProtectedRoute>} />
      <Route path="/u/:username" element={<PortfolioViewPage />} />
    </Routes>
  );
}

export default App;
