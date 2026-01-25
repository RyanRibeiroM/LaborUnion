import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Lock, Loader2 } from 'lucide-react';
import '../assets/css/Login.css';
import Toast from '../components/Toast';

function RedefinirSenha() {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ newPass: '', confirmPass: '' });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    const handleReset = (e) => {
        e.preventDefault();
        
        if (passwords.newPass !== passwords.confirmPass) {
            showToast("As senhas não coincidem!", "error");
            return;
        }

        setLoading(true);
        // Simulação de API
        setTimeout(() => {
            setLoading(false);
            showToast("Senha redefinida com sucesso!", "success");
            setTimeout(() => navigate('/'), 1500);
        }, 1500);
    };

    return (
        <div className="login-container">
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />
            <div className="login-card">
                
                <div className="login-left">
                    <h2>Tudo ok!</h2>
                    <p>Você já pode definir sua nova senha.</p>
                </div>

                <div className="login-right">
                    <div className="login-header">
                        <h2>Redefinir Senha</h2>
                    </div>

                    <form onSubmit={handleReset} className="login-form">
                        
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password" 
                                placeholder="Nova Senha" 
                                value={passwords.newPass}
                                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                required 
                                disabled={loading}
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password" 
                                placeholder="Confirmar Senha" 
                                value={passwords.confirmPass}
                                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                                required 
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn-login btn-ajust" disabled={loading}>
                            {loading ? <><Loader2 className="spin-icon" size={20} /> SALVANDO...</> : 'CONFIRMAR'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );  
}

export default RedefinirSenha;