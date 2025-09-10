import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { useAuth } from '../../contexts/AuthContext';
import ProfesseurHome from './ProfesseurHome';
import CoursManagement from './CoursManagement';
import QCMManagement from './QCMManagement';
import SuiviEleves from './SuiviEleves';
import ConfigurationInitiale from './ConfigurationInitiale';

const ProfesseurDashboard: React.FC = () => {
  const { user } = useAuth();

  // Si première connexion, afficher la configuration
  if (user?.premiere_connexion) {
    return <ConfigurationInitiale />;
  }

  return (
    <div className={fr.cx("fr-container")}>
      <Routes>
        <Route path="/" element={<ProfesseurHome />} />
        <Route path="/cours" element={<CoursManagement />} />
        <Route path="/qcm" element={<QCMManagement />} />
        <Route path="/suivi" element={<SuiviEleves />} />
      </Routes>
    </div>
  );
};

export default ProfesseurDashboard;