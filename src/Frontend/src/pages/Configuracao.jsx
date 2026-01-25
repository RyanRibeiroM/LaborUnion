import React, { useState, useEffect } from 'react';
import {
    Building2,
    User,
    Users,
    Bell,
    Shield,
    Database,
    Save,
    Plus,
    Trash2,
    Edit,
    X,
    FileText
} from 'lucide-react';
import '../assets/css/Configuracao.css';
import Toast from '../components/Toast';
import ModalConfirmacao from '../components/ModalConfirmacao';
import { filterSectors, createSector } from '../services/sectorService';
import { del, put, get, post } from '../services/api';

const Configuracao = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('sindicato');
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingSetor, setEditingSetor] = useState(null);

    // Estados dos formulários - dados mockados
    const [sindicatoData, setSindicatoData] = useState({
        nome: 'Sindicato dos Trabalhadores Rurais Agricultores e Agricultoras Familiares de Crateús',
        cnpj: '06.586.523/0001-48',
        endereco: 'Rua Coronel Lúcio, 715 - Centro',
        cidade: 'Crateús',
        estado: 'CE',
        telefone: '(88) 3691-0208',
        email: 'strcrateus.ce@bol.com.br',
        presidente: 'FRANCISCO DAS CHAGAS MATIAS DE SOUSA'
    });

    const [contaData, setContaData] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });

    const [notificacoes, setNotificacoes] = useState({
        emailAtendimento: true,
        emailCadastro: true,
        emailVencimento: false,
        sistemaAlerta: true
    });

    const [setores, setSetores] = useState([]);

    const [novoSetor, setNovoSetor] = useState({ nome: '', descricao: '' });

    // Estados para gerenciamento de usuários
    const [usuarios, setUsuarios] = useState([]);
    const [novoUsuario, setNovoUsuario] = useState({ name: '', email: '', password: '', role: 2 });
    const [editingUsuario, setEditingUsuario] = useState(null);
    const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);

    // Estados para gerenciamento de serviços/demandas
    const [servicos, setServicos] = useState([]);
    const [novoServico, setNovoServico] = useState({ name: '', description: '', sectorId: '' });
    const [editingServico, setEditingServico] = useState(null);
    const [showServicoEditModal, setShowServicoEditModal] = useState(false);
    const [servicoToDelete, setServicoToDelete] = useState(null);
    const [showServicoDeleteModal, setShowServicoDeleteModal] = useState(false);

    // Seções do menu
    const menuSections = [
        { id: 'sindicato', label: 'Dados do Sindicato', icon: <Building2 size={20} /> },
        { id: 'usuarios', label: 'Usuários', icon: <Users size={20} /> },
        { id: 'conta', label: 'Minha Conta', icon: <User size={20} /> },
        { id: 'notificacoes', label: 'Notificações', icon: <Bell size={20} /> },
        { id: 'setores', label: 'Setores', icon: <Shield size={20} /> },
        { id: 'servicos', label: 'Serviços/Demandas', icon: <FileText size={20} /> },
    ];

    // Toast functions
    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    // Carregar setores e usuários da API
    useEffect(() => {
        const loadSetores = async () => {
            try {
                const response = await filterSectors({});
                if (response && response.sectors) {
                    const setoresFormatados = response.sectors.map(s => ({
                        id: s.id,
                        nome: s.name,
                        descricao: s.description || '',
                        ativo: true
                    }));
                    setSetores(setoresFormatados);
                }
            } catch (error) {
                console.error('Erro ao carregar setores:', error);
            }
        };

        const loadUsuarios = async () => {
            try {
                const response = await post('/user/filter', {});

                console.log("Dados brutos da API:", response.users);

                if (response && response.users) {
                    // Correção aplicada na listagem (CamelCase ou PascalCase)
                    const usuariosFormatados = response.users.map(u => ({
                        id: u.id || u.Id,
                        name: u.name || u.Name,
                        email: u.email || u.Email || '',
                        role: u.role || u.Role
                    }));

                    setUsuarios(usuariosFormatados);
                }
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
                showToast('Erro ao carregar lista de usuários', 'error');
            }
        };

        const loadServicos = async () => {
            try {
                const response = await post('/servicetype/filter', {});
                if (response && response.servicesTypes) {
                    const servicosFormatados = response.servicesTypes.map(s => ({
                        id: s.id || s.Id,
                        nome: s.name || s.Name,
                        descricao: s.description || s.Description || '',
                        sectorId: s.sectorId || s.SectorId
                    }));
                    setServicos(servicosFormatados);
                }
            } catch (error) {
                console.error('Erro ao carregar serviços:', error);
            }
        };

        Promise.all([loadSetores(), loadUsuarios(), loadServicos()]).finally(() => {
            setIsLoading(false);
        });
    }, []);

    // Salvar dados do sindicato no localStorage automaticamente ao carregar
    useEffect(() => {
        localStorage.setItem('sindicatoData', JSON.stringify(sindicatoData));
    }, [sindicatoData]);

    // Handlers
    const handleSindicatoChange = (e) => {
        const { name, value } = e.target;
        setSindicatoData({ ...sindicatoData, [name]: value });
    };

    const handleContaChange = (e) => {
        const { name, value } = e.target;
        setContaData({ ...contaData, [name]: value });
    };

    const handleNotificacoesChange = (e) => {
        const { name, checked } = e.target;
        setNotificacoes({ ...notificacoes, [name]: checked });
    };

    const handleSaveSindicato = () => {
        // Salvar no localStorage para uso em outros componentes (ex: geração de documentos)
        localStorage.setItem('sindicatoData', JSON.stringify(sindicatoData));
        showToast('Dados do sindicato atualizados com sucesso!', 'success');
    };

    const handleSaveConta = () => {
        if (!contaData.senhaAtual) {
            showToast('Informe a senha atual.', 'warning');
            return;
        }
        if (contaData.novaSenha !== contaData.confirmarSenha) {
            showToast('As senhas não coincidem.', 'error');
            return;
        }
        if (contaData.novaSenha.length < 6) {
            showToast('A nova senha deve ter pelo menos 6 caracteres.', 'warning');
            return;
        }
        setContaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
        showToast('Senha alterada com sucesso!', 'success');
    };

    const handleSaveNotificacoes = () => {
        showToast('Preferências de notificação salvas!', 'success');
    };

    const handleAddSetor = async () => {
        if (!novoSetor.nome.trim()) {
            showToast('Informe o nome do setor.', 'warning');
            return;
        }
        try {
            const response = await createSector({
                name: novoSetor.nome,
                description: novoSetor.descricao
            });
            // Recarregar lista de setores
            const updatedResponse = await filterSectors({});
            if (updatedResponse && updatedResponse.sectors) {
                const setoresFormatados = updatedResponse.sectors.map(s => ({
                    id: s.id,
                    nome: s.name,
                    descricao: s.description || '',
                    ativo: true
                }));
                setSetores(setoresFormatados);
            }
            setNovoSetor({ nome: '', descricao: '' });
            showToast('Setor adicionado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao adicionar setor:', error);
            showToast('Erro ao adicionar setor: ' + error.message, 'error');
        }
    };

    const handleDeleteSetor = (id) => {
        setItemToDelete(id);
        setShowModal(true);
    };

    const confirmDeleteSetor = async () => {
        try {
            await del(`/sector/${itemToDelete}`);
            setSetores(setores.filter(s => s.id !== itemToDelete));
            setShowModal(false);
            setItemToDelete(null);
            showToast('Setor removido com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir setor:', error);
            showToast('Erro ao excluir setor: ' + error.message, 'error');
            setShowModal(false);
        }
    };

    const handleToggleSetor = (id) => {
        setSetores(setores.map(s =>
            s.id === id ? { ...s, ativo: !s.ativo } : s
        ));
        showToast('Status do setor atualizado!', 'info');
    };

    const handleEditSetor = (setor) => {
        setEditingSetor({ ...setor });
    };

    const handleCancelEdit = () => {
        setEditingSetor(null);
    };

    const handleSaveEdit = async () => {
        if (!editingSetor.nome.trim()) {
            showToast('O nome do setor é obrigatório.', 'warning');
            return;
        }
        try {
            await put(`/sector/${editingSetor.id}`, {
                name: editingSetor.nome,
                description: editingSetor.descricao
            });
            setSetores(setores.map(s =>
                s.id === editingSetor.id ? { ...s, nome: editingSetor.nome, descricao: editingSetor.descricao } : s
            ));
            setEditingSetor(null);
            showToast('Setor atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar setor:', error);
            showToast('Erro ao atualizar setor: ' + error.message, 'error');
        }
    };

    // ============ CRUD Usuários ============
    const handleAddUsuario = async () => {
        if (!novoUsuario.name.trim() || !novoUsuario.email.trim() || !novoUsuario.password.trim()) {
            showToast('Preencha todos os campos obrigatórios.', 'warning');
            return;
        }
        try {
            await post('/user', novoUsuario);
            // Recarregar lista de usuários
            const response = await post('/user/filter', {});
            if (response && response.users) {
                // Formatação necessária também no reload
                const usersFormatted = response.users.map(u => ({
                    id: u.id || u.Id,
                    name: u.name || u.Name,
                    email: u.email || u.Email || '',
                    role: u.role || u.Role
                }));
                setUsuarios(usersFormatted);
            }
            setNovoUsuario({ name: '', email: '', password: '', role: 2 });
            showToast('Usuário cadastrado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            showToast('Erro ao cadastrar usuário: ' + error.message, 'error');
        }
    };

    const handleDeleteUsuario = (id) => {
        setUserToDelete(id);
        setShowUserDeleteModal(true);
    };

    const confirmDeleteUsuario = async () => {
        try {
            await del(`/user/${userToDelete}`);
            setUsuarios(usuarios.filter(u => u.id !== userToDelete));
            setShowUserDeleteModal(false);
            setUserToDelete(null);
            showToast('Usuário removido com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            showToast('Erro ao excluir usuário: ' + error.message, 'error');
            setShowUserDeleteModal(false);
        }
    };

    const handleEditUsuario = async (id) => {
        try {
            const response = await get(`/user/${id}`);

            // Log para debug
            console.log("Dados do usuário para edição:", response);

            if (response) {
                // NORMALIZAÇÃO DE DADOS (CORREÇÃO APLICADA AQUI)
                // Verifica propriedade minúscula (camelCase) OU maiúscula (PascalCase)
                const userId = response.id || response.Id;
                const userName = response.name || response.Name;
                const userEmail = response.email || response.Email;
                const userRole = response.role || response.Role;

                // Lógica de Role robusta: aceita string 'Administrator' ou int 1
                let roleValue = 2; // Padrão
                if (userRole === 'Administrator' || userRole === 1) {
                    roleValue = 1;
                }

                setEditingUsuario({
                    id: userId,
                    name: userName,
                    email: userEmail,
                    password: '', // Senha vazia ao editar
                    role: roleValue
                });
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            showToast('Erro ao carregar dados do usuário', 'error');
        }
    };

    const handleCancelEditUsuario = () => {
        setEditingUsuario(null);
    };

    const handleSaveEditUsuario = async () => {
        if (!editingUsuario.name.trim() || !editingUsuario.email.trim()) {
            showToast('Nome e e-mail são obrigatórios.', 'warning');
            return;
        }
        try {
            const payload = {
                name: editingUsuario.name,
                email: editingUsuario.email,
                password: editingUsuario.password || 'TempPass123!', // Senha temporária se não informada
                role: editingUsuario.role
            };
            await put(`/user/${editingUsuario.id}`, payload);

            // Recarregar lista
            const response = await post('/user/filter', {});
            if (response && response.users) {
                const usersFormatted = response.users.map(u => ({
                    id: u.id || u.Id,
                    name: u.name || u.Name,
                    email: u.email || u.Email || '',
                    role: u.role || u.Role
                }));
                setUsuarios(usersFormatted);
            }
            setEditingUsuario(null);
            showToast('Usuário atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            showToast('Erro ao atualizar usuário: ' + error.message, 'error');
        }
    };

    // ============ CRUD Serviços/Demandas ============
    const handleAddServico = async () => {
        if (!novoServico.name.trim()) {
            showToast('O nome do serviço é obrigatório.', 'warning');
            return;
        }
        try {
            await post('/servicetype', {
                name: novoServico.name,
                description: novoServico.description,
                sectorId: novoServico.sectorId ? parseInt(novoServico.sectorId) : null
            });
            // Recarregar lista
            const response = await post('/servicetype/filter', {});
            if (response && response.servicesTypes) {
                const servicosFormatados = response.servicesTypes.map(s => ({
                    id: s.id || s.Id,
                    nome: s.name || s.Name,
                    descricao: s.description || s.Description || '',
                    sectorId: s.sectorId || s.SectorId
                }));
                setServicos(servicosFormatados);
            }
            setNovoServico({ name: '', description: '', sectorId: '' });
            showToast('Serviço adicionado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao adicionar serviço:', error);
            showToast('Erro ao adicionar serviço: ' + error.message, 'error');
        }
    };

    const handleDeleteServico = (id) => {
        setServicoToDelete(id);
        setShowServicoDeleteModal(true);
    };

    const confirmDeleteServico = async () => {
        try {
            await del(`/servicetype/${servicoToDelete}`);
            setServicos(servicos.filter(s => s.id !== servicoToDelete));
            setShowServicoDeleteModal(false);
            setServicoToDelete(null);
            showToast('Serviço removido com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            showToast('Erro ao excluir serviço: ' + error.message, 'error');
            setShowServicoDeleteModal(false);
        }
    };

    const handleEditServico = (servico) => {
        setEditingServico({ ...servico });
        setShowServicoEditModal(true);
    };

    const handleCancelEditServico = () => {
        setEditingServico(null);
        setShowServicoEditModal(false);
    };

    const handleSaveEditServico = async () => {
        if (!editingServico.nome.trim()) {
            showToast('O nome do serviço é obrigatório.', 'warning');
            return;
        }
        try {
            await put(`/servicetype/${editingServico.id}`, {
                name: editingServico.nome,
                description: editingServico.descricao
            });
            setServicos(servicos.map(s =>
                s.id === editingServico.id ? { ...s, nome: editingServico.nome, descricao: editingServico.descricao } : s
            ));
            setEditingServico(null);
            setShowServicoEditModal(false);
            showToast('Serviço atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            showToast('Erro ao atualizar serviço: ' + error.message, 'error');
        }
    };

    const getRoleLabel = (role) => {
        if (role === 1 || role === 'Administrator') return 'Administrador';
        if (role === 2 || role === 'Attendant') return 'Atendente';
        return 'Usuário';
    };

    const handleExportBackup = () => {
        const backupData = {
            sindicato: sindicatoData,
            setores: setores,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `backup_sindicato_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        showToast('Backup exportado com sucesso!', 'success');
    };

    // Loading
    if (isLoading) {
        return (
            <div className="configuracao-content">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Carregando configurações...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="configuracao-content">
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />

            <ModalConfirmacao
                isOpen={showModal}
                onCancel={() => setShowModal(false)}
                onConfirm={confirmDeleteSetor}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja excluir este setor?"
                confirmText="Excluir"
                tipo="delete"
            />

            <h1 className="page-title">Configurações</h1>

            <div className="config-container">
                {/* Menu Lateral */}
                <aside className="config-menu">
                    {menuSections.map((section) => (
                        <button
                            key={section.id}
                            className={`config-menu-item ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.icon}
                            <span>{section.label}</span>
                        </button>
                    ))}
                </aside>

                {/* Conteúdo Principal */}
                <main className="config-main">
                    {/* Seção: Dados do Sindicato */}
                    {activeSection === 'sindicato' && (
                        <div className="config-section fade-in">
                            <div className="section-header">
                                <h2>Dados do Sindicato</h2>
                                <p>Informações gerais da organização</p>
                            </div>

                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Nome do Sindicato</label>
                                    <span className="form-value">{sindicatoData.nome}</span>
                                </div>
                                <div className="form-group">
                                    <label>CNPJ</label>
                                    <span className="form-value">{sindicatoData.cnpj}</span>
                                </div>
                                <div className="form-group">
                                    <label>Telefone</label>
                                    <span className="form-value">{sindicatoData.telefone}</span>
                                </div>
                                <div className="form-group full-width">
                                    <label>Endereço</label>
                                    <span className="form-value">{sindicatoData.endereco}</span>
                                </div>
                                <div className="form-group">
                                    <label>Cidade</label>
                                    <span className="form-value">{sindicatoData.cidade}</span>
                                </div>
                                <div className="form-group">
                                    <label>Estado</label>
                                    <span className="form-value">{sindicatoData.estado}</span>
                                </div>
                                <div className="form-group full-width">
                                    <label>E-mail</label>
                                    <span className="form-value">{sindicatoData.email}</span>
                                </div>
                                <div className="form-group full-width">
                                    <label>Presidente</label>
                                    <span className="form-value">{sindicatoData.presidente}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Seção: Usuários */}
                    {activeSection === 'usuarios' && (
                        <div className="config-section fade-in">
                            <div className="section-header">
                                <h2>Gerenciamento de Usuários</h2>
                                <p>Cadastre e gerencie os usuários do sistema</p>
                            </div>

                            {/* Modal de confirmação de exclusão de usuário */}
                            <ModalConfirmacao
                                isOpen={showUserDeleteModal}
                                onCancel={() => setShowUserDeleteModal(false)}
                                onConfirm={confirmDeleteUsuario}
                                title="Confirmar Exclusão"
                                message="Tem certeza que deseja excluir este usuário?"
                                confirmText="Excluir"
                                tipo="delete"
                            />

                            {/* Formulário de cadastro */}
                            <div className="add-setor-form">
                                <h4 className="form-subtitle">Novo Usuário</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nome Completo <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Nome do usuário"
                                            value={novoUsuario.name}
                                            onChange={(e) => setNovoUsuario({ ...novoUsuario, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>E-mail <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="email@exemplo.com"
                                            value={novoUsuario.email}
                                            onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Senha <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            placeholder="Mínimo 8 caracteres"
                                            value={novoUsuario.password}
                                            onChange={(e) => setNovoUsuario({ ...novoUsuario, password: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tipo de Usuário</label>
                                        <select
                                            className="form-select"
                                            value={novoUsuario.role}
                                            onChange={(e) => setNovoUsuario({ ...novoUsuario, role: parseInt(e.target.value) })}
                                        >
                                            <option value={2}>Atendente</option>
                                            <option value={1}>Administrador</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-footer">
                                    <button className="btn-solid-green" onClick={handleAddUsuario}>
                                        <Plus size={18} />
                                        Cadastrar Usuário
                                    </button>
                                </div>
                            </div>

                            {/* Lista de usuários */}
                            <h4 className="form-subtitle" style={{ marginTop: '24px' }}>Usuários Cadastrados</h4>
                            <div className="setores-list">
                                {usuarios.length === 0 ? (
                                    <p className="empty-message">Nenhum usuário cadastrado.</p>
                                ) : (
                                    usuarios.map((usuario) => (
                                        <div key={usuario.id} className="setor-item">
                                            {editingUsuario && editingUsuario.id === usuario.id ? (
                                                <>
                                                    <div className="setor-edit-form">
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            value={editingUsuario.name}
                                                            onChange={(e) => setEditingUsuario({ ...editingUsuario, name: e.target.value })}
                                                            placeholder="Nome"
                                                        />
                                                        <input
                                                            type="email"
                                                            className="form-input"
                                                            value={editingUsuario.email}
                                                            onChange={(e) => setEditingUsuario({ ...editingUsuario, email: e.target.value })}
                                                            placeholder="E-mail"
                                                        />
                                                        <select
                                                            className="form-select"
                                                            value={editingUsuario.role}
                                                            onChange={(e) => setEditingUsuario({ ...editingUsuario, role: parseInt(e.target.value) })}
                                                        >
                                                            <option value={2}>Atendente</option>
                                                            <option value={1}>Administrador</option>
                                                        </select>
                                                    </div>
                                                    <div className="setor-actions">
                                                        <button className="btn-icon-save" onClick={handleSaveEditUsuario} title="Salvar">
                                                            <Save size={18} />
                                                        </button>
                                                        <button className="btn-icon-cancel" onClick={handleCancelEditUsuario} title="Cancelar">
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="setor-info">
                                                        <h4>{usuario.name}</h4>
                                                        <p>{usuario.email || 'Sem e-mail'}</p>
                                                    </div>
                                                    <div className="setor-actions">
                                                        <span className="user-role-badge">{getRoleLabel(usuario.role)}</span>
                                                        <button
                                                            className="btn-icon-edit"
                                                            onClick={() => handleEditUsuario(usuario.id)}
                                                            title="Editar usuário"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            className="btn-icon-delete"
                                                            onClick={() => handleDeleteUsuario(usuario.id)}
                                                            title="Excluir usuário"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Seção: Minha Conta */}
                    {activeSection === 'conta' && (
                        <div className="config-section fade-in">
                            <div className="section-header">
                                <h2>Minha Conta</h2>
                                <p>Altere sua senha de acesso</p>
                            </div>

                            <div className="form-grid single-column">
                                <div className="form-group">
                                    <label>Senha Atual</label>
                                    <input
                                        type="password"
                                        name="senhaAtual"
                                        className="form-input"
                                        value={contaData.senhaAtual}
                                        onChange={handleContaChange}
                                        placeholder="Digite sua senha atual"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nova Senha</label>
                                    <input
                                        type="password"
                                        name="novaSenha"
                                        className="form-input"
                                        value={contaData.novaSenha}
                                        onChange={handleContaChange}
                                        placeholder="Digite a nova senha"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        name="confirmarSenha"
                                        className="form-input"
                                        value={contaData.confirmarSenha}
                                        onChange={handleContaChange}
                                        placeholder="Confirme a nova senha"
                                    />
                                </div>
                            </div>

                            <div className="form-footer">
                                <button className="btn-solid-green" onClick={handleSaveConta}>
                                    <Save size={18} />
                                    Alterar Senha
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Seção: Notificações */}
                    {activeSection === 'notificacoes' && (
                        <div className="config-section fade-in">
                            <div className="section-header">
                                <h2>Notificações</h2>
                                <p>Gerencie suas preferências de notificação</p>
                            </div>

                            <div className="toggle-list">
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>E-mail para novos atendimentos</h4>
                                        <p>Receba um e-mail quando um novo atendimento for registrado</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            name="emailAtendimento"
                                            checked={notificacoes.emailAtendimento}
                                            onChange={handleNotificacoesChange}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>E-mail para novos cadastros</h4>
                                        <p>Receba um e-mail quando um novo agricultor for cadastrado</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            name="emailCadastro"
                                            checked={notificacoes.emailCadastro}
                                            onChange={handleNotificacoesChange}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Lembrete de vencimentos</h4>
                                        <p>Receba alertas sobre matrículas próximas do vencimento</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            name="emailVencimento"
                                            checked={notificacoes.emailVencimento}
                                            onChange={handleNotificacoesChange}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Alertas do sistema</h4>
                                        <p>Exibir notificações dentro do sistema</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            name="sistemaAlerta"
                                            checked={notificacoes.sistemaAlerta}
                                            onChange={handleNotificacoesChange}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-footer">
                                <button className="btn-solid-green" onClick={handleSaveNotificacoes}>
                                    <Save size={18} />
                                    Salvar Preferências
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Seção: Setores */}
                    {activeSection === 'setores' && (
                        <div className="config-section fade-in">
                            <div className="section-header">
                                <h2>Setores de Atendimento</h2>
                                <p>Gerencie os setores disponíveis para atendimentos</p>
                            </div>

                            {/* Adicionar Novo Setor */}
                            <div className="add-setor-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nome do Setor</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Ex: Tesouraria"
                                            value={novoSetor.nome}
                                            onChange={(e) => setNovoSetor({ ...novoSetor, nome: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group flex-2">
                                        <label>Descrição</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Breve descrição do setor"
                                            value={novoSetor.descricao}
                                            onChange={(e) => setNovoSetor({ ...novoSetor, descricao: e.target.value })}
                                        />
                                    </div>
                                    <button className="btn-add" onClick={handleAddSetor}>
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Lista de Setores */}
                            <div className="setores-list">
                                {setores.map((setor) => (
                                    <div key={setor.id} className={`setor-item ${!setor.ativo ? 'inactive' : ''}`}>
                                        {editingSetor && editingSetor.id === setor.id ? (
                                            // Modo de edição
                                            <>
                                                <div className="setor-edit-form">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={editingSetor.nome}
                                                        onChange={(e) => setEditingSetor({ ...editingSetor, nome: e.target.value })}
                                                        placeholder="Nome do setor"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={editingSetor.descricao}
                                                        onChange={(e) => setEditingSetor({ ...editingSetor, descricao: e.target.value })}
                                                        placeholder="Descrição"
                                                    />
                                                </div>
                                                <div className="setor-actions">
                                                    <button className="btn-icon-save" onClick={handleSaveEdit} title="Salvar">
                                                        <Save size={18} />
                                                    </button>
                                                    <button className="btn-icon-cancel" onClick={handleCancelEdit} title="Cancelar">
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (

                                            <>
                                                <div className="setor-info">
                                                    <h4>{setor.nome}</h4>
                                                    <p>{setor.descricao || 'Sem descrição'}</p>
                                                </div>
                                                <div className="setor-actions">
                                                    <button
                                                        className="btn-icon-edit"
                                                        onClick={() => handleEditSetor(setor)}
                                                        title="Editar setor"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <label className="toggle-switch small">
                                                        <input
                                                            type="checkbox"
                                                            checked={setor.ativo}
                                                            onChange={() => handleToggleSetor(setor.id)}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                    <button
                                                        className="btn-icon-delete"
                                                        onClick={() => handleDeleteSetor(setor.id)}
                                                        title="Excluir setor"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seção: Serviços/Demandas */}
                    {activeSection === 'servicos' && (
                        <div className="config-section fade-in">
                            <div className="section-header">
                                <h2>Serviços e Demandas</h2>
                                <p>Gerencie os tipos de serviços e demandas atendidas</p>
                            </div>

                            <ModalConfirmacao
                                isOpen={showServicoDeleteModal}
                                onCancel={() => setShowServicoDeleteModal(false)}
                                onConfirm={confirmDeleteServico}
                                title="Confirmar Exclusão"
                                message="Tem certeza que deseja excluir este tipo de serviço?"
                                confirmText="Excluir"
                                tipo="delete"
                            />

                            {/* Modal de Edição de Serviço */}
                            {showServicoEditModal && editingServico && (
                                <div className="modal-overlay">
                                    <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'left' }}>
                                        <div className="modal-header">
                                            <h3>Editar Tipo de Serviço</h3>
                                            <button className="modal-close" onClick={handleCancelEditServico}>
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <div className="modal-body" style={{ padding: '0', marginBottom: '20px' }}>
                                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                                <label>Nome do Serviço <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={editingServico.nome}
                                                    onChange={(e) => setEditingServico({ ...editingServico, nome: e.target.value })}
                                                    placeholder="Nome do serviço"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Descrição</label>
                                                <textarea
                                                    className="form-input"
                                                    style={{ minHeight: '120px', paddingTop: '12px', resize: 'vertical' }}
                                                    value={editingServico.descricao}
                                                    onChange={(e) => setEditingServico({ ...editingServico, descricao: e.target.value })}
                                                    placeholder="Descrição do serviço"
                                                ></textarea>
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#888', marginTop: '15px', fontStyle: 'italic' }}>
                                                Nota: O setor responsável não pode ser alterado após a criação.
                                            </p>
                                        </div>
                                        <div className="modal-footer" style={{ borderTop: '1px solid #eee', paddingTop: '15px', justifyContent: 'flex-end' }}>
                                            <button className="btn-modal-cancel" onClick={handleCancelEditServico}>
                                                Cancelar
                                            </button>
                                            <button className="btn-solid-green" onClick={handleSaveEditServico} style={{ margin: '0' }}>
                                                <Save size={18} />
                                                Salvar Alterações
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Adicionar Novo Serviço */}
                            <div className="add-setor-form">
                                <h4 className="form-subtitle">Novo Tipo de Serviço</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nome do Serviço <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Ex: Declaração de Aptidão"
                                            value={novoServico.name}
                                            onChange={(e) => setNovoServico({ ...novoServico, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Setor Responsável</label>
                                        <select
                                            className="form-select"
                                            value={novoServico.sectorId}
                                            onChange={(e) => setNovoServico({ ...novoServico, sectorId: e.target.value })}
                                        >
                                            <option value="">Selecione um setor</option>
                                            {setores.map(setor => (
                                                <option key={setor.id} value={setor.id}>{setor.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Descrição</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Breve descrição do serviço"
                                            value={novoServico.description}
                                            onChange={(e) => setNovoServico({ ...novoServico, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-footer">
                                    <button className="btn-solid-green" onClick={handleAddServico}>
                                        <Plus size={18} />
                                        Cadastrar Serviço
                                    </button>
                                </div>
                            </div>

                            {/* Lista de Serviços */}
                            <h4 className="form-subtitle" style={{ marginTop: '24px' }}>Serviços Cadastrados</h4>
                            <div className="setores-list">
                                {servicos.length === 0 ? (
                                    <p className="empty-message">Nenhum serviço cadastrado.</p>
                                ) : (
                                    servicos.map((servico) => (
                                        <div key={servico.id} className="setor-item">
                                            <div className="setor-info">
                                                <h4>{servico.nome}</h4>
                                                <p>{servico.description || 'Sem descrição'}</p>
                                                <small style={{ color: '#666' }}>
                                                    Setor: {setores.find(s => s.id === servico.sectorId)?.nome || 'Não definido'}
                                                </small>
                                            </div>
                                            <div className="setor-actions">
                                                <button
                                                    className="btn-icon-edit"
                                                    onClick={() => handleEditServico(servico)}
                                                    title="Editar serviço"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="btn-icon-delete"
                                                    onClick={() => handleDeleteServico(servico.id)}
                                                    title="Excluir serviço"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Configuracao;