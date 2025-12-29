import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * FarmerForm - Componente de formulário para cadastro/edição de agricultor
 * 
 * Props:
 * - formData: objeto com dados do formulário
 * - setFormData: função para atualizar formData
 * - conjuge: objeto com dados do cônjuge
 * - setConjuge: função para atualizar conjuge
 * - editingId: ID do agricultor em edição (null se novo)
 * - cpfError: estado de validação do CPF ('valido', 'invalido', null)
 * - cpfConjugeError: estado de validação do CPF do cônjuge
 * - cepError: estado de validação do CEP
 * - loadingCep: boolean indicando busca de CEP
 * - estadosBrasileiros: array com estados
 * - isSaving: boolean indicando salvamento em progresso
 * - onSave: função chamada ao salvar
 * - onCancel: função chamada ao cancelar/limpar
 * - onFieldChange: função para mudança de campos
 * - onConjugeChange: função para mudança de campos do cônjuge
 */
const FarmerForm = ({
    formData,
    setFormData,
    conjuge,
    setConjuge,
    editingId,
    cpfError,
    cpfConjugeError,
    cepError,
    loadingCep,
    estadosBrasileiros,
    isSaving,
    onSave,
    onCancel,
    onFieldChange,
    onConjugeChange
}) => {
    return (
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
                            onChange={onFieldChange}
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
                                onChange={onFieldChange}
                                maxLength={14}
                            />
                            {cpfError === 'invalido' && <span className="error-msg">CPF Inválido</span>}
                            {cpfError === 'valido' && <span className="success-msg">CPF Válido</span>}
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
                                onChange={onFieldChange}
                            />
                        </div>
                        <div className="form-group half-width">
                            <label>Matrícula</label>
                            <input
                                type="text"
                                name="matricula"
                                className="form-input"
                                value={formData.matricula}
                                onChange={onFieldChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half-width">
                            <label>Estado Civil</label>
                            <select
                                name="estadoCivil"
                                className="form-input form-select"
                                value={formData.estadoCivil}
                                onChange={onFieldChange}
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
                                onChange={onFieldChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half-width">
                            <label>Situação</label>
                            <select
                                name="isAlive"
                                className="form-input form-select"
                                value={formData.isAlive}
                                onChange={(e) => setFormData({ ...formData, isAlive: e.target.value === 'true' })}
                            >
                                <option value="true">Vivo</option>
                                <option value="false">Falecido</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Seção do Cônjuge - Condicional */}
                {formData.estadoCivil === 'Casado(a)' && (
                    <div className="form-section">
                        <h3 className="section-title">Dados do Cônjuge</h3>

                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>Nome Completo do Cônjuge</label>
                                <input
                                    type="text"
                                    name="nome"
                                    className="form-input"
                                    value={conjuge.nome}
                                    onChange={onConjugeChange}
                                />
                            </div>
                            <div className="form-group half-width">
                                <label>CPF do Cônjuge</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    className={`form-input ${cpfConjugeError === 'valido' ? 'input-success' : cpfConjugeError === 'invalido' ? 'input-error' : ''}`}
                                    placeholder="000.000.000-00"
                                    value={conjuge.cpf}
                                    onChange={onConjugeChange}
                                    maxLength={14}
                                />
                                {cpfConjugeError === 'invalido' && <span className="error-msg">CPF Inválido</span>}
                                {cpfConjugeError === 'valido' && <span className="success-msg">CPF Válido</span>}
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
                            <input
                                type="text"
                                name="telefone"
                                className="form-input"
                                placeholder="(00) 00000-0000"
                                value={formData.telefone}
                                onChange={onFieldChange}
                                maxLength={15}
                            />
                        </div>
                        <div className="form-group half-width">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="email@exemplo.com"
                                value={formData.email}
                                onChange={onFieldChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half-width">
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

                {/* Endereço */}
                <div className="form-section no-border">
                    <h3 className="section-title">Endereço</h3>

                    {/* Linha 1: CEP | Número */}
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
                                    onChange={onFieldChange}
                                    maxLength={9}
                                />
                                {loadingCep && (
                                    <Loader2 className="cep-loading-icon" size={18} />
                                )}
                            </div>
                            {cepError && cepError !== 'valido' && <span className="error-msg">{cepError}</span>}
                            {cepError === 'valido' && <span className="success-msg">CEP encontrado!</span>}
                        </div>
                        <div className="form-group">
                            <label>Número</label>
                            <input
                                type="text"
                                name="numero"
                                className="form-input"
                                placeholder="Nº"
                                value={formData.numero}
                                onChange={onFieldChange}
                            />
                        </div>
                    </div>

                    {/* Linha 2: Ponto de Referência */}
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Ponto de Referência</label>
                            <input
                                type="text"
                                name="pontoReferencia"
                                className="form-input"
                                placeholder="Próximo a..."
                                value={formData.pontoReferencia}
                                onChange={onFieldChange}
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
                                onChange={onFieldChange}
                            />
                        </div>
                        <div className="form-group third-width">
                            <label>Cidade</label>
                            <input
                                type="text"
                                name="cidade"
                                className="form-input"
                                value={formData.cidade}
                                onChange={onFieldChange}
                            />
                        </div>
                        <div className="form-group third-width">
                            <label>Estado</label>
                            <select
                                name="estado"
                                className="form-input form-select"
                                value={formData.estado}
                                onChange={onFieldChange}
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

                {/* Footer com botões */}
                <div className="form-footer">
                    <button
                        type="button"
                        className="btn-outline-gray"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        {editingId ? 'Cancelar' : 'Limpar'}
                    </button>
                    <button
                        type="button"
                        className="btn-solid-green"
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            editingId ? 'Atualizar Cadastro' : 'Salvar Cadastro'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FarmerForm;
