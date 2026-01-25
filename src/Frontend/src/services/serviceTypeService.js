import { get, post, put, del } from './api';

/**
 * Lista todos os tipos de serviço/atendimento
 * @param {object} filters
 * @returns {Promise<{servicesTypes: Array}>}
 */
export async function filterServiceTypes(filters = {}) {
    return await post('/servicetype/filter', filters);
}

/**
 * Busca um tipo de serviço por ID
 * @param {number} id 
 * @returns {Promise<object>}
 */
export async function getServiceTypeById(id) {
    return await get(`/servicetype/${id}`);
}

/**
 * Cria um novo tipo de serviço
 * @param {object} data
 * @returns {Promise<{name: string}>}
 */
export async function createServiceType(data) {
    return await post('/servicetype', data);
}

/**
 * Atualiza um tipo de serviço existente
 * @param {number} id 
 * @param {object} data 
 * @returns {Promise<void>}
 */
export async function updateServiceType(id, data) {
    return await put(`/servicetype/${id}`, data);
}

/**
 * Deleta um tipo de serviço
 * @param {number} id 
 * @returns {Promise<void>}
 */
export async function deleteServiceType(id) {
    return await del(`/servicetype/${id}`);
}
