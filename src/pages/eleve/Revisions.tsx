import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { eleveAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const resultModal = createModal({
  id: "result-modal",
  isOpenedByDefault: false
});

const Revisions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [qcms, setQcms] = useState<any[]>([]);
  const [currentQCM, setCurrentQCM] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [lastResult, setLastResult] = useState<any>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const chapitre = searchParams.get('chapitre');
  const mode = searchParams.get('mode');

  useEffect(() => {
    loadQCMs();
  }, [chapitre, mode]);

  const loadQCMs = async () => {
    try {
      if (mode === 'revision') {
        const response = await eleveAPI.getModeRevision({ chapitre });
        setQcms(response.data.questions);
      } else if (chapitre) {
        const response = await eleveAPI.getQCMDisponibles({ chapitre });
        setQcms(response.data.qcms);
      }
      
      if (qcms.length > 0) {
        setCurrentQCM(qcms[0]);
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Erreur chargement QCM:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQCM) return;

    setIsSubmitting(true);
    const temps_reponse = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await eleveAPI.soumettreReponse({
        qcm_id: currentQCM.id,
        reponse: parseInt(selectedAnswer),
        temps_reponse
      });

      setLastResult(response.data);
      resultModal.open();
      
      setSessionStats(prev => ({
        correct: prev.correct + (response.data.correcte ? 1 : 0),
        total: prev.total + 1
      }));

    } catch (error: any) {
      console.error('Erreur soumission réponse:', error);
      if (error.response?.status === 400) {
        handleNextQuestion();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    resultModal.close();
    setSelectedAnswer('');
    setLastResult(null);
    
    if (currentIndex < qcms.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQCM(qcms[nextIndex]);
      setStartTime(Date.now());
    } else {
      setCurrentQCM(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement des questions..." />;
  }

  if (qcms.length === 0) {
    return (
      <div className={fr.cx("fr-container")}>
        <div className={fr.cx("fr-card", "fr-enlarge-link")}>
          <div className={fr.cx("fr-card__body")}>
            <div className={fr.cx("fr-card__content")}>
              <h3 className={fr.cx("fr-card__title")}>Aucune question disponible</h3>
              <p className={fr.cx("fr-card__desc")}>
                {mode === 'revision' 
                  ? "Vous n'avez pas de questions à réviser pour le moment. Continuez à répondre aux QCM pour identifier vos points faibles."
                  : "Aucune question n'est disponible pour ce chapitre."
                }
              </p>
              <div className={fr.cx("fr-card__start")}>
                <Button linkProps={{ href: '/eleve' }}>
                  Retour au tableau de bord
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQCM) {
    return (
      <div className={fr.cx("fr-container")}>
        <div className={fr.cx("fr-card", "fr-enlarge-link")}>
          <div className={fr.cx("fr-card__body")}>
            <div className={fr.cx("fr-card__content")}>
              <h3 className={fr.cx("fr-card__title")}>Session terminée !</h3>
              <p className={fr.cx("fr-card__desc")}>Vous avez terminé toutes les questions disponibles.</p>
              
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {sessionStats.total > 0 ? 
                    `${Math.round((sessionStats.correct / sessionStats.total) * 100)}%` : 
                    '0%'
                  }
                </div>
                <p>
                  {sessionStats.correct} bonnes réponses sur {sessionStats.total} questions
                </p>
              </div>
              
              <div className={fr.cx("fr-card__start")} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button linkProps={{ href: '/eleve' }}>
                  Tableau de bord
                </Button>
                <Button 
                  priority="secondary"
                  linkProps={{ href: '/eleve/resultats' }}
                >
                  Voir mes résultats
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
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>
            {mode === 'revision' ? 'Mode révision' : `Révision - ${chapitre}`}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Badge severity="info">
              Question {currentIndex + 1}/{qcms.length}
            </Badge>
            <Badge severity={sessionStats.total > 0 && (sessionStats.correct / sessionStats.total) >= 0.7 ? 'success' : 'warning'}>
              {sessionStats.correct}/{sessionStats.total} correctes
            </Badge>
          </div>
        </div>
        
        <div 
          style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '1rem'
          }}
        >
          <div 
            style={{ 
              width: `${((currentIndex + 1) / qcms.length) * 100}%`, 
              height: '100%', 
              backgroundColor: '#000091',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      <div className={fr.cx("fr-card")}>
        <div className={fr.cx("fr-card__body")}>
          <div className={fr.cx("fr-card__content")}>
            <h3 className={fr.cx("fr-card__title")}>Question {currentIndex + 1}</h3>
            <p className={fr.cx("fr-card__desc")}>{currentQCM.id_chapitre || chapitre}</p>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>{currentQCM.question}</h4>
              
              <RadioButtons
                legend="Sélectionnez votre réponse"
                options={[
                  { label: currentQCM.reponse_1, nativeInputProps: { value: '1', name: 'reponse' } },
                  { label: currentQCM.reponse_2, nativeInputProps: { value: '2', name: 'reponse' } },
                  { label: currentQCM.reponse_3, nativeInputProps: { value: '3', name: 'reponse' } },
                  { label: currentQCM.reponse_4, nativeInputProps: { value: '4', name: 'reponse' } }
                ]}
                state={selectedAnswer}
                onChange={setSelectedAnswer}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? 'Validation...' : 'Valider ma réponse'}
              </Button>
              
              {currentIndex > 0 && (
                <Button
                  priority="tertiary"
                  onClick={() => {
                    const prevIndex = currentIndex - 1;
                    setCurrentIndex(prevIndex);
                    setCurrentQCM(qcms[prevIndex]);
                    setSelectedAnswer('');
                    setStartTime(Date.now());
                  }}
                >
                  Question précédente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal résultat */}
      <resultModal.Component 
        title={lastResult?.correcte ? 'Bonne réponse !' : 'Réponse incorrecte'}
      >
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {lastResult?.correcte ? '✅' : '❌'}
          </div>
          
          {!lastResult?.correcte && lastResult?.bonne_reponse && (
            <Alert
              severity="info"
              title="Bonne réponse"
              description={`La bonne réponse était : ${currentQCM[`reponse_${lastResult.bonne_reponse}`]}`}
            />
          )}
          
          <Button
            onClick={handleNextQuestion}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            {currentIndex < qcms.length - 1 ? 'Question suivante' : 'Terminer'}
          </Button>
        </div>
      </resultModal.Component>
    </div>
  );
};

export default Revisions;