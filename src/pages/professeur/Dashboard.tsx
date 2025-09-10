import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { useAuth } from '../../contexts/AuthContext';
import ProfesseurHome from './ProfesseurHome';
import CoursManagement from './CoursManagement';
import CoursDetails from './CoursDetails'; // Nouveau
import QCMManagement from './QCMManagement';
import SuiviEleves from './SuiviEleves';
import ConfigurationInitiale from './ConfigurationInitiale';

const ProfesseurDashboard: React.FC = () => {
  const { user } = useAuth();

  if (user?.premiere_connexion) {
    return <ConfigurationInitiale />;
  }

  return (
    <div className={fr.cx("fr-container")}>
      <Routes>
        <Route path="/" element={<ProfesseurHome />} />
        <Route path="/cours" element={<CoursManagement />} />
        <Route path="/cours/:id" element={<CoursDetails />} /> {/* Nouvelle route */}
        <Route path="/qcm" element={<QCMManagement />} />
        <Route path="/suivi" element={<SuiviEleves />} />
      </Routes>
    </div>
  );
};

export default ProfesseurDashboard;