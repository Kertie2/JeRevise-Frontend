import React from 'react';
import { Card } from "@codegouvfr/react-dsfr/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  color = 'blue' 
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'green': return 'fr-background-contrast--green-tilleul-verveine';
      case 'orange': return 'fr-background-contrast--orange-terre-battue';
      case 'red': return 'fr-background-contrast--red-marianne';
      default: return 'fr-background-contrast--blue-france';
    }
  };

  return (
    <Card
      title={title}
      desc={description}
      style={{ textAlign: 'center' }}
      className={getColorClass()}
    >
      {icon && <i className={`${icon} fr-icon--lg`} style={{ marginBottom: '1rem' }} />}
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#000091' }}>
        {value}
      </div>
    </Card>
  );
};

export default StatCard;