import React, { useState, useEffect } from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Upload } from "@codegouvfr/react-dsfr/Upload";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { coursAPI, qcmAPI } from '../../services/api';
import { Cours } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CoursManagement: React.FC = () => {
  const [cours, setCours] = useState<Cours[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCours, setNewCours] = useState({
    titre: '',
    matiere: '',
    chapitre: '',
    type_programme: 'normal',
    niveau_cible: '6e',
    fichier: null as File | null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCours();
  }, []);

  const loadCours = async () => {
    try {
      const response = await coursAPI.getMesCours();
      setCours(response.data);
    } catch (error) {
      console.error('Erreur chargement cours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCours = async () => {
    if (!newCours.titre || !newCours.matiere || !newCours.chapitre) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('titre', newCours.titre);
      formData.append('matiere', newCours.matiere);
      formData.append('chapitre', newCours.chapitre);
      
      if (newCours.type_programme !== 'normal') {
        formData.append('type_programme', newCours.type_programme);
        if (newCours.type_programme === 'hors_programme') {
          formData.append('niveau_cible', newCours.niveau_cible);
        }
      }
      
      if (newCours.fichier) {
        formData.append('fichier', newCours.fichier);
      }

      const endpoint = newCours.type_programme === 'normal' ? 'creerCours' : 'creerCoursSpecial';
      await coursAPI[endpoint](formData);

      setSuccess('Cours créé avec succès !');
      setShowModal(false);
      setNewCours({
        titre: '',
        matiere: '',
        chapitre: '',
        type_programme: 'normal',
        niveau_cible: '6e',
        fichier: null
      });
      loadCours();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de la création du cours');
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateQCM = async (coursId: number) => {
    try {
      await qcmAPI.traiterCours({ cours_id: coursId, nombre_questions: 5 });
      setSuccess('QCM générés avec succès ! Vous pouvez les valider dans l\'onglet QCM.');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de la génération des QCM');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement de vos cours..." />;
  }

  const matieres = ['Mathématiques', 'Français', 'Histoire-Géographie', 'Sciences et Vie de la Terre', 'Physique-Chimie', 'Anglais', 'Espagnol'];
  const niveaux = ['6e', '5e', '4e', '3e'];

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Gestion des cours</h1>
        <Button onClick={() => setShowModal(true)}>
          Nouveau cours
        </Button>
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

      {cours.length === 0 ? (
        <Card
          title="Aucun cours"
          desc="Vous n'avez pas encore créé de cours. Commencez par ajouter votre premier cours !"
        >
          <Button onClick={() => setShowModal(true)}>
            Créer mon premier cours
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {cours.map(coursItem => (
            <Card
              key={coursItem.id}
              title={coursItem.titre}
              desc={`${coursItem.matiere} • ${coursItem.chapitre}`}
            >
              <div style={{ marginBottom: '1rem' }}>
                <Badge severity="info">
                  {new Date(coursItem.created_at).toLocaleDateString('fr-FR')}
                </Badge>
                {coursItem.fichier_url && (
                  <Badge severity="success" style={{ marginLeft: '0.5rem' }}>
                    Fichier joint
                  </Badge>
                )}
                {coursItem.texte_ocr && (
                  <Badge severity="success" style={{ marginLeft: '0.5rem' }}>
                    Texte extrait
                  </Badge>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  priority="secondary"
                  size="small"
                  onClick={() => handleGenerateQCM(coursItem.id)}
                >
                  Générer QCM
                </Button>
                <Button
                  priority="tertiary"
                  size="small"
                  linkProps={{ href: `/professeur/cours/${coursItem.id}` }}
                >
                  Détails
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal création cours */}
      <Modal
        title="Nouveau cours"
        isOpen={showModal}
        hide={() => setShowModal(false)}
      >
        <div style={{ padding: '1rem' }}>
          <Input
            label="Titre du cours"
            nativeInputProps={{
              value: newCours.titre,
              onChange: (e) => setNewCours({...newCours, titre: e.target.value}),
              placeholder: "Ex: Les fractions"
            }}
          />

          <Select
            label="Matière"
            nativeSelectProps={{
              value: newCours.matiere,
              onChange: (e) => setNewCours({...newCours, matiere: e.target.value})
            }}
          >
            <option value="">Sélectionner une matière</option>
            {matieres.map(matiere => (
              <option key={matiere} value={matiere}>{matiere}</option>
            ))}
          </Select>

          <Input
            label="Chapitre"
            nativeInputProps={{
              value: newCours.chapitre,
              onChange: (e) => setNewCours({...newCours, chapitre: e.target.value}),
              placeholder: "Ex: Chapitre 3 - Les fractions"
            }}
          />

          <Select
            label="Type de programme"
            nativeSelectProps={{
              value: newCours.type_programme,
              onChange: (e) => setNewCours({...newCours, type_programme: e.target.value})
            }}
          >
            <option value="normal">Programme normal</option>
            <option value="hors_programme">Hors programme</option>
            <option value="brevet">Spécial Brevet</option>
          </Select>

          {newCours.type_programme === 'hors_programme' && (
            <Select
              label="Niveau cible"
              nativeSelectProps={{
                value: newCours.niveau_cible,
                onChange: (e) => setNewCours({...newCours, niveau_cible: e.target.value})
              }}
            >
              {niveaux.map(niveau => (
                <option key={niveau} value={niveau}>{niveau}</option>
              ))}
            </Select>
          )}

          <Upload
            label="Fichier du cours (optionnel)"
            hint="PDF, JPG, PNG acceptés (max 50MB)"
            nativeInputProps={{
              accept: ".pdf,.jpg,.jpeg,.png",
              onChange: (e) => {
                const file = e.target.files?.[0] || null;
                setNewCours({...newCours, fichier: file});
              }
            }}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button
              onClick={handleCreateCours}
              disabled={isCreating}
              style={{ flex: 1 }}
            >
              {isCreating ? 'Création...' : 'Créer le cours'}
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
      </Modal>
    </div>
  );
};

export default CoursManagement;