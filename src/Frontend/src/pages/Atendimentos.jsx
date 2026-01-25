﻿import React, { useState, useEffect, useRef } from 'react';
import { Eye, FileText, ArrowLeft, Printer, Plus, X, Download } from 'lucide-react';
import '../assets/css/Atendimentos.css';
import Toast from '../components/Toast';
import { filterServices, createService, getServiceById, filterServiceTypes, createServiceType } from '../services/serviceService';
import { filterSectors, createSector } from '../services/sectorService';
import { filterFarmers, getFarmerById } from '../services/farmerService';
import { pdf, PDFViewer } from '@react-pdf/renderer'; // Import react-pdf
import AposentadoriaRuralPdf from '../templates/AposentadoriaRuralPdf'; // Import PDF component
import logoStraaf from '../assets/img/logo-straaf.svg'; // Import Logo

const Atendimentos = () => {
    const [activeTab, setActiveTab] = useState('registrar');
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [viewingAtendimento, setViewingAtendimento] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const printRef = useRef(null);

    // Estado para preview do documento
    const [showDocumentPreview, setShowDocumentPreview] = useState(false);
    const [documentPreviewData, setDocumentPreviewData] = useState(null);
    const [logoPngUrl, setLogoPngUrl] = useState(null);

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
    const [formData, setFormData] = useState({
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

    // Formatar data para exibição (Horário de Fortaleza-CE, UTC-3)
    const formatDateToBR = (dateString) => {
        if (!dateString) return '-';
        // Se a data não tiver informação de timezone, assumir que é UTC
        let dateStr = dateString;
        if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('-', 10)) {
            dateStr = dateStr + 'Z';
        }
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' });
    };

    const formatTimeToBR = (dateString) => {
        if (!dateString) return '-';
        // Se a data não tiver informação de timezone, assumir que é UTC
        let dateStr = dateString;
        if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('-', 10)) {
            dateStr = dateStr + 'Z';
        }
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Fortaleza' });
    };


    const formatCPF = (cpf) => {
        if (!cpf) return '-';
        const numbers = cpf.replace(/\D/g, '');
        if (numbers.length !== 11) return cpf;
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const getStatusLabel = (status) => {

        const statusNumMap = {
            1: 'Pendente',
            2: 'Em Andamento',
            3: 'Concluído',
            4: 'Cancelado'
        };

        // Mapeamento de textos em inglês para português
        const statusTextMap = {
            'pending': 'Pendente',
            'inprogress': 'Em Andamento',
            'in progress': 'Em Andamento',
            'completed': 'Concluído',
            'cancelled': 'Cancelado',
            'canceled': 'Cancelado'
        };

        if (typeof status === 'number') {
            return statusNumMap[status] || 'Pendente';
        }

        if (typeof status === 'string') {
            const lowerStatus = status.toLowerCase().trim();
            return statusTextMap[lowerStatus] || status;
        }

        return 'Pendente';
    };

    const [allFarmers, setAllFarmers] = useState([]);
    const loadHistorico = async () => {
        try {
            const response = await filterServices({});
            console.log('Resposta de serviços:', response);

            if (response && response.services) {
                const formattedServices = response.services.map(service => {
                    console.log('Resposta de serviços:', service);
                    return {
                        id: service.id,
                        data: formatDateToBR(service.createdOn || service.date),
                        hora: formatTimeToBR(service.createdOn || service.date),
                        agricultor: service.farmerName || service.FarmerName || service.farmer?.name || service.Farmer?.Name || '-',
                        cpfAgricultor: formatCPF(service.farmerCpf || service.FarmerCpf || service.farmer?.cpf || service.Farmer?.Cpf),
                        servico: service.serviceTypeName || service.ServiceTypeName || service.serviceType?.name || service.ServiceType?.Name || '-',
                        setor: service.sectorName || service.SectorName || service.sector?.name || service.Sector?.Name || '-',
                        status: getStatusLabel(service.status),
                        atendente: service.userName || service.user?.name || service.attendantName || '-',
                        observacoes: service.notes || service.observations || '',
                        farmerId: service.farmerId || service.FarmerId || service.farmer?.id // Add farmerId
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
            console.log('Resposta serviceTypes:', response);
            // A API retorna "servicesTypes" (com 's' no meio)
            if (response && response.servicesTypes) {
                setServiceTypes(response.servicesTypes);
            } else if (response && response.serviceTypes) {
                setServiceTypes(response.serviceTypes);
            }
        } catch (error) {
            console.error('Erro ao carregar tipos de serviços:', error);
        }
    };

    const loadAllFarmers = async () => {
        try {
            const response = await filterFarmers({});
            if (response && response.farmers) {
                setAllFarmers(response.farmers);
            }
        } catch (error) {
            console.error('Erro ao carregar agricultores:', error);
        }
    };

    const filterLocalFarmers = (query) => {
        if (!query || query.length < 2) {
            setFarmers([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const cleanedQuery = query.replace(/\D/g, '');

        const filtered = allFarmers.filter(farmer => {
            const name = farmer.name?.toLowerCase() || '';
            const cpf = farmer.cpf || '';
            const cpfLimpo = cpf.replace(/\D/g, '');

            if (name.includes(lowerQuery)) return true;

            if (cleanedQuery.length > 0) {
                if (cpfLimpo.includes(cleanedQuery)) return true;
                if (cpf.includes(query)) return true;
            }

            return false;
        });

        setFarmers(filtered.slice(0, 10));
    };

    useEffect(() => {
        const init = async () => {
            await Promise.all([
                loadHistorico(),
                loadSectors(),
                loadServiceTypes(),
                loadAllFarmers()
            ]);
            setIsLoading(false);
        };
        init();
    }, []);

    const handleFarmerSearch = (e) => {
        let value = e.target.value;
        const onlyNums = value.replace(/\D/g, '');
        if (onlyNums.length > 0 && /[\d.-]+$/.test(value) && !/[a-zA-Z]/.test(value)) {
            if (onlyNums.length <= 11) {
                value = onlyNums
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                    .replace(/(-\d{2})\d+?$/, '$1');
            }
        }

        setFarmerSearch(value);
        setFormData({ ...formData, farmerName: value, farmerId: '' });

        filterLocalFarmers(value);

        setShowFarmerDropdown(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        setFormData({
            farmerId: '',
            farmerName: '',
            sectorId: '',
            serviceTypeId: '',
            observacoes: ''
        });
        setFarmerSearch('');
        showToast('Formulário limpo!', 'info');
    };

    const handleSalvar = async () => {
        if (!formData.farmerId || !formData.sectorId || !formData.serviceTypeId) {
            showToast('Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                farmerId: parseInt(formData.farmerId),
                sectorId: parseInt(formData.sectorId),
                serviceTypeId: parseInt(formData.serviceTypeId),
                notes: formData.observacoes,
                status: 1 // Pendente
            };
            console.log('📤 Enviando para API:', payload);
            await createService(payload);

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
            await loadSectors();

            if (response && response.id) {
                setFormData(prev => ({ ...prev, sectorId: response.id.toString() }));
            }
        } catch (error) {
            showToast('Erro ao cadastrar setor: ' + error.message, 'error');
        } finally {
            setIsSavingSector(false);
        }
    };

    const handleSaveNewServiceType = async () => {
        if (!newServiceTypeName.trim()) {
            showToast('Digite o nome do serviço!', 'warning');
            return;
        }

        if (!formData.sectorId) {
            showToast('Selecione um setor primeiro!', 'warning');
            return;
        }

        setIsSavingServiceType(true);
        try {
            const response = await createServiceType({
                name: newServiceTypeName.trim(),
                sectorId: parseInt(formData.sectorId)
            });
            showToast('Tipo de serviço cadastrado com sucesso!', 'success');
            setNewServiceTypeName('');
            setShowServiceTypeModal(false);
            await loadServiceTypes();

            if (response && response.id) {
                setFormData(prev => ({ ...prev, serviceTypeId: response.id.toString() }));
            }
        } catch (error) {
            showToast('Erro ao cadastrar tipo de serviço: ' + error.message, 'error');
        } finally {
            setIsSavingServiceType(false);
        }
    };

    const handleView = async (atendimento) => {
        try {
            const fullData = await getServiceById(atendimento.id);
            console.log('Dados completos do atendimento:', fullData);
            const completeAtendimento = {
                id: atendimento.id,
                data: atendimento.data,
                hora: atendimento.hora,
                agricultor: fullData?.farmerName || fullData?.FarmerName || atendimento.agricultor || '-',
                cpfAgricultor: formatCPF(fullData?.farmerCpf || fullData?.FarmerCpf) || atendimento.cpfAgricultor || '-',
                servico: fullData?.serviceTypeName || fullData?.ServiceTypeName || atendimento.servico || '-',
                setor: fullData?.sectorName || fullData?.SectorName || atendimento.setor || '-',
                status: getStatusLabel(fullData?.status) || atendimento.status || 'Pendente',
                atendente: fullData?.attendantName || atendimento.atendente || '-',
                observacoes: fullData?.notes || atendimento.observacoes || '',
                farmerId: fullData?.farmerId || fullData?.FarmerId || atendimento.farmerId
            };

            setViewingAtendimento(completeAtendimento);
            setActiveTab('visualizar');
        } catch (error) {
            console.error('Erro ao buscar detalhes do atendimento:', error);
            setViewingAtendimento(atendimento);
            setActiveTab('visualizar');
            showToast('Não foi possível carregar todos os detalhes.', 'warning');
        }
    };

    const closeView = () => {
        setViewingAtendimento(null);
        setActiveTab('historico');
    };

    const handleGenerateDocument = async () => {
        if (!viewingAtendimento || !viewingAtendimento.farmerId) {
            showToast('Erro: Identificação do agricultor não encontrada.', 'error');
            return;
        }

        showToast('Preparando visualização...', 'info');

        try {
            // 1. Buscar dados completos do agricultor
            const farmerData = await getFarmerById(viewingAtendimento.farmerId);

            if (!farmerData) {
                showToast('Erro ao buscar dados do agricultor.', 'error');
                return;
            }

            // 2. Buscar dados do sindicato do localStorage
            let sindicatoData = {
                nome: 'SINDICATO DOS TRABALHADORES RURAIS AGRICULTORES E AGRICULTORAS FAMILIARES DE CRATEÚS',
                cnpj: '06.586.523/0001-48',
                endereco: 'Rua Coronel Lúcio, 715 - Centro',
                cidade: 'Crateús',
                estado: 'CE',
                telefone: '-',
                email: '-'
            };

            const storedSindicato = localStorage.getItem('sindicatoData');
            if (storedSindicato) {
                try {
                    sindicatoData = JSON.parse(storedSindicato);
                } catch (e) {
                    console.warn('Erro ao parsear dados do sindicato do localStorage:', e);
                }
            }

            // 3. Preparar dados para o template
            const templateData = {
                agricultor: {
                    nome: farmerData.name,
                    cpf: farmerData.cpf,
                    rg: '________________',
                    estadoCivil: farmerData.maritalStatus ? (['Solteiro(a)', 'Casado(a)', 'Separado(a)', 'Divorciado(a)', 'Viúvo(a)'])[farmerData.maritalStatus - 1] || 'Não informado' : 'Não informado',
                    profissao: farmerData.profession || 'Agricultor(a) Familiar',
                    dataNascimento: farmerData.birthDate,
                    endereco: farmerData.addressStreet || 'Rua não informada',
                    numero: farmerData.addressNumber,
                    bairro: farmerData.addressNeighborhood,
                    cidade: farmerData.addressCity,
                    uf: farmerData.addressUf,
                    cep: farmerData.addressCep
                },
                sindicato: {
                    nome: sindicatoData.nome,
                    cnpj: sindicatoData.cnpj,
                    endereco: sindicatoData.endereco,
                    cidade: sindicatoData.cidade,
                    uf: sindicatoData.estado,
                    telefone: sindicatoData.telefone,
                    email: sindicatoData.email,
                    presidente: sindicatoData.presidente
                },
                dataAtual: new Date().toLocaleDateString('pt-BR')
            };

            // 4. Converter logo SVG para PNG
            const convertSvgToPng = (url) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas.toDataURL('image/png'));
                    };
                    img.onerror = reject;
                    img.src = url;
                });
            };

            let convertedLogo = null;
            try {
                convertedLogo = await convertSvgToPng(logoStraaf);
            } catch (err) {
                console.warn('Erro ao converter logo SVG:', err);
            }

            // 5. Mostrar preview
            setLogoPngUrl(convertedLogo || logoStraaf);
            setDocumentPreviewData(templateData);
            setShowDocumentPreview(true);

        } catch (error) {
            console.error('Erro ao preparar documento:', error);
            showToast('Erro ao preparar documento.', 'error');
        }
    };

    const handleDownloadDocument = async () => {
        if (!documentPreviewData) return;

        try {
            const blob = await pdf(
                <AposentadoriaRuralPdf
                    data={documentPreviewData}
                    logoUrl={logoPngUrl}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Requerimento_${documentPreviewData.agricultor.nome.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast('Documento baixado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao baixar documento:', error);
            showToast('Erro ao baixar documento.', 'error');
        }
    };

    const closeDocumentPreview = () => {
        setShowDocumentPreview(false);
        setDocumentPreviewData(null);
    };

    // Função de impressão
    const handlePrint = () => {
        const windowPrint = window.open('', '', 'width=1000,height=600');

        windowPrint.document.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Comprovante de Atendimento - #${String(viewingAtendimento.id).padStart(6, '0')}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        @page { 
                            size: A4; 
                            margin: 15mm; 
                        }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            padding: 30px;
                            color: #333;
                            line-height: 1.5;
                        }
                        .header {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 20px;
                            border-bottom: 3px solid #4a8b58;
                            padding-bottom: 20px;
                            margin-bottom: 25px;
                        }
                        .header-logo {
                            width: 120px;
                            height: 120px;
                            flex-shrink: 0;
                        }
                        .header-logo img {
                            width: 150px;
                            height: 150px;
                            object-fit: contain;
                        }
                        .header-text {
                            text-align: right;
                        }
                        .header-text h1 {
                            color: #4a8b58;
                            font-size: 16px;
                            margin-bottom: 4px;
                            letter-spacing: 1px;
                        }
                        .header-text h2 {
                            color: #666;
                            font-size: 14px;
                            font-weight: normal;
                            margin-bottom: 2px;
                        }
                        .header-text p {
                            color: #888;
                            font-size: 12px;
                        }
                        .document-title {
                            text-align: center;
                            background: linear-gradient(135deg, #4a8b58 0%, #3d7249 100%);
                            color: white;
                            padding: 12px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            font-size: 16px;
                            font-weight: bold;
                            letter-spacing: 1px;
                            text-transform: uppercase;
                        }
                        .protocol {
                            text-align: center;
                            background: #f8f9fa;
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 25px;
                            border-left: 4px solid #4a8b58;
                        }
                        .protocol span {
                            font-size: 12px;
                            color: #666;
                            display: block;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .protocol strong {
                            font-size: 18px;
                            color: #4a8b58;
                            font-weight: bold;
                        }
                        .section {
                            margin-bottom: 20px;
                        }
                        .section-title {
                            font-size: 13px;
                            color: #4a8b58;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            border-bottom: 2px solid #e9ecef;
                            padding-bottom: 8px;
                            margin-bottom: 12px;
                            font-weight: bold;
                        }
                        .row {
                            display: flex;
                            margin-bottom: 10px;
                            gap: 20px;
                        }
                        .field {
                            flex: 1;
                        }
                        .field label {
                            font-size: 10px;
                            color: #888;
                            text-transform: uppercase;
                            display: block;
                            margin-bottom: 3px;
                            letter-spacing: 0.5px;
                        }
                        .field span {
                            font-size: 14px;
                            color: #333;
                            font-weight: 500;
                        }
                        .status {
                            display: inline-block;
                            padding: 4px 12px;
                            border-radius: 20px;
                            font-size: 11px;
                            font-weight: bold;
                            text-transform: uppercase;
                        }
                        .status.concluído, .status.concluido { background: #d1e7dd; color: #0f5132; }
                        .status.em-andamento { background: #fff3cd; color: #856404; }
                        .status.pendente { background: #f8d7da; color: #721c24; }
                        .observations {
                            background: #f8f9fa;
                            padding: 15px;
                            border-radius: 8px;
                            border: 1px solid #dee2e6;
                            font-size: 14px;
                            line-height: 1.6;
                            min-height: 60px;
                        }
                        .signature-section {
                            margin-top: 25px;
                            padding-top: 15px;
                        }
                        .signature-row {
                            display: flex;
                            justify-content: space-around;
                            gap: 60px;
                            padding: 0 30px;
                        }
                        .signature-box {
                            flex: 1;
                            text-align: center;
                            max-width: 280px;
                        }
                        .signature-line {
                            border-top: 1px solid #333;
                            padding-top: 10px;
                            margin-top: 30px;
                        }
                        .signature-label {
                            font-size: 12px;
                            color: #555;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            color: #888;
                            font-size: 11px;
                            border-top: 1px solid #eee;
                            padding-top: 10px;
                        }
                        .footer p {
                            margin-bottom: 3px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="header-logo"><img src="/src/assets/img/logo-straaf.svg" alt="STRAAF Logo" /></div>
                        <div class="header-text">
                            <h1>SINDICATO DOS TRABALHADORES RURAIS AGRICULTORES E AGRICULTORAS FAMILIARES</h1>
                            <h2>CNPJ: 06.586.523/0001-48</h2>
                            <h2>Cidade: Crateús - CE</h2>
                        </div>
                    </div>
                    
                    <div class="document-title">Comprovante de Atendimento</div>
                    
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
                    
                    <div class="signature-section">
                        <div class="signature-row">
                            <div class="signature-box">
                                <div class="signature-line">
                                    <span class="signature-label">Assinatura do Agricultor</span>
                                </div>
                            </div>
                            <div class="signature-box">
                                <div class="signature-line">
                                    <span class="signature-label">Assinatura do Atendente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} às ${new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
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
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="campo-obrigatorio">Agricultor (nome/CPF)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Digite o nome do agricultor..."
                                    value={farmerSearch}
                                    onChange={handleFarmerSearch}
                                    onFocus={() => farmers.length > 0 && setShowFarmerDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowFarmerDropdown(false), 200)}
                                />
                                {showFarmerDropdown && farmers.length > 0 && (
                                    <div className="farmer-dropdown">
                                        {farmers.map(farmer => (
                                            <div
                                                key={farmer.id}
                                                className="farmer-dropdown-item"
                                                onClick={() => selectFarmer(farmer)}
                                            >
                                                <strong>{farmer.name}</strong>
                                                {farmer.cpf && <span className="farmer-dropdown-cpf">{formatCPF(farmer.cpf)}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="campo-obrigatorio">Setor / Diretoria</label>
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
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="btn-icon-add"
                                        onClick={() => setShowSectorModal(true)}
                                        title="Adicionar novo setor"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label className="campo-obrigatorio">Demanda / Serviço solicitado</label>
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
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="btn-icon-add"
                                        onClick={() => setShowServiceTypeModal(true)}
                                        title="Adicionar novo tipo de serviço"
                                    >
                                        <Plus size={20} />
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

                {/* --- ABA HIST├ôRICO --- */}
                {activeTab === 'historico' && (
                    <>
                        <div className="table-responsive fade-in">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Agricultor</th>
                                        <th>Setor</th>
                                        <th>Status</th>
                                        <th>Opções</th>
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
                        {/* Header com bot├Áes */}
                        <div className="view-header">
                            <h2 className="view-title">Detalhes do Atendimento</h2>
                            <div className="view-actions">
                                <button
                                    type="button"
                                    className="btn-solid-green"
                                    onClick={handleGenerateDocument}
                                    style={{ marginRight: '10px' }} // Pequeno ajuste de estilo inline
                                >
                                    <FileText size={18} /> Gerar Documento
                                </button>
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

            {/* Modal - Cadastrar Novo Setor */}
            {showSectorModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Novo Setor / Diretoria</h3>
                            <button
                                className="modal-close-btn"
                                onClick={() => { setShowSectorModal(false); setNewSectorName(''); }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <label className="modal-label">
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
                            />
                        </div>
                        <div className="modal-footer">
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
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Novo Tipo de Serviço</h3>
                            <button
                                className="modal-close-btn"
                                onClick={() => { setShowServiceTypeModal(false); setNewServiceTypeName(''); }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <label className="modal-label">
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
                            />
                        </div>
                        <div className="modal-footer">
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

            {/* Modal - Preview do Documento */}
            {showDocumentPreview && documentPreviewData && (
                <div className="modal-overlay" style={{ zIndex: 9999 }}>
                    <div className="modal-content" style={{ width: '90%', maxWidth: '900px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="modal-header">
                            <h3>Visualizar Documento</h3>
                            <button
                                className="modal-close-btn"
                                onClick={closeDocumentPreview}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ flex: 1, overflow: 'hidden', padding: 0 }}>
                            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                                <AposentadoriaRuralPdf
                                    data={documentPreviewData}
                                    logoUrl={logoPngUrl}
                                />
                            </PDFViewer>
                        </div>
                        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                            <button
                                className="btn-outline-gray"
                                onClick={closeDocumentPreview}
                            >
                                Fechar
                            </button>
                            <button
                                className="btn-solid-green"
                                onClick={handleDownloadDocument}
                            >
                                <Download size={18} /> Baixar PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Atendimentos;
