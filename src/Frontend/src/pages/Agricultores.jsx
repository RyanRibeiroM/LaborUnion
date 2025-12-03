import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Eye, Save, Eraser, Loader2 } from 'lucide-react';
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
        { sigla: 'PB', nome: 'Para íba' },
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
    };

    const agricultoresFiltrados = dadosAgricultores.filter((agricultor) =>
        agricultor.nome.toLowerCase().includes(busca.toLowerCase()) ||
        agricultor.cpf.includes(busca)
    );

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
                                            <option value="Viúvo(a)">Viúvo(a)</option>
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
                                            {cpfConjugeError === 'invalido' && <span className="error-msg">CPF Inválido</span>}
                                            {cpfConjugeError === 'valido' && <span className="success-msg">CPF Válido</span>}
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
                                        <label>Número</label>
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
                                                    {est.sigla} - {est.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-footer">
                                <button type="button" className="btn-outline-gray" onClick={limparFormulario}>Limpar</button>
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