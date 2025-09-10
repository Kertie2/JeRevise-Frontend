import React from 'react';
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        brandTop={
          <>
            République
            <br />
            Française
          </>
        }
        homeLinkProps={{
          href: "/",
          title: "Accueil - JeRevise"
        }}
        serviceTitle="JeRevise"
        serviceTagline="Plateforme de révision pour les collèges"
        quickAccessItems={user ? [
          {
            iconId: "ri-account-circle-line",
            linkProps: {
              href: user.role === 'professeur' ? '/professeur' : '/eleve'
            },
            text: `${user.prenom} ${user.nom}`
          },
          {
            iconId: "ri-logout-box-r-line",
            buttonProps: {
              onClick: logout
            },
            text: "Se déconnecter"
          }
        ] : [
          {
            iconId: "ri-account-circle-line",
            linkProps: {
              href: "/connexion"
            },
            text: "Se connecter"
          }
        ]}
        navigation={[
          {
            text: "Accueil",
            linkProps: { href: "/" }
          },
          ...(user?.role === 'professeur' ? [
            {
              text: "Mes cours",
              linkProps: { href: "/professeur/cours" }
            },
            {
              text: "QCM",
              linkProps: { href: "/professeur/qcm" }
            },
            {
              text: "Suivi élèves",
              linkProps: { href: "/professeur/suivi" }
            }
          ] : []),
          ...(user?.role === 'eleve' ? [
            {
              text: "Mes révisions",
              linkProps: { href: "/eleve/revisions" }
            },
            {
              text: "Mes résultats",
              linkProps: { href: "/eleve/resultats" }
            }
          ] : [])
        ]}
      />
      
      <main style={{ flex: 1 }}>
        <br></br>
        {children}
      </main>

      <br></br>
      
      <Footer
        brandTop={
          <>
            République
            <br />
            Française
          </>
        }
        accessibility="non compliant"
        contentDescription={`
          JeRevise est une plateforme open source développée pour améliorer 
          la révision des élèves de collège. Elle permet aux professeurs de 
          créer des QCM automatiquement à partir de leurs cours grâce à l'IA.
        `}
        bottomItems={[
          {
            text: "Données personnelles",
            linkProps: { href: "/donnees-personnelles" }
          },
          {
            text: "Mentions légales",
            linkProps: { href: "/mentions-legales" }
          }
        ]}
      />
    </div>
  );
};

export default Layout;