import { get, post } from './api';

/**
 * Lista todos os setores
 * @param {object} filters
 * @returns {Promise<{sectors: Array}>}
 */
export async function filterSectors(filters = {}) {
    return await post('/sector/filter', filters);
}

/**
 * Busca um setor por ID
 * @param {number} id 
 * @returns {Promise<object>}
 */
export async function getSectorById(id) {
    return await get(`/sector/${id}`);
}

/**
 * Cria um novo setor
 * @param {object} sectorData
 * @returns {Promise<{name: string}>}
 */
export async function createSector(sectorData) {
    return await post('/sector', sectorData);
}
