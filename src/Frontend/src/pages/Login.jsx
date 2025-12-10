import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import '../assets/css/Login.css';
import logo from '../assets/img/logo-straaf.svg';

function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // API
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-left">
                    <div className="login-logo-area">
                        <div>
                            <img
                                src={logo}
                                alt="Sindicato Logo"
                                className="logo-img"
                            />
                        </div>
                    </div>
                    <h2>Bem vindo!</h2>
                    <p>Bom ter você como colaborador.</p>
                </div>

                <div className="login-right">
                    <div className="login-header">
                        <h2>Acesse sua conta</h2>
                        <span className="subtitle">Iniciar sessão</span>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">

                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="Senha"
                                required
                            />
                        </div>

                        <div className="forgot-password">
                            <Link to="/recuperar-senha">Esqueceu a senha?</Link>
                        </div>

                        <button type="submit" className="btn-login">
                            ENTRAR
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;