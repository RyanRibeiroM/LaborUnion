import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus } from 'lucide-react';
import '../assets/css/Dashboard.css';

import { get } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();

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

    // States para dados brutos da API
    const [rawDadosSetor, setRawDadosSetor] = useState([]);
    const [rawDadosServicos, setRawDadosServicos] = useState([]);

    const loadDadosSetor = async () => {
        try {
            const response = await get('/dashboard/sector');
            if (response && response.chartData) {
                setRawDadosSetor(response.chartData);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de setor:', error);
        }
    };

    const loadDadosServicos = async () => {
        try {
            const response = await get('/dashboard/servicetype');
            if (response && response.chartData) {
                setRawDadosServicos(response.chartData);
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
    useEffect(() => {
        const loadAllData = async () => {
            await Promise.all([
                loadStats(),
                loadDadosSetor(),
                loadDadosServicos(),
                loadDocumentosVencendo()
            ]);

            setIsLoading(false);
        };

        loadAllData();
    }, []);

    useEffect(() => {
        if (rawDadosSetor.length > 0) {
            const dados = rawDadosSetor.map(item => ({
                setor: item.name,
                valor: periodoAtendimento === '30dias' ? item.monthCount : item.yearCount,
                percentual: 0
            }));

            const maxValor = Math.max(...dados.map(d => d.valor), 1);
            dados.forEach(d => {
                d.percentual = Math.round((d.valor / maxValor) * 100);
            });

            setDadosAtendimentoSetor(dados);
        }
    }, [rawDadosSetor, periodoAtendimento]);

    // 🔄 Efeito para atualizar Gráfico de Serviços quando o período muda
    useEffect(() => {
        if (rawDadosServicos.length > 0) {
            const dados = rawDadosServicos.map(item => ({
                servico: item.name,
                valor: periodoServicos === '30dias' ? item.monthCount : item.yearCount,
                percentual: 0
            }));

            const maxValor = Math.max(...dados.map(d => d.valor), 1);
            dados.forEach(d => {
                d.percentual = Math.round((d.valor / maxValor) * 100);
            });

            setDadosServicos(dados);
        }
    }, [rawDadosServicos, periodoServicos]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
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

            <div className="stats-grid">
                <div className="card stat-card">
                    <span>Total de atendimentos</span>
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