import React from 'react';
import '../assets/css/MobileCard.css';

/**
 * Componente MobileCard - Card reutilizável para exibição de dados em mobile
 * 
 * @param {Array} fields - Array de objetos {label, value, highlight?}
 * @param {React.ReactNode} actions - Botões de ação
 * @param {React.ReactNode} status - Tag de status (opcional)
 * @param {string} className - Classes adicionais (opcional)
 */
const MobileCard = ({ fields, actions, status, className = '' }) => {
    return (
        <div className={`mobile-card ${className}`}>
            <div className="mobile-card-content">
                {fields.map((field, index) => (
                    <div key={index} className="mobile-card-row">
                        <span className="mobile-card-label">{field.label}</span>
                        <span className={`mobile-card-value ${field.highlight ? 'highlight' : ''}`}>
                            {field.isStatus && status ? status : field.value}
                        </span>
                    </div>
                ))}
            </div>

            {actions && (
                <div className="mobile-card-actions">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default MobileCard;
