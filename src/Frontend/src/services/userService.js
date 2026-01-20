import { get, put } from './api';

/**
 * Busca o perfil do usuário
 * @returns {Promise<{name: string, email: string, role: string}>}
 */
export async function getProfile() {
    return await get('/user/profile');
}

/**
 * Atualiza o perfil
 * @param {object} data - { name, email, password? }
 * @returns {Promise<void>}
 */
export async function updateProfile(data) {
    return await put('/user', data);
}

/**
 * Altera a senha do usuário
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function changePassword(currentPassword, newPassword) {
    return await put('/user/change-password', {
        password: currentPassword,
        newPassword: newPassword
    });
}
