import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Eye, Loader2, ArrowLeft } from 'lucide-react';
import '../assets/css/Agricultores.css';
import ModalConfirmacao from '../components/ModalConfirmacao';
import Toast from '../components/Toast';
import MobileCard from '../components/MobileCard';
import FarmerForm from '../components/FarmerForm';
import { filterFarmers, createFarmer, updateFarmer, deleteFarmer, getFarmerById, formToApiData, apiToFormData } from '../services/farmerService';

const Agricultores = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('lista');
    const [busca, setBusca] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Detectar mudança de tamanho da tela
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        estadoCivil: '',
        profissao: '',
        matricula: '',
        telefone: '',
        email: '',
        dataCadastro: new Date().toISOString().split('T')[0],
        cep: '',
        numero: '',
        pontoReferencia: '',
        bairro: '',
        cidade: '',
        estado: '',
        isAlive: true
    });

    const [conjuge, setConjuge] = useState({
        nome: '',
        cpf: ''
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

    const [dadosAgricultores, setDadosAgricultores] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [viewingAgricultor, setViewingAgricultor] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            setIsDeleting(true);
            try {
                await deleteFarmer(itemToDelete);
                setDadosAgricultores(dadosAgricultores.filter(agricultor => agricultor.id !== itemToDelete));
                setShowDeleteModal(false);
                setItemToDelete(null);
                showToast('Agricultor excluído com sucesso!', 'success');

                // Ajustar página se o último item da página for deletado
                if (currentItems.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } catch (error) {
                showToast('Erro ao excluir agricultor: ' + error.message, 'error');
                setShowDeleteModal(false);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleView = async (agricultor) => {
        try {
            const fullData = await getFarmerById(agricultor.id);
            const formattedData = apiToFormData(fullData);
            setViewingAgricultor(formattedData);
            setActiveTab('visualizar');
        } catch (error) {
            showToast('Erro ao carregar dados: ' + error.message, 'error');
        }
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

    const handleEdit = async (agricultor) => {
        try {
            const fullData = await getFarmerById(agricultor.id);
            const formattedData = apiToFormData(fullData);

            setFormData({
                nome: formattedData.nome,
                cpf: formattedData.cpf,
                rg: formattedData.rg || '',
                dataNascimento: formattedData.dataNascimento || '',
                cidadeNascimento: formattedData.cidadeNascimento || '',
                ufNascimento: formattedData.ufNascimento || '',
                estadoCivil: formattedData.estadoCivil || '',
                profissao: formattedData.profissao || '',
                matricula: formattedData.matricula || '',
                telefone: formattedData.telefone || '',
                email: formattedData.email || '',
                dataCadastro: formattedData.dataCadastro || new Date().toISOString().split('T')[0],
                cep: formattedData.cep || '',
                rua: formattedData.rua || '',
                numero: formattedData.numero || '',
                complemento: formattedData.complemento || '',
                pontoReferencia: formattedData.pontoReferencia || '',
                bairro: formattedData.bairro || '',
                cidade: formattedData.cidade || '',
                estado: formattedData.estado || ''
            });

            if (formattedData.conjuge) {
                setConjuge(formattedData.conjuge);
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
            setViewingAgricultor(formattedData);
            setActiveTab('cadastro');
        } catch (error) {
            showToast('Erro ao carregar dados para edição: ' + error.message, 'error');
        }
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

    const handleSave = async () => {
        // Validação de campos obrigatórios conforme API
        const camposObrigatorios = [
            { campo: formData.nome, nome: 'Nome Completo' },
            { campo: formData.cpf, nome: 'CPF' },
            { campo: formData.matricula, nome: 'Matrícula' },
            { campo: formData.profissao, nome: 'Profissão' },
            { campo: formData.estadoCivil, nome: 'Estado Civil' },
            { campo: formData.dataNascimento, nome: 'Data de Nascimento' },
            { campo: formData.telefone, nome: 'Telefone' },
            { campo: formData.cep, nome: 'CEP' },
            { campo: formData.numero, nome: 'Número do Endereço' },
            { campo: formData.bairro, nome: 'Bairro' },
            { campo: formData.cidade, nome: 'Cidade' },
            { campo: formData.estado, nome: 'Estado (UF)' }
        ];

        const camposFaltando = camposObrigatorios
            .filter(item => !item.campo || item.campo.trim() === '')
            .map(item => item.nome);

        if (camposFaltando.length > 0) {
            showToast(`Por favor, preencha os campos obrigatórios: ${camposFaltando.join(', ')}`, 'error');
            return;
        }

        // Validação adicional de CPF
        if (cpfError === 'invalido') {
            showToast('O CPF informado é inválido.', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const apiData = formToApiData(formData, formData.estadoCivil === 'Casado(a)' ? conjuge : null);

            if (editingId) {
                await updateFarmer(editingId, apiData);
                showToast('Agricultor atualizado com sucesso!', 'success');
            } else {
                await createFarmer(apiData);
                showToast('Agricultor cadastrado com sucesso!', 'success');
            }

            // Recarregar lista
            await loadFarmers();
            limparFormulario();
            setActiveTab('lista');
        } catch (error) {
            showToast('Erro ao salvar agricultor: ' + error.message, 'error');
        } finally {
            setIsSaving(false);
        }
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
            dataNascimento: '',
            estadoCivil: '',
            profissao: '',
            matricula: '',
            telefone: '',
            email: '',
            dataCadastro: new Date().toISOString().split('T')[0],
            cep: '',
            numero: '',
            pontoReferencia: '',
            bairro: '',
            cidade: '',
            estado: '',
            isAlive: true
        });
        setConjuge({
            nome: '',
            cpf: ''
        });
        setCpfError(null);
        setCpfConjugeError(null);
        setCepError(null);
        setEditingId(null);
    };

    // Função para limpar CPF (remover máscara)
    const limparCpfBusca = (cpf) => cpf.replace(/\D/g, '');

    const agricultoresFiltrados = dadosAgricultores.filter((agricultor) => {
        const buscaLimpa = limparCpfBusca(busca);
        const cpfLimpo = limparCpfBusca(agricultor.cpf);

        // Busca por nome OU por CPF (com ou sem máscara)
        return agricultor.nome.toLowerCase().includes(busca.toLowerCase()) ||
            cpfLimpo.includes(buscaLimpa) ||
            agricultor.cpf.includes(busca);
    });

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

    // Função para carregar agricultores
    const loadFarmers = async () => {
        try {
            const response = await filterFarmers({});
            if (response && response.farmers) {
                const formattedFarmers = response.farmers.map(farmer => ({
                    id: farmer.id,
                    nome: farmer.name || '',
                    cpf: farmer.cpf ? farmer.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '',
                    cidade: farmer.addressCity || '',
                    matricula: farmer.registration || '',
                    status: 'Regular'
                }));
                setDadosAgricultores(formattedFarmers);
            }
        } catch (error) {
            showToast('Erro ao carregar agricultores: ' + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFarmers();
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
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
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
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        const apenasNumeros = valor.replace(/\D/g, '');
                                        if (apenasNumeros.length > 0 && /^[\d.\-]+$/.test(valor)) {
                                            const cpfMascarado = apenasNumeros
                                                .replace(/(\d{3})(\d)/, '$1.$2')
                                                .replace(/(\d{3})(\d)/, '$1.$2')
                                                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                                                .replace(/(-\d{2})\d+?$/, '$1');
                                            setBusca(cpfMascarado);
                                        } else {
                                            setBusca(valor);
                                        }
                                    }}
                                    maxLength={14}
                                />
                            </div>

                            {/* Renderização condicional: Cards no mobile, Tabela no desktop */}
                            {isMobile ? (
                                currentItems.length === 0 ? (
                                    <div className="empty-state">
                                        <p className="empty-state-text">Nenhum agricultor encontrado.</p>
                                        <button
                                            className="btn-solid-green"
                                            onClick={() => {
                                                limparFormulario();
                                                setActiveTab('cadastro');
                                            }}
                                        >
                                            Realizar Cadastro
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mobile-cards-container">
                                        {currentItems.map((item) => (
                                            <MobileCard
                                                key={item.id}
                                                fields={[
                                                    { label: 'ID', value: item.id },
                                                    { label: 'Nome', value: item.nome, highlight: true },
                                                    { label: 'CPF', value: item.cpf },
                                                    { label: 'Matricula', value: item.matricula },
                                                    { label: 'Status', value: <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span> }
                                                ]}
                                                actions={
                                                    <>
                                                        <button
                                                            className="icon-action"
                                                            onClick={() => handleView(item)}
                                                            title="Visualizar"
                                                        >
                                                            <Eye size={20} />
                                                        </button>
                                                        <button
                                                            className="icon-action danger"
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </>
                                                }
                                            />
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="table-responsive">
                                    <table className="farmers-table">
                                        <thead>
                                            <tr>
                                                <th>id</th>
                                                <th>Nome Completo</th>
                                                <th>CPF</th>
                                                <th>Matrícula</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6">
                                                        <div className="empty-state">
                                                            <p className="empty-state-text">Nenhum agricultor encontrado.</p>
                                                            <button
                                                                className="btn-solid-green"
                                                                onClick={() => {
                                                                    limparFormulario();
                                                                    setActiveTab('cadastro');
                                                                }}
                                                            >
                                                                Realizar Cadastro
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentItems.map((item) => (
                                                    <tr key={item.id}>
                                                        <td><strong>{item.id}</strong></td>
                                                        <td><strong>{item.nome}</strong></td>
                                                        <td>{item.cpf}</td>
                                                        <td>{item.matricula}</td>
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
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

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
                        <FarmerForm
                            formData={formData}
                            setFormData={setFormData}
                            conjuge={conjuge}
                            setConjuge={setConjuge}
                            editingId={editingId}
                            cpfError={cpfError}
                            cpfConjugeError={cpfConjugeError}
                            cepError={cepError}
                            loadingCep={loadingCep}
                            estadosBrasileiros={estadosBrasileiros}
                            isSaving={isSaving}
                            onSave={handleSave}
                            onCancel={editingId ? handleCancelEdit : limparFormulario}
                            onFieldChange={handleChange}
                            onConjugeChange={handleConjugeChange}
                        />
                    )}


                    {activeTab === 'visualizar' && viewingAgricultor && (
                        <div className="form-container fade-in">
                            <div className="view-header">
                                <h2 className="form-title" style={{ margin: 0 }}>Ficha do Agricultor</h2>
                                <div className="view-header-buttons">
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
                                        <label>Matrícula</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.matricula || '-'}
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
                                        <label>Profissão</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.profissao || '-'}
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
                                        <label>Situação</label>
                                        <div style={{ marginTop: '8px' }}>
                                            <span className={`status-badge ${viewingAgricultor.isAlive ? 'regular' : 'bloqueado'}`}>
                                                {viewingAgricultor.isAlive ? 'Vivo' : 'Falecido'}
                                            </span>
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
                                        <div className="form-group half-width">
                                            <label>Nome Completo do Cônjuge</label>
                                            <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                                {viewingAgricultor.conjuge.nome || '-'}
                                            </div>
                                        </div>
                                        <div className="form-group half-width">
                                            <label>CPF do Cônjuge</label>
                                            <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                                {viewingAgricultor.conjuge.cpf || '-'}
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
                                    <div className="form-group">
                                        <label>Número</label>
                                        <div className="form-input" style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}>
                                            {viewingAgricultor.numero || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
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
                    )
                    }

                </div >

                {/* Modal de Exclusão */}
                < ModalConfirmacao
                    isOpen={showDeleteModal}
                    onCancel={cancelDelete}
                    onConfirm={confirmDelete}
                    title="Confirmar Exclusão"
                    message="Tem certeza que deseja excluir este agricultor? Esta ação não pode ser desfeita."
                    confirmText="Excluir"
                    tipo="delete"
                />
            </div >
        </>
    );
};

export default Agricultores;
