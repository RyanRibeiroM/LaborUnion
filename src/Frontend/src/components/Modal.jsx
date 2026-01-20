import React from 'react';
import { X } from 'lucide-react';
import '../assets/css/Modal.css';

/**
 * Componente de Modal reutilizável
 * @param {boolean} isOpen - Se o modal está aberto
 * @param {function} onClose - Função para fechar o modal
 * @param {string} title - Título do modal
 * @param {React.ReactNode} children - Conteúdo do modal
 * @param {React.ReactNode} footer - Rodapé do modal (botões)
 */
const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
