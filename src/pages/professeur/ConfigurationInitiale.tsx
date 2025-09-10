import React, { useState, useEffect } from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Classe, Matiere } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ConfigurationInitiale: React.FC = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedMatieres, setSelectedMatieres] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [classesRes, matieresRes] = await Promise.all([
        authAPI.getClasses(),
        authAPI.getMatieres()
      ]);
      setClasses(classesRes.data);
      setMatieres(matieresRes.data);
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedClasses.length === 0 || selectedMatieres.length === 0) {
      setError('Veuillez sélectionner au moins une classe et une matière');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await authAPI.configurerProfesseur({
        classes_ids: selectedClasses,
        matieres_ids: selectedMatieres
      });

      if (user) {
        const updatedUser = { ...user, premiere_connexion: false };
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
    return <LoadingSpinner message="Chargement de la configuration..." />;
  }

  const groupedClasses = classes.reduce((acc, classe) => {
    if (!acc[classe.niveau]) acc[classe.niveau] = [];
    acc[classe.niveau].push(classe);
    return acc;
  }, {} as Record<string, Classe[]>);

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div className={fr.cx("fr-card", "fr-enlarge-link")}>
          <div className={fr.cx("fr-card__body")}>
            <div className={fr.cx("fr-card__content")}>
              <h3 className={fr.cx("fr-card__title")}>Configuration de votre compte</h3>
              <p className={fr.cx("fr-card__desc")}>
                Bienvenue ! Configurons votre compte professeur en sélectionnant vos matières et classes.
              </p>
              
              <div style={{ marginBottom: '2rem' }}>
                <h4>Matières enseignées</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {matieres.map(matiere => (
                    <Checkbox
                      key={matiere.id}
                      options={[
                        {
                          label: matiere.nom,
                          nativeInputProps: {
                            checked: selectedMatieres.includes(matiere.id),
                            onChange: (e) => {
                              if (e.target.checked) {
                                setSelectedMatieres([...selectedMatieres, matiere.id]);
                              } else {
                                setSelectedMatieres(selectedMatieres.filter(id => id !== matiere.id));
                              }
                            }
                          }
                        }
                      ]}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4>Classes gérées</h4>
                {Object.entries(groupedClasses).map(([niveau, classesNiveau]) => (
                  <div key={niveau} style={{ marginBottom: '1rem' }}>
                    <h5>{niveau}</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                      {classesNiveau.map(classe => (
                        <Checkbox
                          key={classe.id}
                          options={[
                            {
                              label: classe.nom,
                              nativeInputProps: {
                                checked: selectedClasses.includes(classe.id),
                                onChange: (e) => {
                                  if (e.target.checked) {
                                    setSelectedClasses([...selectedClasses, classe.id]);
                                  } else {
                                    setSelectedClasses(selectedClasses.filter(id => id !== classe.id));
                                  }
                                }
                              }
                            }
                          ]}
                        />
                      ))}
                    </div>
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
                disabled={isSaving || selectedClasses.length === 0 || selectedMatieres.length === 0}
                style={{ width: '100%' }}
              >
                {isSaving ? 'Configuration...' : 'Finaliser la configuration'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationInitiale;