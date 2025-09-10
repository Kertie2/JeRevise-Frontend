import React from 'react';
import { fr } from "@codegouvfr/react-dsfr";

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
    <div className={fr.cx("fr-card", "fr-enlarge-link", getColorClass())}>
      <div className={fr.cx("fr-card__body")}>
        <div className={fr.cx("fr-card__content")} style={{ textAlign: 'center' }}>
          <h3 className={fr.cx("fr-card__title")}>{title}</h3>
          {icon && <i className={`${icon} fr-icon--lg`} style={{ marginBottom: '1rem' }} />}
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#000091' }}>
            {value}
          </div>
          {description && <p className={fr.cx("fr-card__desc")}>{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;