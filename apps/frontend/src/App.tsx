import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { blue, yellow } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './AuthContext';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: blue,
    secondary: yellow,
    background: {
      default: '#181c24',
      paper: '#23293a',
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}


function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const { isAuthenticated, logout } = useAuth();
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!isLoginPage && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: !isLoginPage ? '240px' : 0 }}>
        {!isLoginPage && isAuthenticated && (
          <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2, boxShadow: 'none', background: 'none' }}>
            <Toolbar sx={{ justifyContent: 'flex-end' }}>
              <Button color="inherit" onClick={logout} sx={{ fontWeight: 600 }}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
