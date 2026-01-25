import { get, post } from './api';

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
