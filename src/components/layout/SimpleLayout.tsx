import React from 'react';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
        <h1>JeRevise</h1>
        <p>Plateforme de révision pour les collèges</p>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default SimpleLayout;