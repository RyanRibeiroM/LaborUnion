/**
 * =============================================================================
 * 📋 TODO BACKEND - MELHORIAS NECESSÁRIAS
 * =============================================================================
 * 
 * O endpoint POST /service/filter atualmente retorna apenas:
 * - id, createdOn, farmerName, sectorName, status
 * 
 * SUGESTÃO: Incluir os seguintes campos na resposta para evitar múltiplas
 * chamadas de API no frontend:
 * 
 * {
 *   "services": [
 *     {
 *       "id": 0,
 *       "createdOn": "2026-01-14T05:23:37.090Z",
 *       "farmerName": "string",
 *       "farmerCpf": "string",           // <-- ADICIONAR
 *       "sectorName": "string",
 *       "serviceTypeName": "string",     // <-- ADICIONAR
 *       "attendantName": "string",       // <-- ADICIONAR (nome do usuário que atendeu)
 *       "status": "string"
 *     }
 *   ]
 * }
 * 
 * Isso permitirá exibir todos os dados na listagem e nos detalhes do
 * atendimento sem precisar fazer chamadas extras a /farmer/{id}, 
 * /servicetype/{id} e /user/{id}.
 * 
 * =============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { Eye, FileText, ArrowLeft, Printer, Plus } from 'lucide-react';
=======
import { Eye, FileText, ArrowLeft, Printer, Plus, X } from 'lucide-react';
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
import '../assets/css/Atendimentos.css';
import '../assets/css/Modal.css';
import Toast from '../components/Toast';
<<<<<<< HEAD
import Modal from '../components/Modal';
import FarmerAutocomplete from '../components/FarmerAutocomplete';
import { filterSectors, createSector } from '../services/sectorService';
import { filterServiceTypes, createServiceType } from '../services/serviceTypeService';
=======
import { filterServices, createService, getServiceById, filterServiceTypes, createServiceType } from '../services/serviceService';
import { filterSectors, createSector } from '../services/sectorService';
import { filterFarmers } from '../services/farmerService';
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc

const Atendimentos = () => {
    const [activeTab, setActiveTab] = useState('registrar');
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [viewingAtendimento, setViewingAtendimento] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const printRef = useRef(null);

    // Dados carregados da API
    const [historicoData, setHistoricoData] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [farmerSearch, setFarmerSearch] = useState('');
    const [showFarmerDropdown, setShowFarmerDropdown] = useState(false);

    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // States do formulário
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [formData, setFormData] = useState({
<<<<<<< HEAD
        setor: '',
        demanda: '',
        observacoes: ''
    });

    // Dados dinâmicos da API
    const [setores, setSetores] = useState([]);
    const [tiposServico, setTiposServico] = useState([]);

    // Estados dos modais
    const [showModalSetor, setShowModalSetor] = useState(false);
    const [showModalDemanda, setShowModalDemanda] = useState(false);
    const [novoSetor, setNovoSetor] = useState({ name: '', description: '' });
    const [novaDemanda, setNovaDemanda] = useState({ name: '', description: '', sectorId: '' });
    const [savingModal, setSavingModal] = useState(false);

    // Dados simulados para o histórico
    const historicoData = [
        {
            id: 1,
            data: '04/12/2025',
            hora: '14:30',
            agricultor: 'Francisco Antônio da Silva',
            cpfAgricultor: '123.456.789-00',
            servico: 'Emissão de DAP',
            setor: 'Presidência',
            status: 'Concluído',
            atendente: 'João Paulo',
            observacoes: 'Atendimento realizado com sucesso. Documento emitido e entregue ao agricultor.'
        },
        {
            id: 2,
            data: '03/12/2025',
            hora: '10:15',
            agricultor: 'Maria Fernanda Costa',
            cpfAgricultor: '987.654.321-11',
            servico: 'Consulta Jurídica',
            setor: 'Jurídico',
            status: 'Em Andamento',
            atendente: 'Ana Clara',
            observacoes: 'Agricultor solicitou orientação sobre questões trabalhistas. Caso em análise.'
        },
        {
            id: 3,
            data: '01/12/2025',
            hora: '09:00',
            agricultor: 'Caio Tiberius Mourão',
            cpfAgricultor: '456.123.789-22',
            servico: 'Solicitação de Benefício',
            setor: 'Financeiro',
            status: 'Pendente',
            atendente: 'Pedro Henrique',
            observacoes: 'Aguardando documentação complementar do agricultor para dar prosseguimento.'
        },
        {
            id: 4,
            data: '28/11/2025',
            hora: '16:45',
            agricultor: 'Ana Clara Sousa',
            cpfAgricultor: '111.222.333-44',
            servico: 'Atualização Cadastral',
            setor: 'Secretaria',
            status: 'Concluído',
            atendente: 'Maria Lucia',
            observacoes: 'Dados cadastrais atualizados no sistema conforme solicitação.'
        },
        {
            id: 5,
            data: '25/11/2025',
            hora: '11:30',
            agricultor: 'José Pedro Alves',
            cpfAgricultor: '555.666.777-88',
            servico: 'Emissão de Boleto',
            setor: 'Financeiro',
            status: 'Concluído',
            atendente: 'Carlos Eduardo',
            observacoes: 'Boleto de anuidade emitido e enviado por e-mail.'
        },
        {
            id: 6,
            data: '24/11/2025',
            hora: '15:00',
            agricultor: 'Raimundo Nonato',
            cpfAgricultor: '222.333.444-55',
            servico: 'Emissão de DAP',
            setor: 'Presidência',
            status: 'Concluído',
            atendente: 'João Paulo',
            observacoes: 'DAP emitida e entregue.'
        },
        {
            id: 7,
            data: '23/11/2025',
            hora: '08:45',
            agricultor: 'Francisca Maria Lima',
            cpfAgricultor: '333.444.555-66',
            servico: 'Consulta Trabalhista',
            setor: 'Jurídico',
            status: 'Concluído',
            atendente: 'Ana Clara',
            observacoes: 'Orientação sobre direitos trabalhistas realizada.'
        },
        {
            id: 8,
            data: '22/11/2025',
            hora: '14:15',
            agricultor: 'Antônio Carlos Souza',
            cpfAgricultor: '444.555.666-77',
            servico: 'Emissão de Boleto',
            setor: 'Financeiro',
            status: 'Pendente',
            atendente: 'Carlos Eduardo',
            observacoes: 'Aguardando confirmação de dados bancários.'
        },
        {
            id: 9,
            data: '21/11/2025',
            hora: '10:30',
            agricultor: 'Maria das Graças',
            cpfAgricultor: '555.666.777-88',
            servico: 'Atualização Cadastral',
            setor: 'Secretaria',
            status: 'Concluído',
            atendente: 'Maria Lucia',
            observacoes: 'Cadastro atualizado com novo endereço.'
        },
        {
            id: 10,
            data: '20/11/2025',
            hora: '16:00',
            agricultor: 'João Batista Ferreira',
            cpfAgricultor: '666.777.888-99',
            servico: 'Emissão de DAP',
            setor: 'Presidência',
            status: 'Concluído',
            atendente: 'João Paulo',
            observacoes: 'DAP emitida sem pendências.'
        },
        {
            id: 11,
            data: '19/11/2025',
            hora: '09:15',
            agricultor: 'Vicente de Paulo',
            cpfAgricultor: '777.888.999-00',
            servico: 'Solicitação de Benefício',
            setor: 'Financeiro',
            status: 'Em Andamento',
            atendente: 'Pedro Henrique',
            observacoes: 'Documentação em análise para aprovação do benefício.'
        },
        {
            id: 12,
            data: '18/11/2025',
            hora: '11:45',
            agricultor: 'Teresa Cristina Oliveira',
            cpfAgricultor: '888.999.000-11',
            servico: 'Consulta Jurídica',
            setor: 'Jurídico',
            status: 'Concluído',
            atendente: 'Ana Clara',
            observacoes: 'Esclarecimentos sobre questões de aposentadoria rural.'
        },
    ];
=======
        farmerId: '',
        farmerName: '',
        sectorId: '',
        serviceTypeId: '',
        observacoes: ''
    });

    // Estados para modais de cadastro rápido
    const [showSectorModal, setShowSectorModal] = useState(false);
    const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
    const [newSectorName, setNewSectorName] = useState('');
    const [newServiceTypeName, setNewServiceTypeName] = useState('');
    const [isSavingSector, setIsSavingSector] = useState(false);
    const [isSavingServiceType, setIsSavingServiceType] = useState(false);
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc

    // Lógica de Paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = historicoData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(historicoData.length / itemsPerPage);

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

    // Toast function
    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

<<<<<<< HEAD
    // Carregar setores e tipos de serviço da API
    useEffect(() => {
        const loadData = async () => {
            try {
                // Carregar setores
                const setoresResponse = await filterSectors({});
                if (setoresResponse && setoresResponse.sectors) {
                    setSetores(setoresResponse.sectors);
                }

                // Carregar tipos de serviço
                const tiposResponse = await filterServiceTypes({});
                if (tiposResponse && tiposResponse.servicesTypes) {
                    setTiposServico(tiposResponse.servicesTypes);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                showToast('Erro ao carregar dados', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
=======
    // Formatar data para exibição
    const formatDateToBR = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatTimeToBR = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    // Formatar CPF com máscara XXX.XXX.XXX-XX
    const formatCPF = (cpf) => {
        if (!cpf) return '-';
        // Remove tudo que não é número
        const numbers = cpf.replace(/\D/g, '');
        if (numbers.length !== 11) return cpf; // Retorna original se não tiver 11 dígitos
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    // Converter status numérico para label
    const getStatusLabel = (status) => {
        const statusMap = {
            1: 'Pendente',
            2: 'Em Andamento',
            3: 'Concluído',
            4: 'Cancelado'
        };
        return statusMap[status] || 'Pendente';
    };

    // Carregar dados da API
    const loadHistorico = async () => {
        try {
            const response = await filterServices({});
            console.log('📝 Resposta de serviços:', response);

            if (response && response.services) {
                const formattedServices = response.services.map(service => {
                    console.log('📌 Serviço:', service);
                    return {
                        id: service.id,
                        data: formatDateToBR(service.createdOn || service.date),
                        hora: formatTimeToBR(service.createdOn || service.date),
                        agricultor: service.farmerName || service.farmer?.name || '-',
                        cpfAgricultor: formatCPF(service.farmerCpf || service.farmer?.cpf),
                        servico: service.serviceTypeName || service.serviceType?.name || '-',
                        setor: service.sectorName || service.sector?.name || '-',
                        status: getStatusLabel(service.status),
                        atendente: service.userName || service.user?.name || service.attendantName || '-',
                        observacoes: service.observations || service.description || ''
                    };
                });
                setHistoricoData(formattedServices);
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            showToast('Erro ao carregar histórico de atendimentos.', 'error');
        }
    };

    const loadSectors = async () => {
        try {
            const response = await filterSectors({});
            if (response && response.sectors) {
                setSectors(response.sectors);
            }
        } catch (error) {
            console.error('Erro ao carregar setores:', error);
        }
    };

    const loadServiceTypes = async () => {
        try {
            const response = await filterServiceTypes({});
            console.log('📋 Resposta serviceTypes:', response);
            // A API retorna "servicesTypes" (com 's' no meio)
            if (response && response.servicesTypes) {
                setServiceTypes(response.servicesTypes);
            } else if (response && response.serviceTypes) {
                setServiceTypes(response.serviceTypes);
            }
        } catch (error) {
            console.error('Erro ao carregar tipos de serviço:', error);
        }
    };

    const searchFarmers = async (query) => {
        if (query.length < 2) {
            setFarmers([]);
            return;
        }
        try {
            // Remove caracteres especiais do CPF se houver
            const cleanedQuery = query.replace(/\D/g, '');

            console.log('🔍 Buscando agricultor:', { query, cleanedQuery });

            // Faz busca por nome
            const nameResponse = await filterFarmers({ name: query });
            console.log('📋 Resposta busca por nome:', nameResponse);
            let results = nameResponse?.farmers || [];

            // Se o query tem números, também busca por CPF
            if (cleanedQuery.length >= 3) {
                console.log('🔢 Buscando por CPF:', cleanedQuery);
                const cpfResponse = await filterFarmers({ cpf: cleanedQuery });
                console.log('📋 Resposta busca por CPF:', cpfResponse);
                if (cpfResponse?.farmers) {
                    // Combina resultados, removendo duplicados
                    const cpfResults = cpfResponse.farmers.filter(
                        f => !results.some(r => r.id === f.id)
                    );
                    results = [...results, ...cpfResults];
                }
            }

            console.log('✅ Resultados finais:', results);

            setFarmers(results);
        } catch (error) {
            console.error('Erro ao buscar agricultores:', error);
        }
    };

    // Carregar dados iniciais
    useEffect(() => {
        const init = async () => {
            await Promise.all([
                loadHistorico(),
                loadSectors(),
                loadServiceTypes()
            ]);
            setIsLoading(false);
        };
        init();
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
    }, []);

    // Handlers do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFarmerSearch = (e) => {
        const value = e.target.value;
        setFarmerSearch(value);
        setFormData({ ...formData, farmerName: value, farmerId: '' });
        searchFarmers(value);
        setShowFarmerDropdown(true);
    };

    const selectFarmer = (farmer) => {
        setFormData({
            ...formData,
            farmerId: farmer.id,
            farmerName: farmer.name
        });
        setFarmerSearch(farmer.name);
        setShowFarmerDropdown(false);
        setFarmers([]);
    };

    const handleLimpar = () => {
        setSelectedFarmer(null);
        setFormData({
<<<<<<< HEAD
            setor: '',
            demanda: '',
=======
            farmerId: '',
            farmerName: '',
            sectorId: '',
            serviceTypeId: '',
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
            observacoes: ''
        });
        setFarmerSearch('');
        showToast('Formulário limpo!', 'info');
    };

<<<<<<< HEAD
    const handleSalvar = () => {
        if (!selectedFarmer || !formData.setor || !formData.demanda) {
            showToast('Preencha todos os campos obrigatórios!', 'error');
            return;
        }
        // TODO: Enviar para API com selectedFarmer.id
        console.log('Salvando atendimento para agricultor:', selectedFarmer);
        showToast('Atendimento registrado com sucesso!', 'success');
        handleLimpar();
=======
    const handleSalvar = async () => {
        if (!formData.farmerId || !formData.sectorId || !formData.serviceTypeId) {
            showToast('Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        setIsSaving(true);
        try {
            await createService({
                farmerId: parseInt(formData.farmerId),
                sectorId: parseInt(formData.sectorId),
                serviceTypeId: parseInt(formData.serviceTypeId),
                observations: formData.observacoes,
                status: 1 // Pendente
            });

            showToast('Atendimento registrado com sucesso!', 'success');

            // Limpa o formulário sem mostrar toast
            setFormData({
                farmerId: '',
                farmerName: '',
                sectorId: '',
                serviceTypeId: '',
                observacoes: ''
            });
            setFarmerSearch('');

            await loadHistorico(); // Recarrega a lista
        } catch (error) {
            showToast('Erro ao registrar atendimento: ' + error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Função para salvar novo setor via modal
    const handleSaveNewSector = async () => {
        if (!newSectorName.trim()) {
            showToast('Digite o nome do setor!', 'warning');
            return;
        }

        setIsSavingSector(true);
        try {
            const response = await createSector({ name: newSectorName.trim() });
            showToast('Setor cadastrado com sucesso!', 'success');
            setNewSectorName('');
            setShowSectorModal(false);
            await loadSectors(); // Recarrega lista de setores

            // Seleciona automaticamente o setor recém-criado
            if (response && response.id) {
                setFormData(prev => ({ ...prev, sectorId: response.id.toString() }));
            }
        } catch (error) {
            showToast('Erro ao cadastrar setor: ' + error.message, 'error');
        } finally {
            setIsSavingSector(false);
        }
    };

    // Função para salvar novo tipo de serviço via modal
    const handleSaveNewServiceType = async () => {
        if (!newServiceTypeName.trim()) {
            showToast('Digite o nome do serviço!', 'warning');
            return;
        }

        // ServiceType precisa de um setor associado
        if (!formData.sectorId) {
            showToast('Selecione um setor primeiro!', 'warning');
            return;
        }

        setIsSavingServiceType(true);
        try {
            const response = await createServiceType({
                name: newServiceTypeName.trim(),
                sectorId: parseInt(formData.sectorId)  // Obrigatório!
            });
            showToast('Tipo de serviço cadastrado com sucesso!', 'success');
            setNewServiceTypeName('');
            setShowServiceTypeModal(false);
            await loadServiceTypes(); // Recarrega lista

            // Seleciona automaticamente o tipo recém-criado
            if (response && response.id) {
                setFormData(prev => ({ ...prev, serviceTypeId: response.id.toString() }));
            }
        } catch (error) {
            showToast('Erro ao cadastrar tipo de serviço: ' + error.message, 'error');
        } finally {
            setIsSavingServiceType(false);
        }
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
    };

    // Funções de visualização
    const handleView = async (atendimento) => {
        setViewingAtendimento(atendimento);
        setActiveTab('visualizar');
    };

    const closeView = () => {
        setViewingAtendimento(null);
        setActiveTab('historico');
    };

    // Funções dos modais de adicionar
    const handleSaveNovoSetor = async () => {
        if (!novoSetor.name.trim()) {
            showToast('Informe o nome do setor', 'warning');
            return;
        }
        setSavingModal(true);
        try {
            await createSector(novoSetor);
            // Recarregar setores
            const response = await filterSectors({});
            if (response && response.sectors) {
                setSetores(response.sectors);
            }
            setNovoSetor({ name: '', description: '' });
            setShowModalSetor(false);
            showToast('Setor criado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao criar setor:', error);
            showToast('Erro ao criar setor: ' + error.message, 'error');
        } finally {
            setSavingModal(false);
        }
    };

    const handleSaveNovaDemanda = async () => {
        if (!novaDemanda.name.trim()) {
            showToast('Informe o nome do serviço', 'warning');
            return;
        }
        if (!novaDemanda.sectorId) {
            showToast('Selecione o setor do serviço', 'warning');
            return;
        }
        setSavingModal(true);
        try {
            await createServiceType(novaDemanda);
            // Recarregar tipos de serviço
            const response = await filterServiceTypes({});
            if (response && response.servicesTypes) {
                setTiposServico(response.servicesTypes);
            }
            setNovaDemanda({ name: '', description: '', sectorId: '' });
            setShowModalDemanda(false);
            showToast('Tipo de serviço criado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao criar tipo de serviço:', error);
            showToast('Erro ao criar serviço: ' + error.message, 'error');
        } finally {
            setSavingModal(false);
        }
    };

    // Função de impressão
    const handlePrint = () => {
        const windowPrint = window.open('', '', 'width=1000,height=600');

        windowPrint.document.write(`
            <html>
                <head>
                    <title>Comprovante de Atendimento - #${String(viewingAtendimento.id).padStart(6, '0')}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            padding: 40px;
                            color: #333;
                        }
                        .header {
                            text-align: center;
                            border-bottom: 2px solid #4a8b58;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .header h1 {
                            color: #4a8b58;
                            font-size: 24px;
                            margin-bottom: 5px;
                        }
                        .header p {
                            color: #666;
                            font-size: 14px;
                        }
                        .protocol {
                            text-align: center;
                            background: #f5f5f5;
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 30px;
                        }
                        .protocol span {
                            font-size: 12px;
                            color: #666;
                            display: block;
                        }
                        .protocol strong {
                            font-size: 24px;
                            color: #4a8b58;
                        }
                        .section {
                            margin-bottom: 25px;
                        }
                        .section-title {
                            font-size: 14px;
                            color: #4a8b58;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            border-bottom: 1px solid #eee;
                            padding-bottom: 8px;
                            margin-bottom: 15px;
                        }
                        .row {
                            display: flex;
                            margin-bottom: 12px;
                        }
                        .field {
                            flex: 3;
                        }
                        .field label {
                            font-size: 11px;
                            color: #888;
                            text-transform: uppercase;
                            display: block;
                            margin-bottom: 4px;
                        }
                        .field span {
                            font-size: 14px;
                            color: #333;
                        }
                        .status {
                            display: inline-block;
                            padding: 4px 12px;
                            border-radius: 12px;
                            font-size: 11px;
                            font-weight: bold;
                            text-transform: uppercase;
                        }
                        .status.concluído { background: #d1e7dd; color: #0f5132; }
                        .status.em-andamento { background: #fff3cd; color: #856404; }
                        .status.pendente { background: #f8d7da; color: #721c24; }
                        .observations {
                            background: #f9f9f9;
                            padding: 15px;
                            border-radius: 8px;
                            border: 1px solid #4a8b58;
                            font-size: 14px;
                            line-height: 1.6;
                        }
                        .footer {
                            margin-top: 40px;
                            text-align: center;
                            color: #888;
                            font-size: 12px;
                            border-top: 1px solid #eee;
                            padding-top: 20px;
                        }
                        .signature {
                            margin-top: 120px;
                            margin-left: 40px;
                            margin-right: 40px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .signature-line {
                            width: 300px;
                            text-align: center;
                        }
                        .signature-line div {
                            border-top: 1px solid #333;
                            padding-top: 8px;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>SINDICATO DOS TRABALHADORES RURAIS</h1>
                        <p>Comprovante de Atendimento</p>
                    </div>
                    
                    <div class="protocol">
                        <span>Número do Protocolo</span>
                        <strong>#${String(viewingAtendimento.id).padStart(6, '0')}</strong>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Informações do Atendimento</h3>
                        <div class="row">
                            <div class="field">
                                <label>Data</label>
                                <span>${viewingAtendimento.data}</span>
                            </div>
                            <div class="field">
                                <label>Hora</label>
                                <span>${viewingAtendimento.hora}</span>
                            </div>
                            <div class="field">
                                <label>Status</label>
                                <span class="status ${viewingAtendimento.status.toLowerCase().replace(' ', '-')}">${viewingAtendimento.status}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Dados do Agricultor</h3>
                        <div class="row">
                            <div class="field">
                                <label>Nome Completo</label>
                                <span>${viewingAtendimento.agricultor}</span>
                            </div>
                            <div class="field">
                                <label>CPF</label>
                                <span>${viewingAtendimento.cpfAgricultor}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Detalhes do Serviço</h3>
                        <div class="row">
                            <div class="field">
                                <label>Serviço Solicitado</label>
                                <span>${viewingAtendimento.servico}</span>
                            </div>
                            <div class="field">
                                <label>Setor Responsável</label>
                                <span>${viewingAtendimento.setor}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="field">
                                <label>Atendente</label>
                                <span>${viewingAtendimento.atendente}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Observações</h3>
                        <div class="observations">
                            ${viewingAtendimento.observacoes || 'Sem observações registradas.'}
                        </div>
                    </div>
                    
                    <div class="signature">
                        <div class="signature-line">
                            <div>Assinatura do Agricultor</div>
                        </div>
                        <div class="signature-line">
                            <div>Assinatura do Atendente</div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                        <p>Este comprovante é válido como protocolo de atendimento.</p>
                    </div>
                </body>
            </html>
        `);

        windowPrint.document.close();
        windowPrint.focus();

        setTimeout(() => {
            windowPrint.print();
            windowPrint.close();
        }, 250);

        showToast('Comprovante gerado com sucesso!', 'success');
    };

    // Tela de carregamento
    if (isLoading) {
        return (
            <div className="atendimentos-content" role="main" aria-busy="true">
                <div className="loading-container">
                    <div className="spinner" role="status" aria-label="Carregando dados"></div>
                    <p>Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="atendimentos-content">
            {/* Toast Notification */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />

            <h1 className="page-title">Atendimentos</h1>

            {/* Abas - Esconder quando visualizando */}
            {activeTab !== 'visualizar' && (
                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'registrar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('registrar')}
                    >
                        Registrar atendimento
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`}
                        onClick={() => setActiveTab('historico')}
                    >
                        Histórico de atendimento
                    </button>
                </div>
            )}

            {/* Card Principal */}
            <div className="main-card fade-in">

                {/* --- ABA REGISTRAR --- */}
                {activeTab === 'registrar' && (
                    <form className="atendimento-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-grid-2">
<<<<<<< HEAD
                            <div className="form-group">
                                <label>Agricultor (nome/CPF)</label>
                                <FarmerAutocomplete
                                    value={selectedFarmer}
                                    onSelect={setSelectedFarmer}
                                    placeholder="Digite nome ou CPF do agricultor..."
=======
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label>Agricultor (nome/CPF) <span style={{ color: '#dc3545' }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Digite o nome do agricultor..."
                                    value={farmerSearch}
                                    onChange={handleFarmerSearch}
                                    onFocus={() => farmers.length > 0 && setShowFarmerDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowFarmerDropdown(false), 200)}
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
                                />
                                {showFarmerDropdown && farmers.length > 0 && (
                                    <div className="farmer-dropdown" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        {farmers.map(farmer => (
                                            <div
                                                key={farmer.id}
                                                onClick={() => selectFarmer(farmer)}
                                                style={{
                                                    padding: '10px 12px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.background = 'white'}
                                            >
                                                <strong>{farmer.name}</strong>
                                                {farmer.cpf && <span style={{ marginLeft: '10px', color: '#666' }}>{formatCPF(farmer.cpf)}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
<<<<<<< HEAD
                                <label>Setor / Diretoria</label>
                                <div className="select-with-btn">
                                    <select
                                        name="setor"
                                        className="form-select"
                                        value={formData.setor}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Selecionar Setor</option>
                                        {setores.map(setor => (
                                            <option key={setor.id} value={setor.id}>{setor.name}</option>
=======
                                <label>Setor / Diretoria <span style={{ color: '#dc3545' }}>*</span></label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select
                                        name="sectorId"
                                        className="form-select"
                                        value={formData.sectorId}
                                        onChange={handleChange}
                                        style={{ flex: 1 }}
                                    >
                                        <option value="" disabled>Selecionar Setor</option>
                                        {sectors.map(sector => (
                                            <option key={sector.id} value={sector.id}>
                                                {sector.name}
                                            </option>
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
                                        ))}
                                    </select>
                                    <button
                                        type="button"
<<<<<<< HEAD
                                        className="btn-add-inline"
                                        onClick={() => setShowModalSetor(true)}
                                        title="Adicionar novo setor"
                                    >
                                        <Plus size={18} />
=======
                                        className="btn-icon-add"
                                        onClick={() => setShowSectorModal(true)}
                                        title="Adicionar novo setor"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            border: '1px solid #4a8b58',
                                            background: '#fff',
                                            color: '#4a8b58',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#4a8b58';
                                            e.target.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#fff';
                                            e.target.style.color = '#4a8b58';
                                        }}
                                    >
                                        <Plus size={20} />
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
<<<<<<< HEAD
                                <label>Demanda / Serviço solicitado</label>
                                <div className="select-with-btn">
                                    <select
                                        name="demanda"
                                        className="form-select"
                                        value={formData.demanda}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Selecione o serviço</option>
                                        {tiposServico.map(tipo => (
                                            <option key={tipo.id} value={tipo.id}>{tipo.name}</option>
=======
                                <label>Demanda / Serviço solicitado <span style={{ color: '#dc3545' }}>*</span></label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select
                                        name="serviceTypeId"
                                        className="form-select"
                                        value={formData.serviceTypeId}
                                        onChange={handleChange}
                                        style={{ flex: 1 }}
                                    >
                                        <option value="" disabled>Selecione o serviço</option>
                                        {serviceTypes.map(serviceType => (
                                            <option key={serviceType.id} value={serviceType.id}>
                                                {serviceType.name}
                                            </option>
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
                                        ))}
                                    </select>
                                    <button
                                        type="button"
<<<<<<< HEAD
                                        className="btn-add-inline"
                                        onClick={() => setShowModalDemanda(true)}
                                        title="Adicionar novo tipo de serviço"
                                    >
                                        <Plus size={18} />
=======
                                        className="btn-icon-add"
                                        onClick={() => setShowServiceTypeModal(true)}
                                        title="Adicionar novo tipo de serviço"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            border: '1px solid #4a8b58',
                                            background: '#fff',
                                            color: '#4a8b58',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#4a8b58';
                                            e.target.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#fff';
                                            e.target.style.color = '#4a8b58';
                                        }}
                                    >
                                        <Plus size={20} />
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label>Detalhe / Observações</label>
                                <textarea
                                    name="observacoes"
                                    className="form-textarea"
                                    placeholder="Descreva o atendimento realizado ..."
                                    value={formData.observacoes}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-footer">
                            <button type="button" className="btn-outline-gray" onClick={handleLimpar}>
                                Limpar
                            </button>
                            <button
                                type="button"
                                className="btn-solid-green"
                                onClick={handleSalvar}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Salvando...' : 'Salvar Atendimento'}
                            </button>
                        </div>
                    </form>
                )}

                {/* --- ABA HISTÓRICO --- */}
                {activeTab === 'historico' && (
                    <>
                        <div className="table-responsive fade-in">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Agricultor</th>
                                        <th>Serviço</th>
                                        <th>Setor</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                                Nenhum atendimento encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.data}</td>
                                                <td><strong>{item.agricultor}</strong></td>
                                                <td>{item.servico}</td>
                                                <td>{item.setor}</td>
                                                <td>
                                                    <span className={`status-tag ${item.status.toLowerCase().replace(' ', '-')}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="actions-cell">
                                                        <button
                                                            className="icon-action"
                                                            title="Ver Detalhes"
                                                            onClick={() => handleView(item)}
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            className="icon-action"
                                                            title="Gerar Comprovante"
                                                            onClick={() => {
                                                                setViewingAtendimento(item);
                                                                setTimeout(() => {
                                                                    handlePrint();
                                                                }, 100);
                                                            }}
                                                        >
                                                            <FileText size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Controles de Paginação */}
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

                {/* --- ABA VISUALIZAR --- */}
                {activeTab === 'visualizar' && viewingAtendimento && (
                    <div className="view-container fade-in" ref={printRef}>
                        {/* Header com botões */}
                        <div className="view-header">
                            <h2 className="view-title">Detalhes do Atendimento</h2>
                            <div className="view-actions">
                                <button
                                    type="button"
                                    className="btn-solid-green"
                                    onClick={handlePrint}
                                >
                                    <Printer size={18} /> Imprimir Comprovante
                                </button>
                                <button
                                    type="button"
                                    className="btn-outline-gray"
                                    onClick={closeView}
                                >
                                    <ArrowLeft size={18} /> Voltar ao Histórico
                                </button>
                            </div>
                        </div>

                        {/* Informações do Atendimento */}
                        <div className="info-section">
                            <h3 className="section-title">Informações do Atendimento</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Protocolo</span>
                                    <span className="info-value highlight">#{String(viewingAtendimento.id).padStart(6, '0')}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Data</span>
                                    <span className="info-value">{viewingAtendimento.data}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Hora</span>
                                    <span className="info-value">{viewingAtendimento.hora}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Status</span>
                                    <span className={`status-tag ${viewingAtendimento.status.toLowerCase().replace(' ', '-')}`}>
                                        {viewingAtendimento.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Dados do Agricultor */}
                        <div className="info-section">
                            <h3 className="section-title">Dados do Agricultor</h3>
                            <div className="info-grid-2">
                                <div className="info-item">
                                    <span className="info-label">Nome Completo</span>
                                    <span className="info-value">{viewingAtendimento.agricultor}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">CPF</span>
                                    <span className="info-value">{viewingAtendimento.cpfAgricultor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Detalhes do Serviço */}
                        <div className="info-section">
                            <h3 className="section-title">Detalhes do Serviço</h3>
                            <div className="info-grid-2">
                                <div className="info-item">
                                    <span className="info-label">Serviço Solicitado</span>
                                    <span className="info-value">{viewingAtendimento.servico}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Setor Responsável</span>
                                    <span className="info-value">{viewingAtendimento.setor}</span>
                                </div>
                            </div>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Atendente</span>
                                    <span className="info-value">{viewingAtendimento.atendente}</span>
                                </div>
                            </div>
                        </div>

                        {/* Observações */}
                        <div className="info-section no-border">
                            <h3 className="section-title">Observações</h3>
                            <p className="observation-text">
                                {viewingAtendimento.observacoes || 'Sem observações registradas.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

<<<<<<< HEAD
            {/* Modal Adicionar Setor */}
            <Modal
                isOpen={showModalSetor}
                onClose={() => setShowModalSetor(false)}
                title="Adicionar Novo Setor"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowModalSetor(false)}>
                            Cancelar
                        </button>
                        <button
                            className="btn-solid-green"
                            onClick={handleSaveNovoSetor}
                            disabled={savingModal}
                        >
                            {savingModal ? 'Salvando...' : 'Salvar Setor'}
                        </button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Nome do Setor <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Presidência"
                        value={novoSetor.name}
                        onChange={(e) => setNovoSetor({ ...novoSetor, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Descrição</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Breve descrição do setor"
                        value={novoSetor.description}
                        onChange={(e) => setNovoSetor({ ...novoSetor, description: e.target.value })}
                    />
                </div>
            </Modal>

            {/* Modal Adicionar Demanda/Tipo de Serviço */}
            <Modal
                isOpen={showModalDemanda}
                onClose={() => setShowModalDemanda(false)}
                title="Adicionar Novo Tipo de Serviço"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowModalDemanda(false)}>
                            Cancelar
                        </button>
                        <button
                            className="btn-solid-green"
                            onClick={handleSaveNovaDemanda}
                            disabled={savingModal}
                        >
                            {savingModal ? 'Salvando...' : 'Salvar Serviço'}
                        </button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Nome do Serviço <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Emissão de DAP"
                        value={novaDemanda.name}
                        onChange={(e) => setNovaDemanda({ ...novaDemanda, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Setor <span className="required">*</span></label>
                    <select
                        className="form-select"
                        value={novaDemanda.sectorId}
                        onChange={(e) => setNovaDemanda({ ...novaDemanda, sectorId: e.target.value })}
                    >
                        <option value="" disabled>Selecionar Setor</option>
                        {setores.map(setor => (
                            <option key={setor.id} value={setor.id}>{setor.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Descrição</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Breve descrição do serviço"
                        value={novaDemanda.description}
                        onChange={(e) => setNovaDemanda({ ...novaDemanda, description: e.target.value })}
                    />
                </div>
            </Modal>
=======
            {/* Modal - Cadastrar Novo Setor */}
            {showSectorModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div className="modal-content" style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Novo Setor / Diretoria</h3>
                            <button
                                onClick={() => { setShowSectorModal(false); setNewSectorName(''); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={24} color="#666" />
                            </button>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                                Nome do Setor
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Digite o nome do setor..."
                                value={newSectorName}
                                onChange={(e) => setNewSectorName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveNewSector()}
                                autoFocus
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                className="btn-outline-gray"
                                onClick={() => { setShowSectorModal(false); setNewSectorName(''); }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-solid-green"
                                onClick={handleSaveNewSector}
                                disabled={isSavingSector}
                            >
                                {isSavingSector ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal - Cadastrar Novo Tipo de Serviço */}
            {showServiceTypeModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div className="modal-content" style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Novo Tipo de Serviço</h3>
                            <button
                                onClick={() => { setShowServiceTypeModal(false); setNewServiceTypeName(''); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={24} color="#666" />
                            </button>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                                Nome do Serviço
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Digite o nome do serviço..."
                                value={newServiceTypeName}
                                onChange={(e) => setNewServiceTypeName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveNewServiceType()}
                                autoFocus
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                className="btn-outline-gray"
                                onClick={() => { setShowServiceTypeModal(false); setNewServiceTypeName(''); }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-solid-green"
                                onClick={handleSaveNewServiceType}
                                disabled={isSavingServiceType}
                            >
                                {isSavingServiceType ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
>>>>>>> a1f4a05f1108e7ceb92cb3611a154c9e10b122bc
        </div>
    );
};

export default Atendimentos;