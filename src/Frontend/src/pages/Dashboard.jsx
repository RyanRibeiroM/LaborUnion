// ============================================================
// 📚 DASHBOARD CONECTADO COM API - GUIA DIDÁTICO
// ============================================================
// Este arquivo foi atualizado para conectar com a API real.
// Vou explicar cada parte com comentários detalhados.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus } from 'lucide-react';
import '../assets/css/Dashboard.css';

// ============================================================
// 📦 PASSO 1: IMPORTAR OS SERVICES
// ============================================================
// Importamos a função 'get' do api.js para fazer requisições GET.
// Essa função já cuida de:
//   - Adicionar o token de autenticação
//   - Renovar o token automaticamente se expirar (refresh token)
//   - Tratar erros da API
import { get } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();

    // ============================================================
    // 📊 PASSO 2: CRIAR STATES PARA OS DADOS DA API
    // ============================================================
    // Antes usávamos dados "hardcoded" (fixos no código).
    // Agora criamos states vazios que serão preenchidos pela API.

    // Estados para controlar os períodos selecionados
    const [periodoAtendimento, setPeriodoAtendimento] = useState('30dias');
    const [periodoServicos, setPeriodoServicos] = useState('30dias');

    // Estado para o tooltip dos gráficos
    const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

    // Estado de loading - inicia como TRUE porque vamos carregar dados
    const [isLoading, setIsLoading] = useState(true);

    // ⭐ NOVOS STATES para armazenar dados da API:
    const [stats, setStats] = useState({
        totalAtendimentos: 0,
        novosAgricultores: 0,
        documentosVencendo: 0
    });

    const [dadosAtendimentoSetor, setDadosAtendimentoSetor] = useState([]);
    const [dadosServicos, setDadosServicos] = useState([]);
    const [documentosVencendo, setDocumentosVencendo] = useState([]);

    // ============================================================
    // 🔄 PASSO 3: CRIAR FUNÇÕES PARA BUSCAR DADOS DA API
    // ============================================================
    // Cada função busca um tipo de dado específico.
    // Usamos try/catch para tratar erros sem quebrar a aplicação.

    /**
     * Busca os dados de atendimentos por setor
     * Endpoint: GET /dashboard/sector
     */
    const loadDadosSetor = async () => {
        try {
            // A função 'get' faz um GET para o endpoint
            // Ela já adiciona o token automaticamente!
            const response = await get('/dashboard/sector');

            // Verifica se a resposta tem os dados esperados
            if (response && response.sectors) {
                // Mapeia os dados da API para o formato que usamos no gráfico
                const dados = response.sectors.map(item => ({
                    setor: item.name || item.sectorName,
                    valor: item.count || item.total || 0,
                    // Calcula o percentual baseado no maior valor
                    percentual: 0 // Será calculado depois
                }));

                // Calcula o percentual relativo ao maior valor
                const maxValor = Math.max(...dados.map(d => d.valor), 1);
                dados.forEach(d => {
                    d.percentual = Math.round((d.valor / maxValor) * 100);
                });

                setDadosAtendimentoSetor(dados);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de setor:', error);
            // Se der erro, mantém array vazio - não quebra a página
        }
    };

    /**
     * Busca os dados de serviços mais solicitados
     * Endpoint: GET /dashboard/servicetype
     */
    const loadDadosServicos = async () => {
        try {
            const response = await get('/dashboard/servicetype');

            if (response && response.serviceTypes) {
                const dados = response.serviceTypes.map(item => ({
                    servico: item.name || item.serviceTypeName,
                    valor: item.count || item.total || 0,
                    percentual: 0
                }));

                const maxValor = Math.max(...dados.map(d => d.valor), 1);
                dados.forEach(d => {
                    d.percentual = Math.round((d.valor / maxValor) * 100);
                });

                setDadosServicos(dados);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de serviços:', error);
        }
    };

    /**
     * Busca os dados de documentos vencendo
     * Endpoint: GET /dashboard/document
     */
    const loadDocumentosVencendo = async () => {
        try {
            const response = await get('/dashboard/document');

            if (response && response.documents) {
                const docs = response.documents.map(doc => ({
                    id: doc.id,
                    agricultor: doc.farmerName || doc.farmer?.name || '-',
                    documento: doc.name || doc.documentType || '-',
                    vencimento: formatDate(doc.expirationDate || doc.dueDate),
                    acoes: 'Ver'
                }));

                setDocumentosVencendo(docs);

                // Atualiza o contador de documentos vencendo
                setStats(prev => ({
                    ...prev,
                    documentosVencendo: docs.length
                }));
            }
        } catch (error) {
            console.error('Erro ao carregar documentos:', error);
        }
    };

    /**
     * Busca estatísticas gerais
     * Endpoint: GET /dashboard/accountants
     * 
     * Resposta da API:
     * - numberOfServicesProvided: total de serviços realizados
     * - numberOfServicesProvidedThisMonth: serviços realizados este mês
     * - numberOfExpiredDocuments: documentos expirados
     * - numberOfDocumentsExpiringThisMonth: documentos vencendo este mês
     * - numberOfFarmers: total de agricultores
     * - numberOfFarmersThisMonth: novos agricultores este mês
     */
    const loadStats = async () => {
        try {
            const response = await get('/dashboard/accountants');

            console.log('📊 RESPOSTA /dashboard/accountants:', response);

            if (response) {
                setStats({
                    // Total de atendimentos/serviços realizados
                    totalAtendimentos: response.numberOfServicesProvided || 0,

                    // Novos agricultores este mês (ou total se não tiver o campo mensal)
                    novosAgricultores: response.numberOfFarmersThisMonth || response.numberOfFarmers || 0,

                    // Documentos vencendo este mês
                    documentosVencendo: response.numberOfDocumentsExpiringThisMonth || response.numberOfExpiredDocuments || 0
                });
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    // ============================================================
    // 🚀 PASSO 4: CHAMAR AS FUNÇÕES QUANDO O COMPONENTE CARREGA
    // ============================================================
    // O useEffect com array vazio [] executa apenas uma vez,
    // quando o componente é montado na tela.

    useEffect(() => {
        // Função assíncrona para carregar todos os dados
        const loadAllData = async () => {
            // Promise.all executa todas as chamadas em PARALELO
            // Isso é mais rápido que fazer uma de cada vez!
            await Promise.all([
                loadStats(),
                loadDadosSetor(),
                loadDadosServicos(),
                loadDocumentosVencendo()
            ]);

            // Só depois que TODOS os dados carregarem,
            // removemos o loading
            setIsLoading(false);
        };

        loadAllData();
    }, []); // Array vazio = executa só uma vez

    // ============================================================
    // 🛠️ FUNÇÕES AUXILIARES
    // ============================================================

    // Formata data para o padrão brasileiro
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Handlers para o tooltip dos gráficos
    const handleMouseEnter = (e, label, valor) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            show: true,
            content: `${label}: ${valor} atendimentos`,
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ ...tooltip, show: false });
    };

    // ============================================================
    // ⏳ TELA DE LOADING
    // ============================================================
    // Enquanto isLoading for true, mostra o spinner

    if (isLoading) {
        return (
            <div className="dashboard-content" role="main" aria-busy="true">
                <div className="loading-container">
                    <div className="spinner" role="status" aria-label="Carregando dashboard"></div>
                    <p>Carregando dados...</p>
                </div>
            </div>
        );
    }

    // ============================================================
    // 🎨 PASSO 5: USAR OS DADOS DA API NO JSX
    // ============================================================
    // Onde antes tinha dados fixos, agora usamos os states

    return (
        <div className="dashboard-content" role="main">
            <h1 className="page-title">Dashboard</h1>

            {/* Tooltip */}
            {tooltip.show && (
                <div
                    className="tooltip"
                    style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
                    role="tooltip"
                >
                    {tooltip.content}
                </div>
            )}

            {/* Botões de Ação */}
            <div className="action-buttons">
                <button
                    className="btn-white"
                    aria-label="Registrar novo atendimento"
                    onClick={() => navigate('/atendimentos')}
                >
                    <Plus size={20} aria-hidden="true" />
                    Registrar atendimento
                </button>
                <button
                    className="btn-white"
                    aria-label="Cadastrar novo agricultor no sistema"
                    onClick={() => navigate('/agricultores', { state: { openCadastro: true } })}
                >
                    <UserPlus size={20} aria-hidden="true" />
                    Cadastrar novo agricultor
                </button>
            </div>

            {/* Cards de Estatísticas - AGORA COM DADOS DA API! */}
            <div className="stats-grid">
                <div className="card stat-card">
                    <span>Total de atendimentos</span>
                    {/* Antes: <strong>128</strong> (valor fixo) */}
                    {/* Agora: usa o valor do state */}
                    <strong>{stats.totalAtendimentos}</strong>
                </div>
                <div className="card stat-card">
                    <span>Novos agricultores (MÊS)</span>
                    <strong>{String(stats.novosAgricultores).padStart(2, '0')}</strong>
                </div>
                <div className="card stat-card border-red">
                    <span className="text-red">Documentos Vencendo</span>
                    <strong className="text-red">{String(stats.documentosVencendo).padStart(2, '0')}</strong>
                </div>
            </div>

            {/* Gráficos - AGORA COM DADOS DA API! */}
            <div className="charts-grid">
                {/* Gráfico 1 - Atendimento por Setor */}
                <div className="card chart-card">
                    <div className="chart-header-block">
                        <h3 id="chart1-title">Atendimento por setor</h3>
                        <div className="chart-toggles" role="group" aria-label="Selecionar período">
                            <button
                                className={periodoAtendimento === '30dias' ? 'active' : ''}
                                onClick={() => setPeriodoAtendimento('30dias')}
                                aria-pressed={periodoAtendimento === '30dias'}
                            >
                                30 dias
                            </button>
                            <button
                                className={periodoAtendimento === '1ano' ? 'active' : ''}
                                onClick={() => setPeriodoAtendimento('1ano')}
                                aria-pressed={periodoAtendimento === '1ano'}
                            >
                                1 ano
                            </button>
                        </div>
                    </div>

                    <div className="chart-body" role="img" aria-labelledby="chart1-title">
                        <div className="y-axis" aria-hidden="true">
                            <span>Acima de 10<br />atendimentos</span>
                            <span>Igual a 10<br />atendimentos</span>
                            <span>Abaixo de 10<br />atendimentos</span>
                        </div>
                        <div className="bars-container bg-lines">
                            {/* 
                              Antes: dadosAtendimentoSetor[periodoAtendimento].map(...)
                              Agora: dadosAtendimentoSetor.map(...) 
                              (o state já é um array)
                            */}
                            {dadosAtendimentoSetor.length > 0 ? (
                                dadosAtendimentoSetor.map((item, index) => (
                                    <div className="bar-group" key={index}>
                                        <div
                                            className={`bar ${index % 2 === 1 ? 'light' : ''}`}
                                            style={{ height: `${item.percentual}%` }}
                                            onMouseEnter={(e) => handleMouseEnter(e, item.setor, item.valor)}
                                            onMouseLeave={handleMouseLeave}
                                            role="img"
                                            aria-label={`${item.setor}: ${item.valor} atendimentos`}
                                            tabIndex="0"
                                        ></div>
                                        <span className="label">{item.setor}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">Nenhum dado disponível</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gráfico 2 - Serviços mais Solicitados */}
                <div className="card chart-card">
                    <div className="chart-header-block">
                        <h3 id="chart2-title">Serviços mais Solicitados</h3>
                        <div className="chart-toggles" role="group" aria-label="Selecionar período">
                            <button
                                className={periodoServicos === '30dias' ? 'active' : ''}
                                onClick={() => setPeriodoServicos('30dias')}
                                aria-pressed={periodoServicos === '30dias'}
                            >
                                30 dias
                            </button>
                            <button
                                className={periodoServicos === '1ano' ? 'active' : ''}
                                onClick={() => setPeriodoServicos('1ano')}
                                aria-pressed={periodoServicos === '1ano'}
                            >
                                1 ano
                            </button>
                        </div>
                    </div>

                    <div className="chart-body" role="img" aria-labelledby="chart2-title">
                        <div className="y-axis" aria-hidden="true">
                            <span>Acima de 10<br />atendimentos</span>
                            <span>Igual a 10<br />atendimentos</span>
                            <span>Abaixo de 10<br />atendimentos</span>
                        </div>
                        <div className="bars-container bg-lines">
                            {dadosServicos.length > 0 ? (
                                dadosServicos.map((item, index) => (
                                    <div className="bar-group" key={index}>
                                        <div
                                            className={`bar ${index % 2 === 1 ? 'light' : ''}`}
                                            style={{ height: `${item.percentual}%` }}
                                            onMouseEnter={(e) => handleMouseEnter(e, item.servico, item.valor)}
                                            onMouseLeave={handleMouseLeave}
                                            role="img"
                                            aria-label={`${item.servico}: ${item.valor} atendimentos`}
                                            tabIndex="0"
                                        ></div>
                                        <span className="label">{item.servico}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">Nenhum dado disponível</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela de Alerta - AGORA COM DADOS DA API! */}
            <div className="card table-card">
                <h3>Alerta de vencimento</h3>
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Agricultor</th>
                                <th>Documento</th>
                                <th>Data de Vencimento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentosVencendo.length > 0 ? (
                                documentosVencendo.map((row, index) => (
                                    <tr key={row.id || index}>
                                        <td>{row.agricultor}</td>
                                        <td>{row.documento}</td>
                                        <td>{row.vencimento}</td>
                                        <td>
                                            <a
                                                href="#"
                                                className="action-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // Aqui você pode navegar para detalhes
                                                    console.log('Ver documento:', row.id);
                                                }}
                                            >
                                                {row.acoes}
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>
                                        Nenhum documento próximo do vencimento
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

// ============================================================
// 📝 RESUMO DO QUE FOI FEITO:
// ============================================================
//
// 1. IMPORTAMOS o service 'get' do api.js
//
// 2. CRIAMOS STATES para armazenar os dados da API:
//    - stats (totais/contadores)
//    - dadosAtendimentoSetor (gráfico 1)
//    - dadosServicos (gráfico 2)
//    - documentosVencendo (tabela)
//
// 3. CRIAMOS FUNÇÕES para buscar cada tipo de dado:
//    - loadStats() -> GET /dashboard/accountants
//    - loadDadosSetor() -> GET /dashboard/sector
//    - loadDadosServicos() -> GET /dashboard/servicetype
//    - loadDocumentosVencendo() -> GET /dashboard/document
//
// 4. USAMOS useEffect para carregar os dados quando a página abre
//    - Promise.all() carrega tudo em paralelo (mais rápido!)
//
// 5. SUBSTITUÍMOS os dados fixos pelos states no JSX
//
// ============================================================