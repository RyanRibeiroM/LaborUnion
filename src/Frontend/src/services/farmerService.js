import { get, post, put, del } from './api';

/**
 * Marital Status enum mapping
 * API uses: 1 = Solteiro, 2 = Casado, 3 = Divorciado, 4 = Viúvo
 */
export const MaritalStatus = {
    'Solteiro(a)': 1,
    'Casado(a)': 2,
    'Divorciado(a)': 3,
    'Viuvo(a)': 4
};

export const MaritalStatusLabels = {
    1: 'Solteiro(a)',
    2: 'Casado(a)',
    3: 'Divorciado(a)',
    4: 'Viuvo(a)'
};

/**
 * Lista agricultores com filtros
 * @param {object} filters - { name, cpf, registration, addressCity, profission, maritalStatus, spouseName, isAlive }
 * @returns {Promise<{farmers: Array}>}
 */
export async function filterFarmers(filters = {}) {
    return await post('/farmer/filter', filters);
}

/**
 * Busca um agricultor por ID
 * @param {number} id 
 * @returns {Promise<object>}
 */
export async function getFarmerById(id) {
    return await get(`/farmer/${id}`);
}

/**
 * Cria um novo agricultor
 * @param {object} farmerData 
 * @returns {Promise<{name: string}>}
 */
export async function createFarmer(farmerData) {
    return await post('/farmer', farmerData);
}

/**
 * Atualiza um agricultor existente
 * @param {number} id 
 * @param {object} farmerData 
 * @returns {Promise<void>}
 */
export async function updateFarmer(id, farmerData) {
    return await put(`/farmer/${id}`, farmerData);
}

/**
 * Deleta um agricultor
 * @param {number} id 
 * @returns {Promise<void>}
 */
export async function deleteFarmer(id) {
    return await del(`/farmer/${id}`);
}

/**
 * Converte dados do formulário frontend para o formato da API
 */
export function formToApiData(formData, conjuge) {
    // Remove máscara do CPF
    const cleanCpf = (cpf) => {
        if (!cpf) return null;
        const cleaned = cpf.replace(/\D/g, '');
        return cleaned.length === 11 ? cleaned : null;
    };

    const cleanPhone = (phone) => {
        if (!phone) return null;
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 ? cleaned : null;
    };

    const cleanCep = (cep) => {
        if (!cep) return null;
        const cleaned = cep.replace(/\D/g, '');
        return cleaned.length === 8 ? cleaned : null;
    };

    // Formata data para YYYY-MM-DD
    const formatDate = (date) => {
        if (!date) return null;
        return date;
    };

    return {
        name: formData.nome || null,
        email: formData.email || null,
        cpf: cleanCpf(formData.cpf),
        registration: formData.matricula || null,
        phone: cleanPhone(formData.telefone),
        profession: formData.profissao || null,
        maritalStatus: formData.estadoCivil ? MaritalStatus[formData.estadoCivil] : 1,
        spouseName: conjuge?.nome || null,
        spouseCpf: cleanCpf(conjuge?.cpf),
        birthDate: formatDate(formData.dataNascimento),
        isAlive: formData.isAlive !== undefined ? formData.isAlive : true,
        addressNumber: formData.numero || null,
        addressNeighborhood: formData.bairro || null,
        addressCity: formData.cidade || null,
        addressUf: formData.estado || null,
        addressCep: cleanCep(formData.cep),
        addressReference: formData.pontoReferencia || null
    };
}

/**
 * Converte dados da API para o formato do formulário frontend
 */
export function apiToFormData(apiData) {
    // Adiciona máscara ao CPF
    const formatCpf = (cpf) => {
        if (!cpf) return '';
        const cleaned = cpf.replace(/\D/g, '');
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatPhone = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const formatCep = (cep) => {
        if (!cep) return '';
        const cleaned = cep.replace(/\D/g, '');
        return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    return {
        id: apiData.id,
        nome: apiData.name || '',
        cpf: formatCpf(apiData.cpf),
        dataNascimento: apiData.birthDate || '',
        estadoCivil: apiData.maritalStatus ? MaritalStatusLabels[apiData.maritalStatus] : '',
        profissao: apiData.profession || '',
        matricula: apiData.registration || '',
        telefone: formatPhone(apiData.phone),
        email: apiData.email || '',
        dataCadastro: apiData.createdOn ? apiData.createdOn.split('T')[0] : '',
        cep: formatCep(apiData.addressCep),
        numero: apiData.addressNumber || '',
        pontoReferencia: apiData.addressReference || '',
        bairro: apiData.addressNeighborhood || '',
        cidade: apiData.addressCity || '',
        estado: apiData.addressUf || '',
        isAlive: apiData.isAlive !== undefined ? apiData.isAlive : true,
        conjuge: apiData.spouseName ? {
            nome: apiData.spouseName,
            cpf: formatCpf(apiData.spouseCpf)
        } : null
    };
}
