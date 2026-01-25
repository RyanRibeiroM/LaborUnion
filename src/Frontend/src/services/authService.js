import { post } from './api';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Realiza login do usuário
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{name: string, tokens: {accessToken: string, refreshToken: string}}>}
 */
export async function login(email, password) {
    const response = await post('/login', { email, password });

    // Salva tokens e dados do usuário
    if (response.tokens) {
        localStorage.setItem(TOKEN_KEY, response.tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
    }

    if (response.name) {
        localStorage.setItem(USER_KEY, JSON.stringify({ name: response.name }));
    }

    return response;
}

/**
 * Realiza logout do usuário
 */
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/**
 * Retorna o token de acesso atual
 * @returns {string|null}
 */
export function getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Retorna o refresh token atual
 * @returns {string|null}
 */
export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Retorna os dados do usuário armazenados
 * @returns {object|null}
 */
export function getStoredUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean}
 */
export function isAuthenticated() {
    return !!getAccessToken();
}

/**
 * Atualiza o token de acesso usando o refresh token
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
export async function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error('Nenhum refresh token disponível');
    }

    const response = await post('/token/refresh-token', { refreshToken });

    if (response.accessToken) {
        localStorage.setItem(TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }

    return response;
}
