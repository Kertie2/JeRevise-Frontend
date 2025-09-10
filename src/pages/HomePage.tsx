import React from 'react';
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={fr.cx("fr-container")}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #000091 0%, #3558A0 100%)',
        color: 'white',
        borderRadius: '8px',
        margin: '2rem 0'
      }}>
        <img 
          src="https://raw.githubusercontent.com/JeRevise/JeRevise/refs/heads/main/svgviewer-png-output.png" 
          alt="Logo JeRevise" 
          style={{ width: '600px', marginBottom: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} 
        />
        {/* <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          JeRevise
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          La plateforme de révision intelligente pour les collèges
        </p> */}
        {!user && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button
              priority="secondary"
              linkProps={{ href: "/connexion" }}
              size="large"
            >
              Se connecter
            </Button>
            <Button
              priority="tertiary"
              linkProps={{ href: "/inscription" }}
              size="large"
            >
              Créer un compte
            </Button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div style={{ margin: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Une révision moderne et efficace
        </h2>
        
        <div 
        className="container"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <Tile
            title="Pour les professeurs"
            desc="Créez des QCM automatiquement à partir de vos cours grâce à l'IA"
            linkProps={{ href: "/inscription" }}
            imageUrl="https://img.icons8.com/color/96/teacher.png"
          />
          
          <Tile
            title="Pour les élèves"
            desc="Révisez de manière ciblée avec un suivi personnalisé de vos progrès"
            linkProps={{ href: "/inscription" }}
            imageUrl="https://img.icons8.com/emoji/96/man-student.png"
          />
          
          <Tile
            title="IA Intégrée"
            desc="Génération automatique de questions pertinentes depuis vos documents"
            imageUrl="https://img.icons8.com/fluency/50/artificial-intelligence.png"
          />
        </div>
      </div>

      {/* How it works */}
      <div style={{ margin: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Comment ça marche ?
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h3>1. Upload de cours</h3>
            <p>Les professeurs importent leurs fiches de cours (PDF, images)</p>
            
            <h3>2. Génération IA</h3>
            <p>L'IA extrait le texte et génère automatiquement des QCM pertinents</p>
            
            <h3>3. Validation</h3>
            <p>Les professeurs valident, modifient ou régénèrent les questions</p>
            
            <h3>4. Révision élèves</h3>
            <p>Les élèves révisent avec un suivi personnalisé de leurs progrès</p>
          </div>
          
          <div className={fr.cx("fr-card")} style={{ height: 'fit-content' }}>
            <div className={fr.cx("fr-card__body")}>
              <div className={fr.cx("fr-card__content")}>
                <h3 className={fr.cx("fr-card__title")}>Open Source</h3>
                <p className={fr.cx("fr-card__desc")}>JeRevise est une plateforme open source, développée pour l'éducation.</p>
                <div className={fr.cx("fr-card__start")}>
                  <Button
                    priority="secondary"
                    linkProps={{ 
                      href: "https://github.com/JeRevise", 
                      target: "_blank" 
                    }}
                  >
                    Voir sur GitHub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ 
        padding: '3rem', 
        borderRadius: '8px',
        textAlign: 'center',
        margin: '4rem 0'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>JeRevise en chiffres</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem' 
        }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000091' }}>100%</div>
            <div>Gratuit et Open Source</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000091' }}>IA</div>
            <div>Génération automatique</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000091' }}>6e-3e</div>
            <div>Tous niveaux collège</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;