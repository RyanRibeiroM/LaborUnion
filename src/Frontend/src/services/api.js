const API_BASE_URL = '/api';

let isRefreshing = false;
let refreshPromise = null;

/**
 * 
 * @returns {Promise<string>}
 */
async function tryRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        throw new Error('Nenhum refresh token disponível');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/token/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Falha na renovação do token');
        }

        const data = await response.json();

        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }

        return data.accessToken;
    } catch (error) {
        // Se falhar a renovação (token expirado ou inválido), limpa tudo
        handleSessionExpiration();
        throw error;
    }
}

/**
 * Limpa o storage e redireciona para o login
 */
function handleSessionExpiration() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Redireciona para a raiz ou tela de login
    window.location.href = '/';
}

/**
 *
 * @param {string} endpoint
 * @param {object} options
 * @param {boolean} isRetry
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}, isRetry = false) {
    const token = localStorage.getItem('accessToken');

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const fullUrl = `${API_BASE_URL}${endpoint}`;

    if (import.meta.env.DEV) {
        console.log(`📡 [API] ${config.method || 'GET'} ${endpoint}`, isRetry ? '(Retry)' : '');
    }

    let response;
    try {
        response = await fetch(fullUrl, config);
    } catch (fetchError) {
        console.error('❌ Erro de conexão:', fetchError.message);
        throw new Error(`Servidor indisponível. Verifique sua conexão.`);
    }

    const isAuthEndpoint = endpoint.startsWith('/login') || endpoint.startsWith('/token');

    if (response.status === 401 && !isRetry && !isAuthEndpoint) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = tryRefreshToken()
                .finally(() => {
                    isRefreshing = false;
                    refreshPromise = null;
                });
        }

        try {
            await refreshPromise;
            return apiRequest(endpoint, options, true);
        } catch (refreshError) {
            console.error('❌ Sessão expirada:', refreshError.message);
            handleSessionExpiration();
            throw new Error('Sessão expirada.');
        }
    }

    if (response.status === 204) {
        return null;
    }

    let data = null;
    const contentType = response.headers.get('content-type');

    const text = await response.text();

    if (text && contentType && contentType.includes('application/json')) {
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.warn('⚠️ Resposta não é um JSON válido:', text);
        }
    }

    // Tratamento de Erros da API
    if (!response.ok) {
        if (response.status === 401 && !isAuthEndpoint) {
            handleSessionExpiration();
            throw new Error('Acesso negado.');
        }

        let errorMessage = 'Ocorreu um erro inesperado.';

        if (data) {
            if (data.errors) {
                if (typeof data.errors === 'object') {
                    errorMessage = Object.values(data.errors).flat().join(', ');
                } else {
                    errorMessage = JSON.stringify(data.errors);
                }
            }
            else if (data.message) {
                errorMessage = data.message;
            }
            else if (data.title) {
                errorMessage = data.title;
            }
        } else if (text) {
            errorMessage = `Erro ${response.status}: ${text.substring(0, 50)}...`;
        }
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

// --- Métodos Helper Exportados ---

export function get(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'GET' });
}

export function post(endpoint, body, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });
}

export function put(endpoint, body, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

export function del(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
}