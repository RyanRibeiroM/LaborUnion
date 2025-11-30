import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import '../assets/css/Login.css';
// import './RecuperarSenha.css'; 

function RecuperarSenha() {
    const navigate = useNavigate();

    const handleRecovery = (e) => {
        e.preventDefault();
        alert("Email de recuperação enviado!");
        navigate('/'); 
    };

    return (
        <div className="login-container"> {/* Usando container do login */}
            <div className="login-card">      {/* Usando card do login */}
                
                {/* Lado Esquerdo */}
                {/* Adicionei a classe 'recovery-side-text' para ajustar o tamanho da fonte */}
                <div className="login-left recovery-side-text"> 
                    <h2>Não se <br/>preocupe!</h2>
                    <p>Vamos recuperá-la.</p>
                </div>

                {/* Lado Direito */}
                <div className="login-right">
                    <div className="login-header">
                        <h2>Esqueceu a senha?</h2>
                        <span className="subtitle">
                            Informe seu Email para redefinir sua senha.
                        </span>
                    </div>

                    <form onSubmit={handleRecovery} className="login-form">
                        
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input 
                                type="email" 
                                placeholder="Confirme seu Email" 
                                required 
                            />
                        </div>

                        {/* Reaproveita o estilo do botão, mas com largura fixa ajustada no CSS extra */}
                        <button type="submit" className="btn-login btn-recovery">
                            CONTINUAR
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RecuperarSenha;