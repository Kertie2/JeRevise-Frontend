import React, { useState, useEffect } from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { eleveAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Resultats: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [chapitres, setChapitres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardRes, chapitresRes] = await Promise.all([
        eleveAPI.getDashboard(),
        eleveAPI.getChapitresDisponibles()
      ]);
      setDashboardData(dashboardRes.data);
      setChapitres(chapitresRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
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
    return <LoadingSpinner message="Chargement de vos résultats..." />;
  }

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Mes résultats</h1>
        <p>Consultez votre progression détaillée et vos performances</p>
      </div>

      {/* Statistiques globales */}
      {dashboardData && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            title="Questions répondues"
            value={dashboardData.statistiques.total_reponses}
            description="Total de vos réponses"
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
            description="Votre performance globale"
            icon="ri-medal-line"
            color={dashboardData.statistiques.pourcentage_reussite >= 70 ? 'green' : 'orange'}
          />
          <StatCard
            title="Votre niveau"
            value={dashboardData.statistiques.niveau.badge}
            description={dashboardData.statistiques.niveau.nom}
            icon="ri-trophy-line"
            color="blue"
          />
        </div>
      )}

      {/* Progression détaillée par chapitre */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Progression par chapitre</h2>
        {chapitres.length > 0 ? (
          <Card>
            <Table
              headers={[
                'Chapitre', 
                'Questions', 
                'Progression', 
                'Taux de réussite', 
                'Statut', 
                'Actions'
              ]}
              data={chapitres.map(chapitre => [
                chapitre.nom,
                `${chapitre.qcm_repondus}/${chapitre.total_qcm}`,
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div 
                    style={{ 
                      width: '100px', 
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
                        backgroundColor: '#000091'
                      }}
                    />
                  </div>
                  <span>{chapitre.pourcentage_completion}%</span>
                </div>,
                chapitre.pourcentage_reussite > 0 ? (
                  <Badge severity={chapitre.pourcentage_reussite >= 70 ? 'success' : 'warning'}>
                    {chapitre.pourcentage_reussite}%
                  </Badge>
                ) : '-',
                <Badge severity={getStatutColor(chapitre.statut)}>
                  {getStatutText(chapitre.statut)}
                </Badge>,
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    priority="secondary"
                    size="small"
                    linkProps={{ href: `/eleve/revisions?chapitre=${encodeURIComponent(chapitre.nom)}` }}
                  >
                    {chapitre.statut === 'non_commence' ? 'Commencer' : 'Réviser'}
                  </Button>
                  {chapitre.statut === 'a_revoir' && (
                    <Button
                      priority="tertiary"
                      size="small"
                      linkProps={{ href: `/eleve/revisions?chapitre=${encodeURIComponent(chapitre.nom)}&mode=revision` }}
                    >
                      Revoir
                    </Button>
                  )}
                </div>
              ])}
            />
          </Card>
        ) : (
          <Card
            title="Aucun chapitre"
            desc="Vous n'avez pas encore commencé de révisions."
          >
            <Button linkProps={{ href: '/eleve/revisions' }}>
              Commencer à réviser
            </Button>
          </Card>
        )}
      </div>

      {/* Activité récente */}
      {dashboardData?.activite_recente?.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Activité récente</h2>
          <Card>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {dashboardData.activite_recente.map((activite: any, index: number) => (
                <div 
                  key={index}
                  style={{ 
                    padding: '1rem',
                    borderBottom: index < dashboardData.activite_recente.length - 1 ? '1px solid #e0e0e0' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong>{activite.chapitre}</strong>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                      {activite.question.substring(0, 80)}...
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Badge severity={activite.correcte ? 'success' : 'error'}>
                      {activite.correcte ? 'Correct' : 'Incorrect'}
                    </Badge>
                    <small style={{ color: '#666' }}>
                      {new Date(activite.date).toLocaleDateString('fr-FR')}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Progression dans le temps */}
      {dashboardData?.progression_chapitres?.length > 0 && (
        <div>
          <h2>Évolution par matière</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {dashboardData.progression_chapitres.map((prog: any, index: number) => (
              <Card
                key={index}
                title={prog.chapitre}
                desc={`${prog.total_questions} questions répondues`}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: prog.pourcentage >= 70 ? '#27a845' : '#ffc107' }}>
                    {prog.pourcentage}%
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>
                    {prog.bonnes_reponses}/{prog.total_questions} correctes
                  </p>
                  <Button
                    priority="tertiary"
                    size="small"
                    linkProps={{ href: `/eleve/revisions?chapitre=${encodeURIComponent(prog.chapitre)}` }}
                  >
                    Réviser
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resultats;