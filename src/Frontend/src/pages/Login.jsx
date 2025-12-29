import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/Login.css';
import logo from '../assets/img/logo-straaf.svg';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
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
                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="forgot-password">
                            <Link to="/recuperar-senha">Esqueceu a senha?</Link>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="spin-icon" size={20} />
                                    ENTRANDO...
                                </>
                            ) : (
                                'ENTRAR'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
