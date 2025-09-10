import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fr } from "@codegouvfr/react-dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [userType, setUserType] = useState<'eleve' | 'professeur' | null>(null);
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
    if (!userType) return;
    
    setIsLoading(true);
    setError('');

    try {
      const credentials = userType === 'professeur' 
        ? { email: formData.email, mot_de_passe: formData.mot_de_passe }
        : { identifiant: formData.identifiant, mot_de_passe: formData.mot_de_passe };

      await login(credentials, userType);
      navigate(`/${userType}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
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
                  Connexion à JeRevise
                </h2>
                
                <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                  Vous êtes :
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
                    <p style={{ margin: 0, color: '#666' }}>
                      Je veux réviser mes cours et faire des QCM
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
                    <p style={{ margin: 0, color: '#666' }}>
                      Je veux créer des cours et générer des QCM
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Button
                    priority="tertiary no outline"
                    linkProps={{ href: "/inscription" }}
                  >
                    Pas encore de compte ? S'inscrire
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Étape 2 : Formulaire de connexion
  return (
    <div className={fr.cx("fr-container")}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <div className={fr.cx("fr-card")} style={{ maxWidth: '500px', width: '100%' }}>
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
                    Connexion {userType === 'professeur' ? 'Professeur' : 'Élève'}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    {userType === 'professeur' ? '👨‍🏫' : '🎓'} 
                    {userType === 'professeur' 
                      ? ' Espace enseignant' 
                      : ' Espace étudiant'
                    }
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {userType === 'professeur' ? (
                  <Input
                    label="Adresse email professionnelle"
                    nativeInputProps={{
                      type: "email",
                      value: formData.email,
                      onChange: (e) => setFormData({...formData, email: e.target.value}),
                      required: true,
                      placeholder: "nom.prenom@college.fr",
                      autoComplete: "email"
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
                      placeholder: "Mon identifiant",
                      autoComplete: "username"
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
                    autoComplete: "current-password"
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
                  Créer un compte {userType === 'professeur' ? 'professeur' : 'élève'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;