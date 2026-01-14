import { get, post, put, del } from './api';

/**
 * Filtra setores
 * @param {object} filters - { name }
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
 * @returns {Promise<object>}
 */
export async function createSector(sectorData) {
    return await post('/sector', sectorData);
}

/**
 * Atualiza um setor existente
 * @param {number} id 
 * @param {object} sectorData 
 * @returns {Promise<void>}
 */
export async function updateSector(id, sectorData) {
    return await put(`/sector/${id}`, sectorData);
}

/**
 * Deleta um setor
 * @param {number} id 
 * @returns {Promise<void>}
 */
export async function deleteSector(id) {
    return await del(`/sector/${id}`);
}
