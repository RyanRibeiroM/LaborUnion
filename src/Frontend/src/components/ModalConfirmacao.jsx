import React from 'react';
import { Trash2, LogOut, AlertTriangle } from 'lucide-react';
import '../assets/css/Modal.css'

const ModalConfirmacao = ({ 
    isOpen, 
    onCancel, 
    onConfirm, 
    title = "Confirmação", 
    message = "Tem certeza?", 
    confirmText = "Confirmar",
    tipo = "delete"
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        if (tipo === 'logout') return <LogOut size={18} />;
        return <Trash2 size={18} />;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn-modal-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button 
                        className="btn-modal-delete" 
                        onClick={onConfirm}
                    >
                        {getIcon()} {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacao;