import React, { useState, useEffect } from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfesseurHome: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getProfesseur();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
  }

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Tableau de bord - {user?.prenom} {user?.nom}</h1>
        <p>Bienvenue dans votre espace professeur JeRevise</p>
      </div>

      {/* Statistiques principales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Cours créés"
          value={dashboardData?.statistiques?.cours_crees || 0}
          description="Total de vos cours"
          icon="ri-book-line"
          color="blue"
        />
        <StatCard
          title="QCM générés"
          value={dashboardData?.statistiques?.qcm_generes || 0}
          description="Questions créées par l'IA"
          icon="ri-question-line"
          color="green"
        />
        <StatCard
          title="QCM validés"
          value={dashboardData?.statistiques?.qcm_valides || 0}
          description="Questions approuvées"
          icon="ri-check-line"
          color="green"
        />
        <StatCard
          title="Réponses élèves"
          value={dashboardData?.statistiques?.total_reponses_eleves || 0}
          description="Total des interactions"
          icon="ri-user-line"
          color="orange"
        />
      </div>

      {/* Alertes et notifications */}
      {dashboardData?.alertes?.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Alertes</h2>
          {dashboardData.alertes.map((alerte: any, index: number) => (
            <Alert
              key={index}
              severity={alerte.type === 'warning' ? 'warning' : 'info'}
              title={alerte.type === 'warning' ? 'Attention' : 'Information'}
              description={alerte.message}
              style={{ marginBottom: '1rem' }}
            />
          ))}
        </div>
      )}

      {/* Actions rapides */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Actions rapides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {dashboardData?.actions_rapides?.map((action: any, index: number) => (
            <div key={index} className={fr.cx("fr-card", "fr-enlarge-link")}>
              <div className={fr.cx("fr-card__body")}>
                <div className={fr.cx("fr-card__content")}>
                  <h3 className={fr.cx("fr-card__title")}>{action.titre}</h3>
                  <p className={fr.cx("fr-card__desc")}>{action.count} élément(s)</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge severity={action.count > 0 ? 'warning' : 'success'}>
                      {action.count}
                    </Badge>
                    <div className={fr.cx("fr-card__start")}>
                      <Button
                        priority="secondary"
                        size="small"
                        linkProps={{ href: action.action }}
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapitres populaires */}
      {dashboardData?.chapitres_populaires?.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Chapitres les plus actifs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {dashboardData.chapitres_populaires.map((chapitre: any, index: number) => (
              <div key={index} className={fr.cx("fr-card", "fr-enlarge-link")}>
                <div className={fr.cx("fr-card__body")}>
                  <div className={fr.cx("fr-card__content")}>
                    <h3 className={fr.cx("fr-card__title")}>{chapitre.chapitre}</h3>
                    <p className={fr.cx("fr-card__desc")}>
                      {chapitre.nb_reponses} réponses • {chapitre.nb_eleves} élèves
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Taux de réussite:</span>
                      <Badge severity={chapitre.taux_reussite >= 70 ? 'success' : 'warning'}>
                        {chapitre.taux_reussite}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activité récente */}
      {dashboardData?.activite_7_jours?.length > 0 && (
        <div>
          <h2>Activité des 7 derniers jours</h2>
          <div className={fr.cx("fr-card")}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Graphique d'activité</h3>
                <p className={fr.cx("fr-card__desc")}>Réponses des élèves par jour</p>
                
                <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem', height: '200px' }}>
                  {dashboardData.activite_7_jours.map((jour: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: '#000091',
                          width: '100%',
                          height: `${Math.max((jour.nb_reponses / Math.max(...dashboardData.activite_7_jours.map((j: any) => j.nb_reponses))) * 150, 5)}px`,
                          marginBottom: '0.5rem',
                          borderRadius: '4px 4px 0 0'
                        }}
                        title={`${jour.nb_reponses} réponses`}
                      />
                      <small>{new Date(jour.date).toLocaleDateString('fr-FR', { weekday: 'short' })}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfesseurHome;