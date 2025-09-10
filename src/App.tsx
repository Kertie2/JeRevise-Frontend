import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MuiDsfrThemeProvider } from "@codegouvfr/react-dsfr/mui";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfesseurDashboard from './pages/professeur/Dashboard';
import EleveDashboard from './pages/eleve/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <MuiDsfrThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              
              {/* Routes professeur */}
              <Route 
                path="/professeur/*" 
                element={
                  <ProtectedRoute role="professeur">
                    <ProfesseurDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes élève */}
              <Route 
                path="/eleve/*" 
                element={
                  <ProtectedRoute role="eleve">
                    <EleveDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </MuiDsfrThemeProvider>
  );
}

export default App;