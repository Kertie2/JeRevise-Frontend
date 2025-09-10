import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [isTeacher, setIsTeacher] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    identifiant: '',
    mot_de_passe: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const credentials = isTeacher 
        ? { email: formData.email, mot_de_passe: formData.mot_de_passe }
        : { identifiant: formData.identifiant, mot_de_passe: formData.mot_de_passe };

      await login(credentials, isTeacher ? 'professeur' : 'eleve');
      
      // Redirection selon le rôle
      navigate(isTeacher ? '/professeur' : '/eleve');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
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
        <div className={fr.cx("fr-card", "fr-enlarge-link")}>
          <div className={fr.cx("fr-card__body")}>
            <div className={fr.cx("fr-card__content")}>
              <h3 className={fr.cx("fr-card__title")}>Connexion à JeRevise</h3>
              <p className={fr.cx("fr-card__desc")}>Connectez-vous pour accéder à votre espace personnel</p>
              <Button>Mon bouton</Button>
            </div>
          </div>
        </div>
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

            {isTeacher ? (
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
            ) : (
              <Input
                label="Identifiant élève"
                nativeInputProps={{
                  type: "text",
                  value: formData.identifiant,
                  onChange: (e) => setFormData({...formData, identifiant: e.target.value}),
                  required: true,
                  placeholder: "Mon identifiant"
                }}
              />
            )}

            <Input
              label="Mot de passe"
              nativeInputProps={{
                type: "password",
                value: formData.mot_de_passe,
                onChange: (e) => setFormData({...formData, mot_de_passe: e.target.value}),
                required: true
              }}
            />

            {error && (
              <Alert
                severity="error"
                title="Erreur de connexion"
                description={error}
              />
            )}

            <Button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button
              priority="tertiary no outline"
              linkProps={{ href: "/inscription" }}
            >
              Créer un compte
            </Button>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;