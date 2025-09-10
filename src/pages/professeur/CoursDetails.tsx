import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { coursAPI, qcmAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CoursDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cours, setCours] = useState<any>(null);
  const [qcms, setQcms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      loadCoursDetails();
    }
  }, [id]);

  const loadCoursDetails = async () => {
    try {
      // Charger les détails du cours
      const coursResponse = await coursAPI.getCours(parseInt(id!));
      setCours(coursResponse.data);
      
      // Charger les QCM associés
      const qcmsResponse = await qcmAPI.getQCMsByCours(parseInt(id!));
      setQcms(qcmsResponse.data);
    } catch (error: any) {
      setError('Erreur lors du chargement du cours');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQCM = async () => {
    try {
      await qcmAPI.traiterCours({ cours_id: parseInt(id!), nombre_questions: 5 });
      setSuccess('QCM générés avec succès !');
      loadCoursDetails(); // Recharger pour voir les nouveaux QCM
    } catch (error: any) {
      setError('Erreur lors de la génération des QCM');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement du cours..." />;
  }

  if (!cours) {
    return (
      <div className={fr.cx("fr-container")}>
        <div className={fr.cx("fr-card")}>
          <div className={fr.cx("fr-card__body")}>
            <div className={fr.cx("fr-card__content")}>
              <h3 className={fr.cx("fr-card__title")}>Cours introuvable</h3>
              <p className={fr.cx("fr-card__desc")}>Le cours demandé n'existe pas ou vous n'y avez pas accès.</p>
              <div className={fr.cx("fr-card__start")}>
                <Button onClick={() => navigate('/professeur/cours')}>
                  Retour aux cours
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={fr.cx("fr-container")}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Button
          priority="tertiary no outline"
          onClick={() => navigate('/professeur/cours')}
          style={{ marginRight: '1rem' }}
        >
          ← Retour aux cours
        </Button>
        <div>
          <h1>{cours.titre}</h1>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            {cours.matiere} • {cours.chapitre}
          </p>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <Alert
          severity="success"
          title="Succès"
          description={success}
          onClose={() => setSuccess('')}
          style={{ marginBottom: '2rem' }}
        />
      )}

      {error && (
        <Alert
          severity="error"
          title="Erreur"
          description={error}
          onClose={() => setError('')}
          style={{ marginBottom: '2rem' }}
        />
      )}

      {/* Détails du cours */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Informations principales */}
        <div className={fr.cx("fr-card")}>
          <div className={fr.cx("fr-card__body")}>
            <div className={fr.cx("fr-card__content")}>
              <h3 className={fr.cx("fr-card__title")}>Informations</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Matière :</strong> {cours.matiere}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Chapitre :</strong> {cours.chapitre}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Créé le :</strong> {new Date(cours.created_at).toLocaleDateString('fr-FR')}
              </div>
              
              {cours.fichier_url && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Fichier joint :</strong>
                  <Badge severity="success" style={{ marginLeft: '0.5rem' }}>
                    PDF
                  </Badge>
                  <br />
                  <Button
                    priority="tertiary"
                    size="small"
                    linkProps={{ 
                      href: `http://localhost:5431/${cours.fichier_url}`,
                      target: "_blank"
                    }}
                    style={{ marginTop: '0.5rem' }}
                  >
                    Télécharger le fichier
                  </Button>
                </div>
              )}
              
              {cours.texte_ocr && (
                <div>
                  <strong>Texte extrait :</strong>
                  <div style={{ 
                    marginTop: '0.5rem',
                    padding: '1rem',
                    backgroundColor: '#f6f6f6',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {cours.texte_ocr}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <div className={fr.cx("fr-card")}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Actions</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Button onClick={handleGenerateQCM}>
                    Générer des QCM
                  </Button>
                  
                  <Button priority="secondary">
                    Modifier le cours
                  </Button>
                  
                  <Button priority="tertiary">
                    Supprimer le cours
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className={fr.cx("fr-card")} style={{ marginTop: '1rem' }}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Statistiques</h3>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000091' }}>
                    {qcms.length}
                  </div>
                  <div>QCM générés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QCM générés */}
      {qcms.length > 0 && (
        <div>
          <h2>QCM générés ({qcms.length})</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {qcms.map((qcm: any, index: number) => (
              <div key={qcm.id} className={fr.cx("fr-card")}>
                <div className={fr.cx("fr-card__body")}>
                  <div className={fr.cx("fr-card__content")}>
                    <h4 className={fr.cx("fr-card__title")}>Question {index + 1}</h4>
                    <p style={{ marginBottom: '1rem' }}>{qcm.question}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge severity={qcm.valide ? 'success' : 'warning'}>
                        {qcm.valide ? 'Validé' : 'En attente'}
                      </Badge>
                      
                      {!qcm.valide && (
                        <Button
                          priority="tertiary"
                          size="small"
                          linkProps={{ href: '/professeur/qcm' }}
                        >
                          Valider
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursDetails;