import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Eye, Save, Eraser, Loader2, X, ArrowLeft, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import '../assets/css/Agricultores.css';

const Agricultores = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('lista');
    const [busca, setBusca] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        rg: '',
        dataNascimento: '',
        cidadeNascimento: '',
        ufNascimento: '',
        estadoCivil: '',
        profissao: '',
        matricula: '',
        telefone: '',
        email: '',
        dataCadastro: new Date().toISOString().split('T')[0],
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        pontoReferencia: '',
        bairro: '',
        cidade: '',
        estado: ''
    });

    const [conjuge, setConjuge] = useState({
        nome: '',
        cpf: '',
        rg: '',
        cidadeNascimento: '',
        ufNascimento: '',
        profissao: ''
    });

    const estadosBrasileiros = [
        { sigla: 'AC', nome: 'Acre' },
        { sigla: 'AL', nome: 'Alagoas' },
        { sigla: 'AP', nome: 'Amapá' },
        { sigla: 'AM', nome: 'Amazonas' },
        { sigla: 'BA', nome: 'Bahia' },
        { sigla: 'CE', nome: 'Ceará' },
        { sigla: 'DF', nome: 'Distrito Federal' },
        { sigla: 'ES', nome: 'Espírito Santo' },
        { sigla: 'GO', nome: 'Goiás' },
        { sigla: 'MA', nome: 'Maranhão' },
        { sigla: 'MT', nome: 'Mato Grosso' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { sigla: 'MG', nome: 'Minas Gerais' },
        { sigla: 'PA', nome: 'Pará' },
        { sigla: 'PB', nome: 'Paraíba' },
        { sigla: 'PR', nome: 'Paraná' },
        { sigla: 'PE', nome: 'Pernambuco' },
        { sigla: 'PI', nome: 'Piauí' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'RN', nome: 'Rio Grande do Norte' },
        { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'RO', nome: 'Rondônia' },
        { sigla: 'RR', nome: 'Roraima' },
        { sigla: 'SC', nome: 'Santa Catarina' },
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'SE', nome: 'Sergipe' },
        { sigla: 'TO', nome: 'Tocantins' }
    ];

    const [cpfError, setCpfError] = useState(null);
    const [cpfConjugeError, setCpfConjugeError] = useState(null);
    const [cepError, setCepError] = useState(null);
    const [loadingCep, setLoadingCep] = useState(false);

    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [dadosAgricultores, setDadosAgricultores] = useState([
        { id: 1, nome: 'Francisco Antônio da Silva', cpf: '123.456.789-00', cidade: 'Crateús', status: 'Regular' },
        { id: 2, nome: 'Maria Fernanda', cpf: '987.654.321-11', cidade: 'Novo Oriente', status: 'Pendente' },
        { id: 3, nome: 'Caio Tiberius Mourão', cpf: '456.123.789-22', cidade: 'Crateús', status: 'Regular' },
        { id: 4, nome: 'Vicente Neto', cpf: '456.123.789-22', cidade: 'Crateús', status: 'Regular' },
        { id: 5, nome: 'Ana Paula Souza', cpf: '111.222.333-44', cidade: 'Independência', status: 'Regular' },
        { id: 6, nome: 'João Pedro Alves', cpf: '555.666.777-88', cidade: 'Crateús', status: 'Bloqueado' },
        { id: 7, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
        { id: 8, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
        { id: 9, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
        { id: 10, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
        { id: 11, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
        { id: 12, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
        { id: 13, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
        { id: 14, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
        { id: 15, nome: 'Mariana Costa', cpf: '999.888.777-66', cidade: 'Novo Oriente', status: 'Regular' },
    ]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [viewingAgricultor, setViewingAgricultor] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'info' });
        }, 3500);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setDadosAgricultores(dadosAgricultores.filter(agricultor => agricultor.id !== itemToDelete));
            setShowDeleteModal(false);
            setItemToDelete(null);
            showToast('Agricultor excluído com sucesso!', 'success');

            // Ajustar página se o último item da página for deletado
            if (currentItems.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleView = (agricultor) => {
        setViewingAgricultor(agricultor);
        setActiveTab('visualizar');
    };

    const closeView = () => {
        setViewingAgricultor(null);
        setActiveTab('lista');
    };

    const formatDateToBR = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    };

    const handleEdit = (agricultor) => {
        setFormData({
            nome: agricultor.nome,
            cpf: agricultor.cpf,
            rg: agricultor.rg || '',
            dataNascimento: agricultor.dataNascimento || '',
            cidadeNascimento: agricultor.cidadeNascimento || '',
            ufNascimento: agricultor.ufNascimento || '',
            estadoCivil: agricultor.estadoCivil || '',
            profissao: agricultor.profissao || '',
            matricula: agricultor.matricula || '',
            telefone: agricultor.telefone || '',
            email: agricultor.email || '',
            dataCadastro: agricultor.dataCadastro || new Date().toISOString().split('T')[0],
            cep: agricultor.cep || '',
            rua: agricultor.rua || '',
            numero: agricultor.numero || '',
            complemento: agricultor.complemento || '',
            pontoReferencia: agricultor.pontoReferencia || '',
            bairro: agricultor.bairro || '',
            cidade: agricultor.cidade || '',
            estado: agricultor.estado || ''
        });

        if (agricultor.conjuge) {
            setConjuge(agricultor.conjuge);
        } else {
            setConjuge({
                nome: '',
                cpf: '',
                rg: '',
                cidadeNascimento: '',
                ufNascimento: '',
                profissao: ''
            });
        }

        setEditingId(agricultor.id);
        setViewingAgricultor(agricultor);
        setActiveTab('cadastro');
    };
    // Função para cancelar edição e voltar para a ficha
    const handleCancelEdit = () => {
        if (editingId && viewingAgricultor) {
            limparFormulario();
            setActiveTab('visualizar');
        } else {
            limparFormulario();
        }
    };

    const handleSave = () => {
        if (!formData.nome || !formData.cpf) {
            showToast('Por favor, preencha pelo menos Nome e CPF.', 'error');
            return;
        }

        const dadosCompletos = {
            ...formData,
            conjuge: formData.estadoCivil === 'Casado(a)' ? conjuge : null
        };

        if (editingId) {
            setDadosAgricultores(dadosAgricultores.map(item =>
                item.id === editingId ? { ...item, ...dadosCompletos, id: editingId, status: item.status } : item
            ));
            showToast('Agricultor atualizado com sucesso!', 'success');
        } else {
            const novoId = Math.max(...dadosAgricultores.map(a => a.id), 0) + 1;
            setDadosAgricultores([...dadosAgricultores, {
                id: novoId,
                ...dadosCompletos,
                status: 'Regular'
            }]);
            showToast('Agricultor cadastrado com sucesso!', 'success');
        }

        limparFormulario();
        setActiveTab('lista');
    };

    const mascaraCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const mascaraCEP = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    };

    const mascaraTelefone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d)(\d{4})$/, '$1-$2');
    };

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        let resto;
        for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    };

    const buscarCEP = async (cep) => {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            setCepError(null);
            return;
        }

        setLoadingCep(true);
        setCepError(null);

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();

            if (data.erro) {
                setCepError('CEP não encontrado');
                setFormData(prev => ({
                    ...prev,
                    rua: '',
                    bairro: '',
                    cidade: '',
                    estado: ''
                }));
            } else {
                setCepError('valido');
                setFormData(prev => ({
                    ...prev,
                    rua: data.logradouro || '',
                    bairro: data.bairro || '',
                    cidade: data.localidade || '',
                    estado: data.uf || ''
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setCepError('Erro ao buscar CEP');
        } finally {
            setLoadingCep(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let novoValor = value;

        if (name === 'cpf') novoValor = mascaraCPF(value);
        if (name === 'telefone') novoValor = mascaraTelefone(value);
        if (name === 'cep') {
            novoValor = mascaraCEP(value);
            if (novoValor.length === 9) {
                buscarCEP(novoValor);
            } else {
                setCepError(null);
            }
        }

        if (name === 'cpf') {
            if (novoValor.length === 14) {
                const ehValido = validarCPF(novoValor);
                setCpfError(ehValido ? 'valido' : 'invalido');
            } else {
                setCpfError(null);
            }
        }

        setFormData({ ...formData, [name]: novoValor });
    };

    const handleConjugeChange = (e) => {
        const { name, value } = e.target;
        let novoValor = value;

        if (name === 'cpf') {
            novoValor = mascaraCPF(value);
            if (novoValor.length === 14) {
                const ehValido = validarCPF(novoValor);
                setCpfConjugeError(ehValido ? 'valido' : 'invalido');
            } else {
                setCpfConjugeError(null);
            }
        }

        setConjuge({ ...conjuge, [name]: novoValor });
    };

    const limparFormulario = () => {
        setFormData({
            nome: '',
            cpf: '',
            rg: '',
            dataNascimento: '',
            cidadeNascimento: '',
            ufNascimento: '',
            estadoCivil: '',
            profissao: '',
            matricula: '',
            telefone: '',
            email: '',
            dataCadastro: new Date().toISOString().split('T')[0],
            cep: '',
            rua: '',
            numero: '',
            complemento: '',
            pontoReferencia: '',
            bairro: '',
            cidade: '',
            estado: ''
        });
        setConjuge({
            nome: '',
            cpf: '',
            rg: '',
            cidadeNascimento: '',
            ufNascimento: '',
            profissao: ''
        });
        setCpfError(null);
        setCpfConjugeError(null);
        setCepError(null);
        setEditingId(null);
    };

    const agricultoresFiltrados = dadosAgricultores.filter((agricultor) =>
        agricultor.nome.toLowerCase().includes(busca.toLowerCase()) ||
        agricultor.cpf.includes(busca)
    );

    // LÃ³gica de PaginaÃ§Ã£o
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = agricultoresFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(agricultoresFiltrados.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPaginationButtons = () => {
        const pageNumbers = [];
        const maxVisibleButtons = 7;

        if (totalPages <= maxVisibleButtons) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > 3) pageNumbers.push('...');

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                endPage = 4;
                startPage = 2;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
                endPage = totalPages - 1;
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (currentPage < totalPages - 2) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers.map((number, index) => (
            <button
                key={index}
                onClick={() => typeof number === 'number' ? paginate(number) : null}
                className={`pagination-number ${currentPage === number ? 'active' : ''} ${number === '...' ? 'dots' : ''}`}
                disabled={number === '...'}
            >
                {number}
            </button>
        ));
    };

    useEffect(() => {
        // Resetar para página 1 quando a busca mudar
        setCurrentPage(1);
    }, [busca]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (location.state?.openCadastro) {
            setActiveTab('cadastro');
        }
    }, [location]);

    if (isLoading) {
        return (
            <div className="agricultores-main" role="main" aria-busy="true">
                <div className="loading-container">
                    <div className="spinner" role="status" aria-label="Carregando dados"></div>
                    <p>Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-notification toast-${toast.type}`}>
                    {toast.type === 'success' && <CheckCircle size={20} />}
                    {toast.type === 'error' && <AlertCircle size={20} />}
                    {toast.type === 'warning' && <AlertTriangle size={20} />}
                    <span className="toast-message">{toast.message}</span>
                    <button
                        className="toast-close-btn"
                        onClick={() => setToast({ show: false, message: '', type: 'info' })}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            <div className="agricultores-main">
                <h1 className="page-title">Agricultores</h1>

                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'lista' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lista')}
                    >
                        Lista de Agricultores
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'cadastro' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cadastro')}
                    >
                        {editingId ? 'Editar Agricultor' : 'Cadastrar'}
                    </button>
                </div>

                <div className="main-card">

                    {activeTab === 'lista' && (
                        <>
                            <div className="search-bar-container">
                                <input
                                    type="text"
                                    placeholder="Buscar por Nome ou CPF ..."
                                    className="search-input"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                            </div>

                            <div className="table-responsive">
                                <table className="farmers-table">
                                    <thead>
                                        <tr>
                                            <th>id</th>
                                            <th>Nome Completo</th>
                                            <th>CPF</th>
                                            <th>Cidade</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((item) => (
                                            <tr key={item.id}>
                                                <td><strong>{item.id}</strong></td>
                                                <td><strong>{item.nome}</strong></td>
                                                <td>{item.cpf}</td>
                                                <td>{item.cidade}</td>
                                                <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                                                <td>
                                                    <div className="action-buttons-row">
                                                        <button
                                                            className="icon-btn view"
                                                            onClick={() => handleView(item)}
                                                            title="Visualizar"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            className="icon-btn delete"
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Controles de PaginaÃ§Ã£o */}
                            {totalPages > 1 && (
                                <div className="pagination-container">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </button>

                                    <div className="pagination-numbers">
                                        {renderPaginationButtons()}
                                    </div>

                                    <button
                                        className="pagination-btn"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Próximo
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'cadastro' && (
                        <div className="form-container fade-in">
                            <h2 className="form-title">{editingId ? 'Editar Agricultor' : 'Cadastrar Novo Agricultor'}</h2>

                            <form className="custom-form">
                                {/* Dados Pessoais */}
                                <div className="form-section">
                                    <h3 className="section-title">Dados Pessoais</h3>

                                    <div className="form-group full-width">
                                        <label>Nome Completo</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            className="form-input"
                                            value={formData.nome}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group half-width">
                                            <label>CPF</label>
                                            <input
                                                type="text"
                                                name="cpf"
                                                className={`form-input ${cpfError === 'valido' ? 'input-success' : cpfError === 'invalido' ? 'input-error' : ''}`}
                                                placeholder="000.000.000-00"
                                                value={formData.cpf}
                                                onChange={handleChange}
                                                maxLength={14}
                                            />
                                            {cpfError === 'invalido' && <span className="error-msg">CPF Inválido</span>}
                                            {cpfError === 'valido' && <span className="success-msg">CPF Válido</span>}
                                        </div>
                                        <div className="form-group half-width">
                                            <label>RG</label>
                                            <input
                                                type="text"
                                                name="rg"
                                                className="form-input"
                                                placeholder="0000000-0"
                                                value={formData.rg}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group half-width">
                                            <label>Data de Nascimento</label>
                                            <input
                                                type="date"
                                                name="dataNascimento"
                                                className="form-input"
                                                value={formData.dataNascimento}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group half-width">
                                            <label>Matrícula</label>
                                            <input
                                                type="text"
                                                name="matricula"
                                                className="form-input"
                                                value={formData.matricula}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group half-width">
                                            <label>Cidade de Nascimento</label>
                                            <input
                                                type="text"
                                                name="cidadeNascimento"
                                                className="form-input"
                                                placeholder="Ex: Crateús"
                                                value={formData.cidadeNascimento}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group half-width">
                                            <label>UF de Nascimento</label>
                                            <select
                                                name="ufNascimento"
                                                className="form-input form-select"
                                                value={formData.ufNascimento}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecione...</option>
                                                {estadosBrasileiros.map((est) => (
                                                    <option key={est.sigla} value={est.sigla}>
                                                        {est.sigla} - {est.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group half-width">
                                            <label>Estado Civil</label>
                                            <select
                                                name="estadoCivil"
                                                className="form-input form-select"
                                                value={formData.estadoCivil}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="Solteiro(a)">Solteiro(a)</option>
                                                <option value="Casado(a)">Casado(a)</option>
                                                <option value="Divorciado(a)">Divorciado(a)</option>
                                                <option value="Viuvo(a)">Viuvo(a)</option>
                                            </select>
                                        </div>
                                        <div className="form-group half-width">
                                            <label>Profissão</label>
                                            <input
                                                type="text"
                                                name="profissao"
                                                className="form-input"
                                                placeholder="Ex: Agricultor Familiar"
                                                value={formData.profissao}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Seção do Cônjuge - Condicional */}
                                {formData.estadoCivil === 'Casado(a)' && (
                                    <div className="form-section">
                                        <h3 className="section-title">Dados do Cônjuge</h3>

                                        <div className="form-group full-width">
                                            <label>Nome Completo do Cônjuge</label>
                                            <input
                                                type="text"
                                                name="nome"
                                                className="form-input"
                                                value={conjuge.nome}
                                                onChange={handleConjugeChange}
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group half-width">
                                                <label>CPF do Cônjuge</label>
                                                <input
                                                    type="text"
                                                    name="cpf"
                                                    className={`form-input ${cpfConjugeError === 'valido' ? 'input-success' : cpfConjugeError === 'invalido' ? 'input-error' : ''}`}
                                                    placeholder="000.000.000-00"
                                                    value={conjuge.cpf}
                                                    onChange={handleConjugeChange}
                                                    maxLength={14}
                                                />
                                                {cpfConjugeError === 'invalido' && <span className="error-msg">CPF InvÃ¡lido</span>}
                                                {cpfConjugeError === 'valido' && <span className="success-msg">CPF VÃ¡lido</span>}
                                            </div>
                                            <div className="form-group half-width">
                                                <label>RG do Cônjuge</label>
                                                <input
                                                    type="text"
                                                    name="rg"
                                                    className="form-input"
                                                    placeholder="0000000-0"
                                                    value={conjuge.rg}
                                                    onChange={handleConjugeChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group half-width">
                                                <label>Cidade de Nascimento do Cônjuge</label>
                                                <input
                                                    type="text"
                                                    name="cidadeNascimento"
                                                    className="form-input"
                                                    placeholder="Ex: Crateús"
                                                    value={conjuge.cidadeNascimento}
                                                    onChange={handleConjugeChange}
                                                />
                                            </div>
                                            <div className="form-group half-width">
                                                <label>UF de Nascimento do Cônjuge</label>
                                                <select
                                                    name="ufNascimento"
                                                    className="form-input form-select"
                                                    value={conjuge.ufNascimento}
                                                    onChange={handleConjugeChange}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {estadosBrasileiros.map((est) => (
                                                        <option key={est.sigla} value={est.sigla}>
                                                            {est.sigla} - {est.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Profissão do Cônjuge</label>
                                            <input
                                                type="text"
                                                name="profissao"
                                                className="form-input"
                                                placeholder="Ex: Agricultora Familiar"
                                                value={conjuge.profissao}
                                                onChange={handleConjugeChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="form-section">
                                    <h3 className="section-title">Dados de Contato</h3>
                                    <div className="form-row">
                                        <div className="form-group half-width">
                                            <label>Telefone</label>
                                            <input
                                                type="text"
                                                name="telefone"
                                                className="form-input"
                                                placeholder="(00) 00000-0000"
                                                value={formData.telefone}
                                                onChange={handleChange}
                                                maxLength={15}
                                            />
                                        </div>
                                        <div className="form-group half-width">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                placeholder="exemplo@email.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group full-width">
                                            <label>Data de Cadastro</label>
                                            <input
                                                type="date"
                                                name="dataCadastro"
                                                className="form-input"
                                                value={formData.dataCadastro}
                                                readOnly
                                                disabled
                                                style={{ backgroundColor: '#f5f5f5' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section no-border">
                                    <h3 className="section-title">Endereço</h3>

                                    {/* Linha 1: CEP | Endereço | Número */}
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>CEP</label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    name="cep"
                                                    className={`form-input ${loadingCep ? 'input-loading' :
                                                        cepError === 'valido' ? 'input-success' :
                                                            cepError ? 'input-error' : ''
                                                        }`}
                                                    placeholder="00000-000"
                                                    value={formData.cep}
                                                    onChange={handleChange}
                                                    maxLength={9}
                                                />
                                                {loadingCep && (
                                                    <Loader2 className="cep-loading-icon" size={18} />
                                                )}
                                            </div>
                                            {cepError && cepError !== 'valido' && <span className="error-msg">{cepError}</span>}
                                            {cepError === 'valido' && <span className="success-msg">CEP encontrado!</span>}
                                        </div>
                                        <div className="form-group half-width">
                                            <label>Endereço</label>
                                            <input
                                                type="text"
                                                name="rua"
                                                className="form-input"
                                                placeholder="Rua, Avenida, etc."
                                                value={formData.rua}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group sixth-width">
                                            <label>Numero</label>
                                            <input
                                                type="text"
                                                name="numero"
                                                className="form-input"
                                                placeholder="Nº"
                                                value={formData.numero}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Linha 2: Complemento | Ponto de Referência */}
                                    <div className="form-row">
                                        <div className="form-group half-width">
                                            <label>Complemento</label>
                                            <input
                                                type="text"
                                                name="complemento"
                                                className="form-input"
                                                placeholder="Apartamento, Bloco, etc."
                                                value={formData.complemento}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group half-width">
                                            <label>Ponto de Referência</label>
                                            <input
                                                type="text"
                                                name="pontoReferencia"
                                                className="form-input"
                                                placeholder="Próximo a..."
                                                value={formData.pontoReferencia}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Linha 3: Bairro | Cidade | Estado */}
                                    <div className="form-row">
                                        <div className="form-group third-width">
                                            <label>Bairro</label>
                                            <input
                                                type="text"
                                                name="bairro"
                                                className="form-input"
                                                value={formData.bairro}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group third-width">
                                            <label>Cidade</label>
                                            <input
                                                type="text"
                                                name="cidade"
                                                className="form-input"
                                                value={formData.cidade}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group third-width">
                                            <label>Estado</label>
                                            <select
                                                name="estado"
                                                className="form-input form-select"
                                                value={formData.estado}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecione...</option>
                                                {estadosBrasileiros.map((est) => (
                                                    <option key={est.sigla} value={est.sigla}>
                                                        {est.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-footer">
                                    <button type="button" className="btn-outline-gray" onClick={editingId ? handleCancelEdit : limparFormulario}>
                                        {editingId ? 'Cancelar' : 'Limpar'}
                                    </button>
                                    <button type="button" className="btn-solid-green" onClick={handleSave}>
                                        {editingId ? 'Atualizar Cadastro' : 'Salvar Cadastro'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'visualizar' && viewingAgricultor && (
                        <div className="form-container fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 className="form-title">Ficha do Agricultor</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        className="btn-solid-green"
                                        onClick={() => handleEdit(viewingAgricultor)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <Edit size={18} /> Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-outline-gray"
                                        onClick={closeView}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <ArrowLeft size={18} /> Voltar para Lista
                                    </button>
                                </div>
                            </div>

                            {/* Dados Pessoais */}
                            <div className="form-section">
                                <h3 className="section-title">Dados Pessoais</h3>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>Nome Completo</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.nome || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>CPF</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.cpf || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group half-width">
                                        <label>RG</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.rg || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Data de Nascimento</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {formatDateToBR(viewingAgricultor.dataNascimento)}
                                        </div>
                                    </div>
                                    <div className="form-group half-width">
                                        <label>Matrícula</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.matricula || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Cidade de Nascimento</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.cidadeNascimento || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group half-width">
                                        <label>UF de Nascimento</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.ufNascimento || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Estado Civil</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.estadoCivil || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group half-width">
                                        <label>Profissão</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.profissao || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Status</label>
                                        <div style={{ marginTop: '8px' }}>
                                            <span className={`status-badge ${viewingAgricultor.status?.toLowerCase()}`}>
                                                {viewingAgricultor.status || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dados do Cônjuge */}
                            {viewingAgricultor.conjuge && (
                                <div className="form-section">
                                    <h3 className="section-title">Dados do Cônjuge</h3>

                                    <div className="form-row">
                                        <div className="form-group full-width">
                                            <label>Nome Completo do Cônjuge</label>
                                            <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                                {viewingAgricultor.conjuge.nome || '-'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group half-width">
                                            <label>CPF do Cônjuge</label>
                                            <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                                {viewingAgricultor.conjuge.cpf || '-'}
                                            </div>
                                        </div>
                                        <div className="form-group half-width">
                                            <label>RG do Cônjuge</label>
                                            <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                                {viewingAgricultor.conjuge.rg || '-'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group half-width">
                                            <label>Cidade de Nascimento do Cônjuge</label>
                                            <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                                {viewingAgricultor.conjuge.cidadeNascimento || '-'}
                                            </div>
                                        </div>
                                        <div className="form-group half-width">
                                            <label>UF de Nascimento do Cônjuge</label>
                                            <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                                {viewingAgricultor.conjuge.ufNascimento || '-'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group full-width">
                                            <label>Profissão do Cônjuge</label>
                                            <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                                {viewingAgricultor.conjuge.profissao || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dados de Contato */}
                            <div className="form-section">
                                <h3 className="section-title">Dados de Contato</h3>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Telefone</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.telefone || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group half-width">
                                        <label>Email</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.email || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>Data de Cadastro</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {formatDateToBR(viewingAgricultor.dataCadastro)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="form-section no-border">
                                <h3 className="section-title">Endereço</h3>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>CEP</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.cep || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group half-width">
                                        <label>Endereço</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.rua || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group sixth-width">
                                        <label>Número</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.numero || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Complemento</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.complemento || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group half-width">
                                        <label>Ponto de Referência</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.pontoReferencia || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group third-width">
                                        <label>Bairro</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.bairro || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group third-width">
                                        <label>Cidade</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.cidade || '-'}
                                        </div>
                                    </div>
                                    <div className="form-group third-width">
                                        <label>Estado</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.estado || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Modal de Exclusão */}
                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Confirmar Exclusão</h3>
                            </div>
                            <div className="modal-body">
                                <p>Tem certeza que deseja excluir este agricultor? Esta ação não pode ser desfeita.</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-modal-cancel" onClick={cancelDelete}>Cancelar</button>
                                <button className="btn-modal-delete" onClick={confirmDelete}>
                                    <Trash2 size={18} /> Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Agricultores;
