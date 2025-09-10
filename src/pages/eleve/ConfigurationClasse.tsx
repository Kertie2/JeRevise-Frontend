import React, { useState, useEffect } from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Classe } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ConfigurationClasse: React.FC = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await authAPI.getClasses();
      const classesNormales = response.data.filter((c: Classe) => c.niveau !== 'brevet');
      setClasses(classesNormales);
    } catch (error) {
      setError('Erreur lors du chargement des classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClasse) {
      setError('Veuillez sélectionner votre classe');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await authAPI.setClasseEleve(parseInt(selectedClasse));
      
      if (user) {
        const updatedUser = { ...user, first_login: false, classe_id: parseInt(selectedClasse) };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      }
    } catch (error) {
      setError('Erreur lors de la configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement des classes..." />;
  }

  const groupedClasses = classes.reduce((acc, classe) => {
    if (!acc[classe.niveau]) acc[classe.niveau] = [];
    acc[classe.niveau].push(classe);
    return acc;
  }, {} as Record<string, Classe[]>);

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className={fr.cx("fr-card", "fr-enlarge-link")}>
          <div className={fr.cx("fr-card__body")}>
            <div className={fr.cx("fr-card__content")}>
              <h3 className={fr.cx("fr-card__title")}>Sélection de votre classe</h3>
              <p className={fr.cx("fr-card__desc")}>
                Bonjour {user?.prenom} ! Pour commencer à utiliser JeRevise, veuillez sélectionner votre classe.
              </p>
              
              <div style={{ marginBottom: '2rem' }}>
                {Object.entries(groupedClasses).map(([niveau, classesNiveau]) => (
                  <div key={niveau} style={{ marginBottom: '1.5rem' }}>
                    <h4>{niveau}</h4>
                    <RadioButtons
                      legend={`Classes de ${niveau}`}
                      options={classesNiveau.map(classe => ({
                        label: `${classe.nom}`,
                        nativeInputProps: { 
                          value: classe.id.toString(),
                          name: `classe-${niveau}`
                        }
                      }))}
                      state={selectedClasse}
                      onChange={setSelectedClasse}
                    />
                  </div>
                ))}
              </div>

              {error && (
                <Alert
                  severity="error"
                  title="Erreur"
                  description={error}
                />
              )}

              <Button
                onClick={handleSubmit}
                disabled={isSaving || !selectedClasse}
                style={{ width: '100%' }}
              >
                {isSaving ? 'Configuration...' : 'Confirmer ma classe'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationClasse;