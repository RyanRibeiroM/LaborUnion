import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus } from 'lucide-react';
import '../assets/css/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const [periodoAtendimento, setPeriodoAtendimento] = useState('30dias');
    const [periodoServicos, setPeriodoServicos] = useState('30dias');

    const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

    const [isLoading, setIsLoading] = useState(true);

    const dadosAtendimentoSetor = {
        '30dias': [
            { setor: 'Agricultura', valor: 16, percentual: 80 },
            { setor: 'Pecuária', valor: 12, percentual: 60 },
            { setor: 'Serviços Rurais', valor: 10, percentual: 50 },
            { setor: 'Agroindústria Rural', valor: 9, percentual: 45 }
        ],
        '1ano': [
            { setor: 'Agricultura', valor: 145, percentual: 85 },
            { setor: 'Pecuária', valor: 98, percentual: 65 },
            { setor: 'Serviços Rurais', valor: 76, percentual: 55 },
            { setor: 'Agroindústria Rural', valor: 52, percentual: 40 }
        ]
    };

    const dadosServicos = {
        '30dias': [
            { servico: 'Emissão', valor: 17, percentual: 85 },
            { servico: 'Assessoria jurídica', valor: 14, percentual: 70 },
            { servico: 'Assistência técnica', valor: 12, percentual: 60 },
            { servico: 'Benefícios', valor: 10, percentual: 50 }
        ],
        '1ano': [
            { servico: 'Emissão', valor: 168, percentual: 90 },
            { servico: 'Assessoria jurídica', valor: 132, percentual: 75 },
            { servico: 'Assistência técnica', valor: 98, percentual: 65 },
            { servico: 'Benefícios', valor: 85, percentual: 55 }
        ]
    };

    const tableData = [
        { agricultor: 'Francisco Antônio', documento: 'Ata de Posse', vencimento: '10/12/2025', acoes: 'Ver' },
        { agricultor: 'Maria Fernanda', documento: 'Ata de Posse', vencimento: '10/12/2025', acoes: 'Ver' },
        { agricultor: 'Caio Tiberius', documento: 'Ata de Posse', vencimento: '10/12/2025', acoes: 'Ver' },
        { agricultor: 'Francisco Ryan', documento: 'Ata de Posse', vencimento: '10/12/2025', acoes: 'Ver' },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

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

            {/* Botoes de Ação */}
            <div className="action-buttons">
                <button
                    className="btn-white"
                    aria-label="Registrar novo atendimento"
                    onClick={() => console.log('Registrar atendimento')}
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

            {/* Cards de Estatísticas */}
            <div className="stats-grid">
                <div className="card stat-card">
                    <span>Total de atendimentos</span>
                    <strong>128</strong>
                </div>
                <div className="card stat-card">
                    <span>Novos agricultores (MÊS)</span>
                    <strong>07</strong>
                </div>
                <div className="card stat-card border-red">
                    <span className="text-red">Documentos Vencendo</span>
                    <strong className="text-red">07</strong>
                </div>
            </div>

            {/* Gráficos */}
            <div className="charts-grid">
                {/* Gráfico 1 */}
                <div className="card chart-card">
                    <div className="chart-header-block">
                        <h3 id="chart1-title">Atendimento por setor</h3>
                        <div className="chart-toggles" role="group" aria-label="Selecionar período">
                            <button
                                className={periodoAtendimento === '30dias' ? 'active' : ''}
                                onClick={() => setPeriodoAtendimento('30dias')}
                                aria-pressed={periodoAtendimento === '30dias'}
                                aria-label="Visualizar dados dos últimos 30 dias"
                            >
                                30 dias
                            </button>
                            <button
                                className={periodoAtendimento === '1ano' ? 'active' : ''}
                                onClick={() => setPeriodoAtendimento('1ano')}
                                aria-pressed={periodoAtendimento === '1ano'}
                                aria-label="Visualizar dados do último ano"
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
                            {dadosAtendimentoSetor[periodoAtendimento].map((item, index) => (
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
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gráfico 2 */}
                <div className="card chart-card">
                    <div className="chart-header-block">
                        <h3 id="chart2-title">Serviços mais Solicitados</h3>
                        <div className="chart-toggles" role="group" aria-label="Selecionar período">
                            <button
                                className={periodoServicos === '30dias' ? 'active' : ''}
                                onClick={() => setPeriodoServicos('30dias')}
                                aria-pressed={periodoServicos === '30dias'}
                                aria-label="Visualizar dados dos últimos 30 dias"
                            >
                                30 dias
                            </button>
                            <button
                                className={periodoServicos === '1ano' ? 'active' : ''}
                                onClick={() => setPeriodoServicos('1ano')}
                                aria-pressed={periodoServicos === '1ano'}
                                aria-label="Visualizar dados do último ano"
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
                            {dadosServicos[periodoServicos].map((item, index) => (
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela de Alerta */}
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
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.agricultor}</td>
                                    <td>{row.documento}</td>
                                    <td>{row.vencimento}</td>
                                    <td><a href="#" className="action-link">{row.acoes}</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;