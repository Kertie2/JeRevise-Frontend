import React, { useState, useEffect } from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { eleveAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EleveHome: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [chapitres, setChapitres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboard();
    loadChapitres();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await eleveAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    }
  };

  const loadChapitres = async () => {
    try {
      const response = await eleveAPI.getChapitresDisponibles();
      setChapitres(response.data);
    } catch (error) {
      console.error('Erreur chargement chapitres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'maitrise': return 'success';
      case 'acquis': return 'info';
      case 'en_cours': return 'warning';
      case 'a_revoir': return 'error';
      default: return 'new';
    }
  };

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'maitrise': return 'Maîtrisé';
      case 'acquis': return 'Acquis';
      case 'en_cours': return 'En cours';
      case 'a_revoir': return 'À revoir';
      default: return 'Non commencé';
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement de votre tableau de bord..." />;
  }

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Bonjour {user?.prenom} !</h1>
        <p>Voici votre progression et vos prochaines révisions</p>
      </div>

      {/* Statistiques personnelles */}
      {dashboardData && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            title="Réponses totales"
            value={dashboardData.statistiques.total_reponses}
            description="Questions répondues"
            icon="ri-question-line"
            color="blue"
          />
          <StatCard
            title="Bonnes réponses"
            value={dashboardData.statistiques.bonnes_reponses}
            description="Réponses correctes"
            icon="ri-check-line"
            color="green"
          />
          <StatCard
            title="Taux de réussite"
            value={`${dashboardData.statistiques.pourcentage_reussite}%`}
            description="Votre performance"
            icon="ri-medal-line"
            color={dashboardData.statistiques.pourcentage_reussite >= 70 ? 'green' : 'orange'}
          />
          <StatCard
            title="Niveau"
            value={dashboardData.statistiques.niveau.badge}
            description={dashboardData.statistiques.niveau.nom}
            icon="ri-trophy-line"
            color="blue"
          />
        </div>
      )}

      {/* Actions rapides */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Actions rapides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className={fr.cx("fr-card", "fr-enlarge-link")}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Mode révision</h3>
                <p className={fr.cx("fr-card__desc")}>Révisez vos questions difficiles</p>
                <div className={fr.cx("fr-card__start")}>
                  <Button linkProps={{ href: '/eleve/revisions?mode=revision' }}>
                    Commencer la révision
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className={fr.cx("fr-card", "fr-enlarge-link")}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Nouveau chapitre</h3>
                <p className={fr.cx("fr-card__desc")}>Découvrez de nouveaux contenus</p>
                <div className={fr.cx("fr-card__start")}>
                  <Button linkProps={{ href: '/eleve/revisions' }}>
                    Explorer les chapitres
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className={fr.cx("fr-card", "fr-enlarge-link")}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Mes résultats</h3>
                <p className={fr.cx("fr-card__desc")}>Consultez votre progression détaillée</p>
                <div className={fr.cx("fr-card__start")}>
                  <Button linkProps={{ href: '/eleve/resultats' }}>
                    Voir les résultats
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions à revoir */}
      {dashboardData?.questions_a_revoir?.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Questions à revoir</h2>
          <div className={fr.cx("fr-card", "fr-enlarge-link")}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>
                  {dashboardData.questions_a_revoir.length} question(s) à réviser
                </h3>
                <p className={fr.cx("fr-card__desc")}>Ces questions nécessitent votre attention</p>
                
                <div style={{ marginBottom: '1rem' }}>
                  {dashboardData.questions_a_revoir.slice(0, 3).map((question: any, index: number) => (
                    <div 
                      key={index}
                      style={{ 
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        backgroundColor: '#fff5f5',
                        border: '1px solid #fed7d7',
                        borderRadius: '4px'
                      }}
                    >
                      <strong>{question.chapitre}</strong>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                        {question.question.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className={fr.cx("fr-card__start")}>
                  <Button 
                    priority="secondary"
                    linkProps={{ href: '/eleve/revisions?mode=revision' }}
                  >
                    Réviser maintenant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progression par chapitre */}
      <div>
        <h2>Vos chapitres</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {chapitres.map((chapitre, index) => (
            <div key={index} className={fr.cx("fr-card", "fr-enlarge-link")}>
              <div className={fr.cx("fr-card__body")}>
                <div className={fr.cx("fr-card__content")}>
                  <h3 className={fr.cx("fr-card__title")}>{chapitre.nom}</h3>
                  <p className={fr.cx("fr-card__desc")}>
                    {chapitre.qcm_repondus}/{chapitre.total_qcm} questions répondues
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Progression:</span>
                      <span>{chapitre.pourcentage_completion}%</span>
                    </div>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{ 
                          width: `${chapitre.pourcentage_completion}%`, 
                          height: '100%', 
                          backgroundColor: '#000091',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Badge severity={getStatutColor(chapitre.statut)}>
                      {getStatutText(chapitre.statut)}
                    </Badge>
                    {chapitre.pourcentage_reussite > 0 && (
                      <Badge severity={chapitre.pourcentage_reussite >= 70 ? 'success' : 'warning'}>
                        {chapitre.pourcentage_reussite}% réussite
                      </Badge>
                    )}
                  </div>

                  <div className={fr.cx("fr-card__start")}>
                    <Button
                      priority={chapitre.statut === 'non_commence' ? 'primary' : 'secondary'}
                      size="small"
                      linkProps={{ href: `/eleve/revisions?chapitre=${encodeURIComponent(chapitre.nom)}` }}
                      style={{ width: '100%' }}
                    >
                      {chapitre.statut === 'non_commence' ? 'Commencer' : 'Continuer'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EleveHome;