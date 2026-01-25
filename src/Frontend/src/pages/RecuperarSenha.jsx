import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import '../assets/css/Login.css';
import Toast from '../components/Toast';

function RecuperarSenha() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    const handleRecovery = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulação de envio (futuramente integrar com API)
        setTimeout(() => {
            setLoading(false);
            showToast("Email de recuperação enviado! Verifique sua caixa de entrada.", "success");
        }, 1500);
    };

    return (
        <div className="login-container"> 
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} />
            <div className="login-card">
                
                <div className="login-right recovery-side-text"> 
                    <div className="login-header">
                        <h2>Esqueceu a senha?</h2>
                        <span className="subtitle">
                            Informe seu Email para redefinir sua senha.
                        </span>
                    </div>

                    <form onSubmit={handleRecovery} className="login-form form-ajust">
                        
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input 
                                type="email" 
                                placeholder="Confirme seu Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn-login btn-recovery" disabled={loading}>
                            {loading ? <><Loader2 className="spin-icon" size={20} /> ENVIANDO...</> : 'CONTINUAR'}
                        </button>

                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <button 
                                type="button" 
                                onClick={() => navigate('/')}
                                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}
                            >
                                <ArrowLeft size={16} /> Voltar para Login
                            </button>
                        </div>
                    </form>
                </div>

                <div className="login-left">
                    <h2>Não se preocupe!</h2>
                    <p>Vamos recuperá-la.</p>
                </div>
            </div>
        </div>
    );
}

export default RecuperarSenha;