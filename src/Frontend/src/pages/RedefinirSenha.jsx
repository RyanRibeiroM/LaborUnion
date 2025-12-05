import React from "react";
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react';
import '../assets/css/Login.css';

function RedefinirSenha() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // API
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                
                <div className="login-left">
                    <h2>Tudo ok!</h2>
                    <p>Você já pode definir sua nova senha.</p>
                </div>

                <div className="login-right">
                    <div className="login-header">
                        <h2>Redefinir Senha</h2>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password" 
                                placeholder="Nova Senha" 
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password" 
                                placeholder="Confirmar Senha" 
                                required 
                            />
                        </div>

                        <button type="submit" className="btn-login btn-ajust">
                            CONFIRMAR
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );  
}

export default RedefinirSenha;