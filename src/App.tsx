import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { api } from './lib/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Diary from './pages/Diary';
import DiaryNew from './pages/DiaryNew';
import Treehole from './pages/Treehole';
import Mediation from './pages/Mediation';
import Settings from './pages/Settings';
import './index.css';

function App() {
  const { user, token, setUser, setToken } = useAppStore();

  useEffect(() => {
    if (token) {
      api.setToken(token);
    }
  }, [token]);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || !token) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (user && token) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/diary" element={
          <ProtectedRoute>
            <Diary />
          </ProtectedRoute>
        } />
        <Route path="/diary/new" element={
          <ProtectedRoute>
            <DiaryNew />
          </ProtectedRoute>
        } />
        <Route path="/treehole" element={
          <ProtectedRoute>
            <Treehole />
          </ProtectedRoute>
        } />
        <Route path="/mediation" element={
          <ProtectedRoute>
            <Mediation />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
