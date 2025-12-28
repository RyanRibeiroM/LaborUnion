import React, { useState, useEffect } from 'react';
import {
    Building2,
    User,
    Bell,
    Shield,
    Database,
    Save,
    Plus,
    Trash2,
    Edit,
    X
} from 'lucide-react';
import '../assets/css/Configuracao.css';
import Toast from '../components/Toast';
import ModalConfirmacao from '../components/ModalConfirmacao';

const Configuracao = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('sindicato');
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingSetor, setEditingSetor] = useState(null);

    // Estados dos formulários
    const [sindicatoData, setSindicatoData] = useState({
        nome: 'Sindicato dos Trabalhadores Rurais',
        cnpj: '00.000.000/0001-00',
        endereco: 'Rua Principal, 123',
        cidade: 'Crateús',
        estado: 'CE',
        telefone: '(88) 3691-0000',
        email: 'contato@sindicato.org.br'
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

    const [setores, setSetores] = useState([
        { id: 1, nome: 'Presidência', descricao: 'Atendimentos gerais e emissão de documentos', ativo: true },
        { id: 2, nome: 'Jurídico', descricao: 'Consultas e assessoria jurídica', ativo: true },
        { id: 3, nome: 'Financeiro', descricao: 'Boletos, contribuições e benefícios', ativo: true },
        { id: 4, nome: 'Secretaria', descricao: 'Atualizações cadastrais e arquivo', ativo: true }
    ]);

    const [novoSetor, setNovoSetor] = useState({ nome: '', descricao: '' });

    // Seções do menu
    const menuSections = [
        { id: 'sindicato', label: 'Dados do Sindicato', icon: <Building2 size={20} /> },
        { id: 'conta', label: 'Minha Conta', icon: <User size={20} /> },
        { id: 'notificacoes', label: 'Notificações', icon: <Bell size={20} /> },
        { id: 'setores', label: 'Setores', icon: <Shield size={20} /> },
        { id: 'backup', label: 'Backup', icon: <Database size={20} /> }
    ];

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

    const handleAddSetor = () => {
        if (!novoSetor.nome.trim()) {
            showToast('Informe o nome do setor.', 'warning');
            return;
        }
        const newId = Math.max(...setores.map(s => s.id), 0) + 1;
        setSetores([...setores, { ...novoSetor, id: newId, ativo: true }]);
        setNovoSetor({ nome: '', descricao: '' });
        showToast('Setor adicionado com sucesso!', 'success');
    };

    const handleDeleteSetor = (id) => {
        setItemToDelete(id);
        setShowModal(true);
    };

    const confirmDeleteSetor = () => {
        setSetores(setores.filter(s => s.id !== itemToDelete));
        setShowModal(false);
        setItemToDelete(null);
        showToast('Setor removido com sucesso!', 'success');
    };

    const handleToggleSetor = (id) => {
        setSetores(setores.map(s =>
            s.id === id ? { ...s, ativo: !s.ativo } : s
        ));
        showToast('Status do setor atualizado!', 'info');
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
                                    <input
                                        type="text"
                                        name="nome"
                                        className="form-input"
                                        value={sindicatoData.nome}
                                        onChange={handleSindicatoChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CNPJ</label>
                                    <input
                                        type="text"
                                        name="cnpj"
                                        className="form-input"
                                        value={sindicatoData.cnpj}
                                        onChange={handleSindicatoChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Telefone</label>
                                    <input
                                        type="text"
                                        name="telefone"
                                        className="form-input"
                                        value={sindicatoData.telefone}
                                        onChange={handleSindicatoChange}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Endereço</label>
                                    <input
                                        type="text"
                                        name="endereco"
                                        className="form-input"
                                        value={sindicatoData.endereco}
                                        onChange={handleSindicatoChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cidade</label>
                                    <input
                                        type="text"
                                        name="cidade"
                                        className="form-input"
                                        value={sindicatoData.cidade}
                                        onChange={handleSindicatoChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estado</label>
                                    <input
                                        type="text"
                                        name="estado"
                                        className="form-input"
                                        value={sindicatoData.estado}
                                        onChange={handleSindicatoChange}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>E-mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={sindicatoData.email}
                                        onChange={handleSindicatoChange}
                                    />
                                </div>
                            </div>

                            <div className="form-footer">
                                <button className="btn-solid-green" onClick={handleSaveSindicato}>
                                    <Save size={18} />
                                    Salvar Alterações
                                </button>
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
                                        <div className="setor-info">
                                            <h4>{setor.nome}</h4>
                                            <p>{setor.descricao}</p>
                                        </div>
                                        <div className="setor-actions">
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seção: Backup */}
                    {activeSection === 'backup' && (
                        <div className="config-section fade-in">
                            <div className="section-header">
                                <h2>Backup e Exportação</h2>
                                <p>Exporte os dados do sistema para backup</p>
                            </div>

                            <div className="backup-options">
                                <div className="backup-card">
                                    <div className="backup-icon">
                                        <Database size={32} />
                                    </div>
                                    <div className="backup-info">
                                        <h4>Exportar Configurações</h4>
                                        <p>Baixe um arquivo JSON com todas as configurações do sistema, incluindo dados do sindicato e setores.</p>
                                    </div>
                                    <button className="btn-solid-green" onClick={handleExportBackup}>
                                        Exportar Backup
                                    </button>
                                </div>

                                <div className="backup-info-box">
                                    <h4>💡 Dica de Segurança</h4>
                                    <p>Recomendamos fazer backup das configurações regularmente. Guarde os arquivos em local seguro, como um HD externo ou serviço de nuvem.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Configuracao;