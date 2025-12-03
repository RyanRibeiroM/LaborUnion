import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Eye, Save, Eraser } from 'lucide-react';
import '../assets/css/Agricultores.css';

const Agricultores = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('lista');
    const [busca, setBusca] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        matricula: '',
        dataCadastro: '',
        cep: '',
        rua: '',
        bairro: '',
        cidade: ''
    });

    const [cpfError, setCpfError] = useState(null);

    const dadosAgricultores = [
        { id: 1, nome: 'Francisco Antônio da Silva', cpf: '123.456.789-00', cidade: 'Crateús', status: 'Regular' },
        { id: 2, nome: 'Maria Fernanda', cpf: '987.654.321-11', cidade: 'Novo Oriente', status: 'Pendente' },
        { id: 3, nome: 'Caio Tiberius Mourão', cpf: '456.123.789-22', cidade: 'Crateús', status: 'Regular' },
        { id: 4, nome: 'Vicente Neto', cpf: '456.123.789-22', cidade: 'Crateús', status: 'Regular' },
    ];

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        let novoValor = value;

        if (name === 'cpf') novoValor = mascaraCPF(value);
        if (name === 'cep') novoValor = mascaraCEP(value);

        if (name === 'cpf') {
            if (novoValor.length === 14) { // 14 é o tamanho do CPF com pontuação
                const ehValido = validarCPF(novoValor);
                setCpfError(ehValido ? 'valido' : 'invalido');
            } else {
                setCpfError(null); // Limpa status se estiver digitando
            }
        }

        setFormData({ ...formData, [name]: novoValor });
    };

    const agricultoresFiltrados = dadosAgricultores.filter((agricultor) =>
        agricultor.nome.toLowerCase().includes(busca.toLowerCase()) ||
        agricultor.cpf.includes(busca)
    );

    // Simula carregamento de dados
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Verifica se veio do Dashboard com indicação para abrir cadastro
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
                    Cadastrar / Editar
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
                                        <th>Nome Completo</th>
                                        <th>CPF</th>
                                        <th>Cidade</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agricultoresFiltrados.map((item) => (
                                        <tr key={item.id}>
                                            <td><strong>{item.nome}</strong></td>
                                            <td>{item.cpf}</td>
                                            <td>{item.cidade}</td>
                                            <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                                            <td>
                                                <div className="action-buttons-row">
                                                    <button className="icon-btn view"><Eye size={18} /></button>
                                                    <button className="icon-btn edit"><Edit size={18} /></button>
                                                    <button className="icon-btn delete"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'cadastro' && (
                    <div className="form-container fade-in">
                        <h2 className="form-title">Cadastrar Novo Agricultor</h2>

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
                                        {/* Mensagem de Feedback do CPF */}
                                        {cpfError === 'invalido' && <span className="error-msg">CPF Inválido</span>}
                                        {cpfError === 'valido' && <span className="success-msg">CPF Válido</span>}
                                    </div>
                                    <div className="form-group half-width">
                                        <label>Data Nascimento</label>
                                        <input type="date" name="dataNascimento" className="form-input" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-section">
                                <h3 className="section-title">Dados de Contato</h3>
                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Matrícula</label>
                                        <input type="text" name="matricula" className="form-input" onChange={handleChange} />
                                    </div>
                                    <div className="form-group half-width">
                                        <label>Data Cadastro</label>
                                        <input type="date" name="dataCadastro" className="form-input" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-section no-border">
                                <h3 className="section-title">Endereço</h3>
                                <div className="form-group half-width">
                                    <label>CEP</label>
                                    <input
                                        type="text"
                                        name="cep"
                                        className="form-input"
                                        placeholder="00000-000"
                                        value={formData.cep}
                                        onChange={handleChange}
                                        maxLength={9}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Rua / Localidade</label>
                                    <input type="text" name="rua" className="form-input" onChange={handleChange} />
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Bairro</label>
                                        <input type="text" name="bairro" className="form-input" onChange={handleChange} />
                                    </div>
                                    <div className="form-group half-width">
                                        <label>Cidade</label>
                                        <input type="text" name="cidade" className="form-input" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-footer">
                                <button type="button" className="btn-outline-gray">Limpar</button>
                                <button type="button" className="btn-solid-green">Salvar Cadastro</button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Agricultores;