import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Calendar, Printer, Filter, Search, Eye } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import '../assets/css/Relatorio.css';
import Toast from '../components/Toast';

const Relatorio = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [activeReport, setActiveReport] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Filtros
    const [filters, setFilters] = useState({
        dataInicio: '',
        dataFim: '',
        tipo: 'atendimentos',
        setor: ''
    });

    // Tipos de relatórios disponíveis
    const reportTypes = [
        {
            id: 'atendimentos',
            title: 'Atendimentos por período',
            description: 'Gera uma lista de todos os atendimentos realizados entre duas datas.',
            icon: <Calendar size={24} />
        },
        {
            id: 'agricultores',
            title: 'Agricultores cadastrados',
            description: 'Lista de agricultores cadastrados no sistema com status da matrícula.',
            icon: <FileText size={24} />
        },
        {
            id: 'servicos',
            title: 'Serviços mais solicitados',
            description: 'Ranking dos serviços mais demandados pelos agricultores.',
            icon: <Filter size={24} />
        }
    ];

    // Dados simulados de atendimentos para o relatório
    const atendimentosData = [
        { id: 1, data: '04/12/2025', agricultor: 'Francisco Antônio da Silva', servico: 'Emissão de DAP', setor: 'Presidência', status: 'Concluído' },
        { id: 2, data: '03/12/2025', agricultor: 'Maria Fernanda Costa', servico: 'Consulta Jurídica', setor: 'Jurídico', status: 'Em Andamento' },
        { id: 3, data: '01/12/2025', agricultor: 'Caio Tiberius Mourão', servico: 'Solicitação de Benefício', setor: 'Financeiro', status: 'Pendente' },
        { id: 4, data: '28/11/2025', agricultor: 'Ana Clara Sousa', servico: 'Atualização Cadastral', setor: 'Secretaria', status: 'Concluído' },
        { id: 5, data: '25/11/2025', agricultor: 'José Pedro Alves', servico: 'Emissão de Boleto', setor: 'Financeiro', status: 'Concluído' },
    ];

    // Toast functions
    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    // Simular carregamento inicial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSelectReport = (reportId) => {
        setActiveReport(reportId);
        setReportData([]);
    };

    const handleGenerateReport = () => {
        if (!filters.dataInicio || !filters.dataFim) {
            showToast('Por favor, selecione as datas de início e fim.', 'warning');
            return;
        }

        setIsGenerating(true);

        // Simular geração de relatório
        setTimeout(() => {
            setReportData(atendimentosData);
            setIsGenerating(false);
            showToast('Relatório gerado com sucesso!', 'success');
        }, 1500);
    };

    const handlePrint = () => {
        if (reportData.length === 0) {
            showToast('Gere um relatório primeiro para imprimir.', 'warning');
            return;
        }

        const selectedReport = reportTypes.find(r => r.id === activeReport);

        const windowPrint = window.open('', '', 'width=1000,height=600');
        windowPrint.document.write(`
            <html>
                <head>
                    <title>Relatório - ${selectedReport?.title || 'Relatório'}</title>
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
                        .info-row {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 20px;
                            padding: 10px;
                            background: #f5f5f5;
                            border-radius: 8px;
                        }
                        .info-row span {
                            font-size: 14px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th {
                            background-color: #4a8b58;
                            color: white;
                            padding: 12px 8px;
                            text-align: left;
                            font-size: 12px;
                        }
                        td {
                            padding: 10px 8px;
                            border-bottom: 1px solid #eee;
                            font-size: 12px;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                        .footer {
                            margin-top: 40px;
                            text-align: center;
                            color: #888;
                            font-size: 12px;
                            border-top: 1px solid #eee;
                            padding-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>SINDICATO DOS TRABALHADORES RURAIS</h1>
                        <p>${selectedReport?.title || 'Relatório'}</p>
                    </div>
                    
                    <div class="info-row">
                        <span><strong>Período:</strong> ${filters.dataInicio} a ${filters.dataFim}</span>
                        <span><strong>Total de registros:</strong> ${reportData.length}</span>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Agricultor</th>
                                <th>Serviço</th>
                                <th>Setor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.map(item => `
                                <tr>
                                    <td>${item.data}</td>
                                    <td>${item.agricultor}</td>
                                    <td>${item.servico}</td>
                                    <td>${item.setor}</td>
                                    <td>${item.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
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

        showToast('Relatório enviado para impressão!', 'success');
    };

    const handleExportPDF = () => {
        if (reportData.length === 0) {
            showToast('Gere um relatório primeiro para exportar.', 'warning');
            return;
        }

        const selectedReport = reportTypes.find(r => r.id === activeReport);

        // Criar elemento temporário com o conteúdo do relatório
        const element = document.createElement('div');
        element.innerHTML = `
            <div style="font-family: 'Segoe UI', Tahoma, sans-serif; padding: 20px; color: #333;">
                <div style="text-align: center; border-bottom: 2px solid #4a8b58; padding-bottom: 15px; margin-bottom: 20px;">
                    <h1 style="color: #4a8b58; font-size: 20px; margin: 0 0 5px 0;">SINDICATO DOS TRABALHADORES RURAIS</h1>
                    <p style="color: #666; font-size: 14px; margin: 0;">${selectedReport?.title || 'Relatório'}</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 6px;">
                    <span style="font-size: 12px;"><strong>Período:</strong> ${filters.dataInicio} a ${filters.dataFim}</span>
                    <span style="font-size: 12px;"><strong>Total:</strong> ${reportData.length} registros</span>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr>
                            <th style="background-color: #4a8b58; color: white; padding: 10px 6px; text-align: left; font-size: 11px;">Data</th>
                            <th style="background-color: #4a8b58; color: white; padding: 10px 6px; text-align: left; font-size: 11px;">Agricultor</th>
                            <th style="background-color: #4a8b58; color: white; padding: 10px 6px; text-align: left; font-size: 11px;">Serviço</th>
                            <th style="background-color: #4a8b58; color: white; padding: 10px 6px; text-align: left; font-size: 11px;">Setor</th>
                            <th style="background-color: #4a8b58; color: white; padding: 10px 6px; text-align: left; font-size: 11px;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportData.map((item, index) => `
                            <tr style="background-color: ${index % 2 === 0 ? '#fff' : '#f9f9f9'};">
                                <td style="padding: 8px 6px; border-bottom: 1px solid #eee; font-size: 11px;">${item.data}</td>
                                <td style="padding: 8px 6px; border-bottom: 1px solid #eee; font-size: 11px;">${item.agricultor}</td>
                                <td style="padding: 8px 6px; border-bottom: 1px solid #eee; font-size: 11px;">${item.servico}</td>
                                <td style="padding: 8px 6px; border-bottom: 1px solid #eee; font-size: 11px;">${item.setor}</td>
                                <td style="padding: 8px 6px; border-bottom: 1px solid #eee; font-size: 11px;">${item.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="margin-top: 30px; text-align: center; color: #888; font-size: 10px; border-top: 1px solid #eee; padding-top: 15px;">
                    <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                </div>
            </div>
        `;

        // Configurações do PDF
        const opt = {
            margin: 10,
            filename: `relatorio_${filters.tipo}_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Gerar e baixar PDF
        html2pdf().set(opt).from(element).save().then(() => {
            showToast('PDF baixado com sucesso!', 'success');
        }).catch(() => {
            showToast('Erro ao gerar PDF.', 'error');
        });
    };

    // Tela de carregamento
    if (isLoading) {
        return (
            <div className="relatorio-content" role="main" aria-busy="true">
                <div className="loading-container">
                    <div className="spinner" role="status" aria-label="Carregando dados"></div>
                    <p>Carregando relatórios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relatorio-content">
            {/* Toast Notification */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />

            <h1 className="page-title">Relatórios</h1>

            <div className="relatorio-container">
                {/* Lista de Tipos de Relatório */}
                {!activeReport && (
                    <div className="report-types-grid fade-in">
                        {reportTypes.map((report) => (
                            <div
                                key={report.id}
                                className="report-card"
                                onClick={() => handleSelectReport(report.id)}
                            >
                                <div className="report-card-icon">
                                    {report.icon}
                                </div>
                                <div className="report-card-info">
                                    <h3>{report.title}</h3>
                                    <p>{report.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Formulário de Filtros */}
                {activeReport && (
                    <div className="main-card fade-in">
                        <div className="report-header">
                            <div className="report-header-info">
                                <h2>{reportTypes.find(r => r.id === activeReport)?.title}</h2>
                                <p>{reportTypes.find(r => r.id === activeReport)?.description}</p>
                            </div>
                            <button
                                className="btn-outline-gray"
                                onClick={() => {
                                    setActiveReport(null);
                                    setReportData([]);
                                }}
                            >
                                Voltar
                            </button>
                        </div>

                        <div className="filters-section">
                            <h3 className="section-title">Filtros</h3>
                            <div className="filters-grid">
                                <div className="form-group">
                                    <label>Data Início</label>
                                    <input
                                        type="date"
                                        name="dataInicio"
                                        className="form-input"
                                        value={filters.dataInicio}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Data Fim</label>
                                    <input
                                        type="date"
                                        name="dataFim"
                                        className="form-input"
                                        value={filters.dataFim}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Setor (opcional)</label>
                                    <select
                                        name="setor"
                                        className="form-select"
                                        value={filters.setor}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Todos os setores</option>
                                        <option value="presidencia">Presidência</option>
                                        <option value="juridico">Jurídico</option>
                                        <option value="financeiro">Financeiro</option>
                                        <option value="secretaria">Secretaria</option>
                                    </select>
                                </div>
                            </div>

                            <div className="filters-actions">
                                <button
                                    className="btn-solid-green"
                                    onClick={handleGenerateReport}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="btn-spinner"></div>
                                            Gerando...
                                        </>
                                    ) : (
                                        <>
                                            <Search size={18} />
                                            Gerar Relatório
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Resultados do Relatório */}
                        {reportData.length > 0 && (
                            <div className="report-results fade-in">
                                <div className="results-header">
                                    <h3 className="section-title">Resultados ({reportData.length} registros)</h3>
                                    <div className="results-actions">
                                        <button className="btn-icon" onClick={handlePrint} title="Imprimir">
                                            <Printer size={18} />
                                        </button>
                                        <button className="btn-icon" onClick={handleExportPDF} title="Exportar PDF">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Agricultor</th>
                                                <th>Serviço</th>
                                                <th>Setor</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.map((item) => (
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
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Relatorio;