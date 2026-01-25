import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import '../assets/css/Toast.css';

const Toast = ({ show, message, type = 'info', onClose, duration = 3500 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            setIsLeaving(false);

            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsLeaving(false);
            if (onClose) onClose();
        }, 300); // Duração da animação de saída
    };

    if (!isVisible) return null;

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />
    };

    return (
        <div className={`toast-container ${isLeaving ? 'toast-leaving' : 'toast-entering'}`}>
            <div className={`toast toast-${type}`}>
                <span className="toast-icon">{icons[type]}</span>
                <span className="toast-message">{message}</span>
                <button className="toast-close" onClick={handleClose} aria-label="Fechar">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
