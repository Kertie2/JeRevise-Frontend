import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { useAuth } from '../../contexts/AuthContext';
import EleveHome from './EleveHome';
import Revisions from './Revisions';
import Resultats from './Resultats';
import ConfigurationClasse from './ConfigurationClasse';

const EleveDashboard: React.FC = () => {
  const { user } = useAuth();

  // Si première connexion, afficher la sélection de classe
  if (user?.first_login) {
    return <ConfigurationClasse />;
  }

  return (
    <div className={fr.cx("fr-container")}>
      <Routes>
        <Route path="/" element={<EleveHome />} />
        <Route path="/revisions" element={<Revisions />} />
        <Route path="/resultats" element={<Resultats />} />
      </Routes>
    </div>
  );
};

export default EleveDashboard;