import React, { useState, useEffect } from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { qcmAPI } from '../../services/api';
import { QCM } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const QCMManagement: React.FC = () => {
  const [qcmsEnAttente, setQcmsEnAttente] = useState<QCM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQCM, setSelectedQCM] = useState<QCM | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editedQCM, setEditedQCM] = useState<Partial<QCM>>({});

  useEffect(() => {
    loadQCMsEnAttente();
  }, []);

  const loadQCMsEnAttente = async () => {
    try {
      const response = await qcmAPI.getQCMEnAttente();
      setQcmsEnAttente(response.data);
    } catch (error) {
      console.error('Erreur chargement QCM:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateQCM = async (qcmId: number, action: string, modifications?: any) => {
    setIsProcessing(true);
    setError('');

    try {
      await qcmAPI.validerQCM(qcmId, { action, modifications });
      setSuccess(`QCM ${action === 'valider' ? 'validé' : action === 'modifier' ? 'modifié' : 'supprimé'} avec succès !`);
      setShowModal(false);
      loadQCMsEnAttente();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors du traitement du QCM');
    } finally {
      setIsProcessing(false);
    }
  };

  const openEditModal = (qcm: QCM) => {
    setSelectedQCM(qcm);
    setEditedQCM({
      question: qcm.question,
      reponse_1: qcm.reponse_1,
      reponse_2: qcm.reponse_2,
      reponse_3: qcm.reponse_3,
      reponse_4: qcm.reponse_4,
      bonne_reponse: qcm.bonne_reponse
    });
    setShowModal(true);
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement des QCM en attente..." />;
  }

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Gestion des QCM</h1>
        <p>Validez, modifiez ou supprimez les QCM générés par l'IA</p>
      </div>

      {success && (
        <Alert
          severity="success"
          title="Succès"
          description={success}
          onClose={() => setSuccess('')}
          style={{ marginBottom: '1rem' }}
        />
      )}

      {error && (
        <Alert
          severity="error"
          title="Erreur"
          description={error}
          onClose={() => setError('')}
          style={{ marginBottom: '1rem' }}
        />
      )}

      {qcmsEnAttente.length === 0 ? (
        <Card
          title="Aucun QCM en attente"
          desc="Tous vos QCM ont été traités ! Créez de nouveaux cours pour générer plus de QCM."
        >
          <Button linkProps={{ href: '/professeur/cours' }}>
            Gérer mes cours
          </Button>
        </Card>
      ) : (
        <>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Badge severity="warning">{qcmsEnAttente.length} QCM en attente</Badge>
            <Button
              priority="tertiary"
              size="small"
              onClick={loadQCMsEnAttente}
            >
              Actualiser
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {qcmsEnAttente.map(qcm => (
              <Card
                key={qcm.id}
                title={`Question ${qcm.id}`}
                desc={qcm.id_chapitre}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Question :</strong>
                  <p style={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: '#f6f6f6', borderRadius: '4px' }}>
                    {qcm.question}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Réponses :</strong>
                  <div style={{ marginTop: '0.5rem' }}>
                    {[1, 2, 3, 4].map(num => (
                      <div 
                        key={num}
                        style={{ 
                          padding: '0.5rem',
                          margin: '0.25rem 0',
                          backgroundColor: qcm.bonne_reponse === num ? '#e8f5e8' : '#f9f9f9',
                          border: qcm.bonne_reponse === num ? '2px solid #27a845' : '1px solid #ddd',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <strong>{num}. </strong>
                        <span style={{ marginLeft: '0.5rem' }}>
                          {qcm[`reponse_${num}` as keyof QCM] as string}
                        </span>
                        {qcm.bonne_reponse === num && (
                          <Badge severity="success" style={{ marginLeft: 'auto' }}>
                            Correcte
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    priority="primary"
                    size="small"
                    onClick={() => handleValidateQCM(qcm.id, 'valider')}
                    disabled={isProcessing}
                  >
                    Valider
                  </Button>
                  <Button
                    priority="secondary"
                    size="small"
                    onClick={() => openEditModal(qcm)}
                    disabled={isProcessing}
                  >
                    Modifier
                  </Button>
                  <Button
                    priority="tertiary"
                    size="small"
                    onClick={() => handleValidateQCM(qcm.id, 'supprimer')}
                    disabled={isProcessing}
                  >
                    Supprimer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modal d'édition */}
      <Modal
        title="Modifier le QCM"
        isOpen={showModal}
        hide={() => setShowModal(false)}
        size="large"
      >
        {selectedQCM && (
          <div style={{ padding: '1rem' }}>
            <Input
              label="Question"
              textArea
              nativeTextAreaProps={{
                value: editedQCM.question || '',
                onChange: (e) => setEditedQCM({...editedQCM, question: e.target.value}),
                rows: 3
              }}
            />

            <div style={{ marginTop: '1rem' }}>
              <Input
                label="Réponse 1"
                nativeInputProps={{
                  value: editedQCM.reponse_1 || '',
                  onChange: (e) => setEditedQCM({...editedQCM, reponse_1: e.target.value})
                }}
              />
              <Input
                label="Réponse 2"
                nativeInputProps={{
                  value: editedQCM.reponse_2 || '',
                  onChange: (e) => setEditedQCM({...editedQCM, reponse_2: e.target.value})
                }}
              />
              <Input
                label="Réponse 3"
                nativeInputProps={{
                  value: editedQCM.reponse_3 || '',
                  onChange: (e) => setEditedQCM({...editedQCM, reponse_3: e.target.value})
                }}
              />
              <Input
                label="Réponse 4"
                nativeInputProps={{
                  value: editedQCM.reponse_4 || '',
                  onChange: (e) => setEditedQCM({...editedQCM, reponse_4: e.target.value})
                }}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <RadioButtons
                legend="Bonne réponse"
                options={[
                  { label: 'Réponse 1', nativeInputProps: { value: '1' } },
                  { label: 'Réponse 2', nativeInputProps: { value: '2' } },
                  { label: 'Réponse 3', nativeInputProps: { value: '3' } },
                  { label: 'Réponse 4', nativeInputProps: { value: '4' } }
                ]}
                state={editedQCM.bonne_reponse?.toString()}
                stateRelatedMessage="Sélectionnez la bonne réponse"
                onChange={(value) => setEditedQCM({...editedQCM, bonne_reponse: parseInt(value)})}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Button
                onClick={() => handleValidateQCM(selectedQCM.id, 'modifier', editedQCM)}
                disabled={isProcessing}
                style={{ flex: 1 }}
              >
                {isProcessing ? 'Modification...' : 'Sauvegarder'}
              </Button>
              <Button
                priority="secondary"
                onClick={() => setShowModal(false)}
                style={{ flex: 1 }}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QCMManagement;