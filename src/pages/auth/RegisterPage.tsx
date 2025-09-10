import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { authAPI } from '../../services/api';

const RegisterPage: React.FC = () => {
  const [userType, setUserType] = useState<'eleve' | 'professeur' | null>(null);
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
    if (!userType) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.mot_de_passe !== formData.confirmer_mot_de_passe) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const dataToSend = userType === 'professeur' 
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

      await authAPI.register(dataToSend, userType);
      
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/connexion'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  // Étape 1 : Choix du type d'utilisateur
  if (!userType) {
    return (
      <div className={fr.cx("fr-container")}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}>
          <div className={fr.cx("fr-card")} style={{ maxWidth: '600px', width: '100%' }}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h2 className={fr.cx("fr-card__title")} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  Créer un compte JeRevise
                </h2>
                
                <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                  Je suis :
                </h3>
                
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                  {/* Carte Élève */}
                  <div 
                    onClick={() => setUserType('eleve')}
                    style={{
                      padding: '1.5rem',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#000091';
                      e.currentTarget.style.backgroundColor = '#f6f6f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#000091' }}>Élève</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                      Inscription libre - Je veux réviser et m'entraîner
                    </p>
                  </div>

                  {/* Carte Professeur */}
                  <div 
                    onClick={() => setUserType('professeur')}
                    style={{
                      padding: '1.5rem',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#000091';
                      e.currentTarget.style.backgroundColor = '#f6f6f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#000091' }}>Professeur</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                      Code d'activation requis - Je veux créer des cours et QCM
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Button
                    priority="tertiary no outline"
                    linkProps={{ href: "/connexion" }}
                  >
                    Déjà un compte ? Se connecter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Étape 2 : Formulaire d'inscription
  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <div className={fr.cx("fr-card")} style={{ maxWidth: '600px', width: '100%' }}>
          <div className={fr.cx("fr-card__body")}>
            <div className={fr.cx("fr-card__content")}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Button
                  priority="tertiary no outline"
                  onClick={() => setUserType(null)}
                  style={{ padding: '0.5rem', marginRight: '1rem' }}
                >
                  ← Retour
                </Button>
                <div>
                  <h3 className={fr.cx("fr-card__title")} style={{ margin: 0 }}>
                    Inscription {userType === 'professeur' ? 'Professeur' : 'Élève'}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    {userType === 'professeur' ? '👨‍🏫' : '🎓'} 
                    {userType === 'professeur' 
                      ? ' Créer un compte enseignant' 
                      : ' Créer un compte étudiant'
                    }
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Informations personnelles */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '1rem' }}>
                    Informations personnelles
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                      label="Nom"
                      nativeInputProps={{
                        value: formData.nom,
                        onChange: (e) => setFormData({...formData, nom: e.target.value}),
                        required: true,
                        autoComplete: "family-name"
                      }}
                    />
                    <Input
                      label="Prénom"
                      nativeInputProps={{
                        value: formData.prenom,
                        onChange: (e) => setFormData({...formData, prenom: e.target.value}),
                        required: true,
                        autoComplete: "given-name"
                      }}
                    />
                  </div>
                </div>

                {/* Identifiants de connexion */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '1rem' }}>
                    Identifiants de connexion
                  </h4>

                  {userType === 'professeur' ? (
                    <>
                      <Input
                        label="Adresse email professionnelle"
                        hintText="Utilisez votre email de l'établissement"
                        nativeInputProps={{
                          type: "email",
                          value: formData.email,
                          onChange: (e) => setFormData({...formData, email: e.target.value}),
                          required: true,
                          placeholder: "nom.prenom@college.fr",
                          autoComplete: "email"
                        }}
                      />
                      <Input
                        label="Code d'activation"
                        hintText="Code fourni par votre administration ou collègue"
                        nativeInputProps={{
                          value: formData.code_activation,
                          onChange: (e) => setFormData({...formData, code_activation: e.target.value}),
                          required: true,
                          placeholder: "Code à 8 caractères"
                        }}
                      />
                    </>
                  ) : (
                    <Input
                      label="Identifiant"
                      hintText="Choisissez un identifiant unique pour vous connecter"
                      nativeInputProps={{
                        value: formData.identifiant,
                        onChange: (e) => setFormData({...formData, identifiant: e.target.value}),
                        required: true,
                        placeholder: "mon_identifiant",
                        autoComplete: "username"
                      }}
                    />
                  )}
                </div>

                {/* Mot de passe */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '1rem' }}>
                    Sécurité
                  </h4>
                  <Input
                    label="Mot de passe"
                    hintText="Minimum 6 caractères"
                    nativeInputProps={{
                      type: "password",
                      value: formData.mot_de_passe,
                      onChange: (e) => setFormData({...formData, mot_de_passe: e.target.value}),
                      required: true,
                      minLength: 6,
                      autoComplete: "new-password"
                    }}
                  />

                  <Input
                    label="Confirmer le mot de passe"
                    nativeInputProps={{
                      type: "password",
                      value: formData.confirmer_mot_de_passe,
                      onChange: (e) => setFormData({...formData, confirmer_mot_de_passe: e.target.value}),
                      required: true,
                      autoComplete: "new-password"
                    }}
                  />
                </div>

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
                  {isLoading ? 'Création du compte...' : `Créer mon compte ${userType}`}
                </Button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Button
                  priority="tertiary no outline"
                  linkProps={{ href: "/connexion" }}
                >
                  Déjà un compte ? Se connecter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;