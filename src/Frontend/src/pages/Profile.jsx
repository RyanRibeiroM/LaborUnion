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
    Clock,
    Loader2
} from 'lucide-react';
import '../assets/css/Profile.css';
import Toast from '../components/Toast';
import { getProfile, updateProfile } from '../services/userService';
import { get } from '../services/api';

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [isEditing, setIsEditing] = useState(false);

    // Dados do usuário logado
    const [userData, setUserData] = useState({
        nome: '',
        email: '',
        cargo: '',
        avatar: null
    });

    // Estado editável
    const [editData, setEditData] = useState({ ...userData });

    // Estatísticas do usuário - agora carregadas da API
    const [stats, setStats] = useState({
        atendimentosHoje: 0,
        atendimentosMes: 0,
        cadastrosRealizados: 0
    });

    // Atividades recentes - será carregado da API
    const [atividades, setAtividades] = useState([]);

    // Toast functions
    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    // Carregar estatísticas do usuário da API
    const loadUserStats = async () => {
        try {
            // Usa o mesmo endpoint do dashboard que já tem os dados
            const response = await get('/dashboard/accountants');

            console.log('📊 Stats do Profile:', response);

            if (response) {
                setStats({
                    // Serviços realizados hoje (se disponível) ou 0
                    atendimentosHoje: response.numberOfServicesProvidedToday || 0,
                    // Serviços realizados este mês
                    atendimentosMes: response.numberOfServicesProvidedThisMonth || response.numberOfServicesProvided || 0,
                    // Agricultores cadastrados (total)
                    cadastrosRealizados: response.numberOfFarmers || 0
                });
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    // Carregar atividades recentes (se houver endpoint)
    const loadAtividades = async () => {
        try {
            // Por enquanto, tenta buscar os últimos serviços como atividades
            const response = await get('/service/filter');

            if (response) {
                // Vamos usar POST com filtro vazio para pegar os últimos
            }
        } catch (error) {
            // Se não tiver endpoint, mantém vazio
            console.log('Atividades: endpoint não disponível');
        }
    };

    // Carregar dados do perfil da API
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getProfile();
                const profileData = {
                    nome: profile.name || '',
                    email: profile.email || '',
                    cargo: profile.role || '',
                    avatar: null
                };
                setUserData(profileData);
                setEditData(profileData);

                // Carrega também as estatísticas
                await loadUserStats();
            } catch (error) {
                showToast('Erro ao carregar perfil: ' + error.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
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

    const handleSave = async () => {
        if (!editData.nome || !editData.email) {
            showToast('Nome e e-mail são obrigatórios.', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({
                name: editData.nome,
                email: editData.email
            });
            setUserData({ ...editData });
            setIsEditing(false);
            showToast('Perfil atualizado com sucesso!', 'success');
        } catch (error) {
            showToast('Erro ao atualizar perfil: ' + error.message, 'error');
        } finally {
            setIsSaving(false);
        }
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
        if (!name) return '?';
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
                            <h2>{userData.nome || 'Usuário'}</h2>
                            <span className="cargo-badge">{userData.cargo || 'Colaborador'}</span>
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
                                        disabled={isSaving}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>E-mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={editData.email}
                                        onChange={handleChange}
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="btn-outline-gray" onClick={handleCancel} disabled={isSaving}>
                                    Cancelar
                                </button>
                                <button className="btn-solid-green" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="spin-icon" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Salvar Alterações
                                        </>
                                    )}
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
                                        <span>{userData.email || '-'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Shield size={18} />
                                    <div>
                                        <label>Cargo</label>
                                        <span>{userData.cargo || '-'}</span>
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