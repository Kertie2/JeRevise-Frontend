import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { authAPI } from '../../services/api';

const RegisterPage: React.FC = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    identifiant: '',
    mot_de_passe: '',
    confirmer_mot_de_passe: '',
    code_activation: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.mot_de_passe !== formData.confirmer_mot_de_passe) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const dataToSend = isTeacher 
        ? {
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            mot_de_passe: formData.mot_de_passe,
            code_activation: formData.code_activation
          }
        : {
            nom: formData.nom,
            prenom: formData.prenom,
            identifiant: formData.identifiant,
            mot_de_passe: formData.mot_de_passe
          };

      await authAPI.register(dataToSend, isTeacher ? 'professeur' : 'eleve');
      
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/connexion'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <Card
          title="Créer un compte JeRevise"
          desc="Rejoignez la communauté JeRevise"
          style={{ maxWidth: '600px', width: '100%' }}
        >
          <form onSubmit={handleSubmit}>
            <ToggleSwitch
              label="Type de compte"
              helperText="Sélectionnez votre profil"
              inputTitle="teacher"
              checked={isTeacher}
              onChange={setIsTeacher}
              /* FIXME: labelLeft -> */ textLeft="Élève"
              /* FIXME: labelRight -> */ textRight="Professeur"
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input
                label="Nom"
                nativeInputProps={{
                  value: formData.nom,
                  onChange: (e) => setFormData({...formData, nom: e.target.value}),
                  required: true
                }}
              />
              <Input
                label="Prénom"
                nativeInputProps={{
                  value: formData.prenom,
                  onChange: (e) => setFormData({...formData, prenom: e.target.value}),
                  required: true
                }}
              />
            </div>

            {isTeacher ? (
              <>
                <Input
                  label="Adresse email"
                  nativeInputProps={{
                    type: "email",
                    value: formData.email,
                    onChange: (e) => setFormData({...formData, email: e.target.value}),
                    required: true,
                    placeholder: "nom@college.fr"
                  }}
                />
                <Input
                  label="Code d'activation"
                  hintText="Code fourni par votre établissement"
                  nativeInputProps={{
                    value: formData.code_activation,
                    onChange: (e) => setFormData({...formData, code_activation: e.target.value}),
                    required: true
                  }}
                />
              </>
            ) : (
              <Input
                label="Identifiant"
                hintText="Choisissez un identifiant unique"
                nativeInputProps={{
                  value: formData.identifiant,
                  onChange: (e) => setFormData({...formData, identifiant: e.target.value}),
                  required: true
                }}
              />
            )}

            <Input
              label="Mot de passe"
              nativeInputProps={{
                type: "password",
                value: formData.mot_de_passe,
                onChange: (e) => setFormData({...formData, mot_de_passe: e.target.value}),
                required: true,
                minLength: 6
              }}
            />

            <Input
              label="Confirmer le mot de passe"
              nativeInputProps={{
                type: "password",
                value: formData.confirmer_mot_de_passe,
                onChange: (e) => setFormData({...formData, confirmer_mot_de_passe: e.target.value}),
                required: true
              }}
            />

            {error && (
              <Alert
                severity="error"
                title="Erreur"
                description={error}
              />
            )}

            {success && (
              <Alert
                severity="success"
                title="Succès"
                description={success}
              />
            )}

            <Button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button
              priority="tertiary no outline"
              linkProps={{ href: "/connexion" }}
            >
              J'ai déjà un compte
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;