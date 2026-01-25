import { get, post, put, del } from './api';

/**
 * Filtra serviços/atendimentos
 * @param {object} filters
 * @returns {Promise<{services: Array}>}
 */
export async function filterServices(filters = {}) {
    return await post('/service/filter', filters);
}

/**
 * Busca um serviço/atendimento por ID
 * @param {number} id 
 * @returns {Promise<object>}
 */
export async function getServiceById(id) {
    return await get(`/service/${id}`);
}

/**
 * Cria um novo serviço/atendimento
 * @param {object} serviceData 
 * @returns {Promise<object>}
 */
export async function createService(serviceData) {
    return await post('/service', serviceData);
}

/**
 * Atualiza um serviço/atendimento existente
 * @param {number} id 
 * @param {object} serviceData 
 * @returns {Promise<void>}
 */
export async function updateService(id, serviceData) {
    return await put(`/service/${id}`, serviceData);
}

/**
 * Deleta um serviço/atendimento
 * @param {number} id 
 * @returns {Promise<void>}
 */
export async function deleteService(id) {
    return await del(`/service/${id}`);
}

/**
 * Busca tipos de serviço
 * @param {object} filters
 * @returns {Promise<object>}
 */
export async function filterServiceTypes(filters = {}) {
    return await post('/servicetype/filter', filters);
}

/**
 * Busca tipo de serviço por ID
 * @param {number} id 
 * @returns {Promise<object>}
 */
export async function getServiceTypeById(id) {
    return await get(`/servicetype/${id}`);
}

/**
 * Cria um novo tipo de serviço
 * @param {object} data - { name, description }
 * @returns {Promise<object>}
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
