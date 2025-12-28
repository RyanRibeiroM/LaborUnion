import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Camera,
    Save,
    Lock,
    Clock
} from 'lucide-react';
import '../assets/css/Profile.css';
import Toast from '../components/Toast';

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [isEditing, setIsEditing] = useState(false);

    // Dados do usuário logado
    const [userData, setUserData] = useState({
        nome: 'João Paulo Santos',
        email: 'joao.paulo@sindicato.org.br',
        telefone: '(88) 99999-0000',
        cargo: 'Secretário',
        setor: 'Secretaria',
        dataCadastro: '2024-01-15',
        ultimoAcesso: '2025-12-28 00:20:00',
        avatar: null
    });

    // Estado editável
    const [editData, setEditData] = useState({ ...userData });

    // Estatísticas do usuário
    const [stats, setStats] = useState({
        atendimentosHoje: 12,
        atendimentosMes: 156,
        cadastrosRealizados: 45
    });

    // Atividades recentes
    const [atividades, setAtividades] = useState([
        { id: 1, acao: 'Registrou atendimento', descricao: 'Francisco Antônio - Emissão de DAP', tempo: 'Há 15 min' },
        { id: 2, acao: 'Cadastrou agricultor', descricao: 'Maria das Graças Silva', tempo: 'Há 1 hora' },
        { id: 3, acao: 'Atualizou cadastro', descricao: 'José Pedro Alves', tempo: 'Há 2 horas' },
        { id: 4, acao: 'Gerou relatório', descricao: 'Atendimentos por período', tempo: 'Há 3 horas' },
        { id: 5, acao: 'Registrou atendimento', descricao: 'Ana Clara - Consulta Jurídica', tempo: 'Ontem' }
    ]);

    // Toast functions
    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    // Simular carregamento
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleEdit = () => {
        setEditData({ ...userData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditData({ ...userData });
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!editData.nome || !editData.email) {
            showToast('Nome e e-mail são obrigatórios.', 'warning');
            return;
        }
        setUserData({ ...editData });
        setIsEditing(false);
        showToast('Perfil atualizado com sucesso!', 'success');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        return date.toLocaleString('pt-BR');
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    // Loading
    if (isLoading) {
        return (
            <div className="profile-content">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Carregando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-content">
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />

            <h1 className="page-title">Meu Perfil</h1>

            <div className="profile-container">
                {/* Card Principal do Perfil */}
                <div className="profile-main-card fade-in">
                    <div className="profile-header">
                        <div className="avatar-section">
                            <div className="avatar-large">
                                {userData.avatar ? (
                                    <img src={userData.avatar} alt={userData.nome} />
                                ) : (
                                    <span>{getInitials(userData.nome)}</span>
                                )}
                            </div>
                            <button className="avatar-edit-btn" title="Alterar foto">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="profile-header-info">
                            <h2>{userData.nome}</h2>
                            <span className="cargo-badge">{userData.cargo}</span>
                            <p className="setor-text">
                                <Shield size={14} />
                                {userData.setor}
                            </p>
                        </div>
                        {!isEditing && (
                            <button className="btn-outline-primary" onClick={handleEdit}>
                                Editar Perfil
                            </button>
                        )}
                    </div>

                    {/* Formulário de Edição */}
                    {isEditing ? (
                        <div className="profile-form fade-in">
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Nome Completo</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        className="form-input"
                                        value={editData.nome}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>E-mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={editData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Telefone</label>
                                    <input
                                        type="text"
                                        name="telefone"
                                        className="form-input"
                                        value={editData.telefone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cargo</label>
                                    <input
                                        type="text"
                                        name="cargo"
                                        className="form-input"
                                        value={editData.cargo}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Setor</label>
                                    <input
                                        type="text"
                                        name="setor"
                                        className="form-input"
                                        value={editData.setor}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="btn-outline-gray" onClick={handleCancel}>
                                    Cancelar
                                </button>
                                <button className="btn-solid-green" onClick={handleSave}>
                                    <Save size={18} />
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-details fade-in">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <Mail size={18} />
                                    <div>
                                        <label>E-mail</label>
                                        <span>{userData.email}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Phone size={18} />
                                    <div>
                                        <label>Telefone</label>
                                        <span>{userData.telefone}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Calendar size={18} />
                                    <div>
                                        <label>Membro desde</label>
                                        <span>{formatDate(userData.dataCadastro)}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Clock size={18} />
                                    <div>
                                        <label>Último acesso</label>
                                        <span>{formatDateTime(userData.ultimoAcesso)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="profile-sidebar">
                    {/* Estatísticas */}
                    <div className="stats-card fade-in">
                        <h3>Suas Estatísticas</h3>
                        <div className="profile-stats-grid">
                            <div className="stat-item">
                                <span className="stat-value">{stats.atendimentosHoje}</span>
                                <span className="stat-label">Atendimentos Hoje</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{stats.atendimentosMes}</span>
                                <span className="stat-label">Atendimentos no Mês</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{stats.cadastrosRealizados}</span>
                                <span className="stat-label">Cadastros Realizados</span>
                            </div>
                        </div>
                    </div>

                    {/* Atividades Recentes */}
                    <div className="activities-card fade-in">
                        <h3>Atividades Recentes</h3>
                        <ul className="activities-list">
                            {atividades.map((atividade) => (
                                <li key={atividade.id} className="activity-item">
                                    <div className="activity-dot"></div>
                                    <div className="activity-content">
                                        <strong>{atividade.acao}</strong>
                                        <p>{atividade.descricao}</p>
                                        <span className="activity-time">{atividade.tempo}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Segurança */}
                    <div className="security-card fade-in">
                        <h3>Segurança</h3>
                        <div className="security-item">
                            <Lock size={18} />
                            <div>
                                <strong>Alterar Senha</strong>
                                <p>Recomendamos trocar sua senha regularmente</p>
                            </div>
                            <a href="/configuracao" className="link-btn">Alterar</a>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Profile;