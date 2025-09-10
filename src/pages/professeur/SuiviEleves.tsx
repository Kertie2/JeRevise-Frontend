import React, { useState, useEffect } from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { qcmAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const detailModal = createModal({
  id: "detail-eleve-modal",
  isOpenedByDefault: false
});

const SuiviEleves: React.FC = () => {
  const [suiviData, setSuiviData] = useState<any>(null);
  const [selectedEleve, setSelectedEleve] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ chapitre: '', classe_id: '' });

  useEffect(() => {
    loadSuiviEleves();
  }, [filters]);

  const loadSuiviEleves = async () => {
    try {
      const response = await qcmAPI.getSuiviEleves(filters);
      setSuiviData(response.data);
    } catch (error) {
      console.error('Erreur chargement suivi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDetailEleve = async (eleveId: number) => {
    try {
      const response = await qcmAPI.getDetailEleve(eleveId);
      setSelectedEleve(response.data);
      detailModal.open();
    } catch (error) {
      console.error('Erreur chargement détail élève:', error);
    }
  };

  const getSeverityFromScore = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement du suivi des élèves..." />;
  }

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Suivi des élèves</h1>
        <p>Analysez les performances de vos élèves et identifiez ceux qui ont besoin d'aide</p>
      </div>

      {/* Filtres */}
      <div className={fr.cx("fr-card")} style={{ marginBottom: '2rem' }}>
        <div className={fr.cx("fr-card__body")}>
          <div className={fr.cx("fr-card__content")}>
            <h3 className={fr.cx("fr-card__title")}>Filtres</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Select
                label="Chapitre"
                nativeSelectProps={{
                  value: filters.chapitre,
                  onChange: (e) => setFilters({...filters, chapitre: e.target.value})
                }}
              >
                <option value="">Tous les chapitres</option>
              </Select>
              <Select
                label="Classe"
                nativeSelectProps={{
                  value: filters.classe_id,
                  onChange: (e) => setFilters({...filters, classe_id: e.target.value})
                }}
              >
                <option value="">Toutes les classes</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {suiviData?.alertes && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className={fr.cx("fr-card", "fr-enlarge-link")}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Élèves en difficulté</h3>
                <p className={fr.cx("fr-card__desc")}>
                  {suiviData.alertes.eleves_en_difficulte} élève(s) avec moins de 60% de réussite
                </p>
                <Badge severity="error">{suiviData.alertes.eleves_en_difficulte}</Badge>
              </div>
            </div>
          </div>
          
          <div className={fr.cx("fr-card", "fr-enlarge-link")}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Élèves inactifs</h3>
                <p className={fr.cx("fr-card__desc")}>
                  {suiviData.alertes.eleves_inactifs} élève(s) sans activité depuis 7 jours
                </p>
                <Badge severity="warning">{suiviData.alertes.eleves_inactifs}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des élèves */}
      <div className={fr.cx("fr-card")}>
        <div className={fr.cx("fr-card__body")}>
          <div className={fr.cx("fr-card__content")}>
            <h3 className={fr.cx("fr-card__title")}>Élèves ({suiviData?.total_eleves || 0})</h3>
            
            {suiviData?.eleves?.length > 0 ? (
              <Table
                headers={['Élève', 'Classe', 'Réponses', 'Taux de réussite', 'Dernière activité', 'Actions']}
                data={suiviData.eleves.map((eleve: any) => [
                  `${eleve.prenom} ${eleve.nom}`,
                  `${eleve.niveau}${eleve.classe_nom}`,
                  eleve.total_reponses || 0,
                  <Badge severity={getSeverityFromScore(eleve.pourcentage_reussite || 0)}>
                    {eleve.pourcentage_reussite || 0}%
                  </Badge>,
                  eleve.derniere_activite 
                    ? new Date(eleve.derniere_activite).toLocaleDateString('fr-FR')
                    : 'Jamais',
                  <Button
                    priority="tertiary"
                    size="small"
                    onClick={() => loadDetailEleve(eleve.id)}
                  >
                    Détails
                  </Button>
                ])}
              />
            ) : (
              <p>Aucun élève trouvé avec ces filtres.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal détail élève */}
      <detailModal.Component 
        title={selectedEleve ? `${selectedEleve.eleve.prenom} ${selectedEleve.eleve.nom}` : ''}
        size="large"
      >
        {selectedEleve && (
          <div style={{ padding: '1rem' }}>
            {/* Statistiques générales */}
            <div style={{ marginBottom: '2rem' }}>
              <h3>Statistiques générales</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000091' }}>
                    {selectedEleve.statistiques.total_reponses}
                  </div>
                  <div>Réponses totales</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27a845' }}>
                    {selectedEleve.statistiques.bonnes_reponses}
                  </div>
                  <div>Bonnes réponses</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getSeverityFromScore(selectedEleve.statistiques.pourcentage_reussite) === 'success' ? '#27a845' : '#dc3545' }}>
                    {selectedEleve.statistiques.pourcentage_reussite}%
                  </div>
                  <div>Taux de réussite</div>
                </div>
              </div>
            </div>

            {/* Progression par chapitre */}
            <div style={{ marginBottom: '2rem' }}>
              <h3>Progression par chapitre</h3>
              {selectedEleve.progression_chapitres?.length > 0 ? (
                <Table
                  headers={['Chapitre', 'Réponses', 'Taux de réussite']}
                  data={selectedEleve.progression_chapitres.map((prog: any) => [
                    prog.chapitre,
                    prog.total_reponses,
                    <Badge severity={getSeverityFromScore(prog.pourcentage)}>
                      {prog.pourcentage}%
                    </Badge>
                  ])}
                />
              ) : (
                <p>Aucune progression enregistrée.</p>
              )}
            </div>

            {/* Recommandations */}
            {selectedEleve.recommendations?.length > 0 && (
              <div>
                <h3>Recommandations</h3>
                {selectedEleve.recommendations.map((rec: any, index: number) => (
                  <div 
                    key={index}
                    style={{ 
                      padding: '1rem',
                      margin: '0.5rem 0',
                      backgroundColor: rec.type === 'urgent' ? '#fff5f5' : '#f0f8ff',
                      border: `1px solid ${rec.type === 'urgent' ? '#fed7d7' : '#bee3f8'}`,
                      borderRadius: '4px'
                    }}
                  >
                    <Badge severity={rec.type === 'urgent' ? 'error' : 'info'}>
                      {rec.type}
                    </Badge>
                    <p style={{ margin: '0.5rem 0 0 0' }}>{rec.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </detailModal.Component>
    </div>
  );
};

export default SuiviEleves;