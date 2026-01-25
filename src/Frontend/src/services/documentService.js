
import { get, post, put, del } from './api';

/**
 * Filtra documentos
 * @param {object} filters
 * @returns {Promise<object>}
 */
export async function filterDocuments(filters = {}) {
    return await post('/document/filter', filters);
}

/**
 * Busca um documento por ID
 * @param {number} id 
 * @returns {Promise<object>}
 */
export async function getDocumentById(id) {
    return await get(`/document/${id}`);
}

/**
 * Cria um novo documento
 * @param {object} documentData - { name, description, dueDate, farmerId }
 * @returns {Promise<object>}
 */
export async function createDocument(documentData) {
    return await post('/document', documentData);
}

/**
 * Atualiza um documento existente
 * @param {number} id 
 * @param {object} documentData 
 * @returns {Promise<void>}
 */
export async function updateDocument(id, documentData) {
    return await put(`/document/${id}`, documentData);
}

/**
 * Deleta um documento
 * @param {number} id 
 * @returns {Promise<void>}
 */
export async function deleteDocument(id) {
    return await del(`/document/${id}`);
}
