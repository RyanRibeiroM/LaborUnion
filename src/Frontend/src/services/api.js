const API_BASE_URL = '';

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let refreshPromise = null;

/**
 * Tenta renovar o token de acesso usando o refresh token
 * @returns {Promise<string>} - Novo access token
 */
async function tryRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        throw new Error('Nenhum refresh token disponível');
    }

    const response = await fetch('/token/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        // Refresh token inválido ou expirado - limpa tudo e redireciona
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    const data = await response.json();

    if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
    }

    return data.accessToken;
}

/**
 * Faz uma requisição para a API
 * @param {string} endpoint - O endpoint da API (ex: '/login')
 * @param {object} options - Opções do fetch
 * @param {boolean} isRetry - Se é uma tentativa após refresh do token
 * @returns {Promise<any>} - Resposta da API
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

    // 🔍 DEBUG: Mostra detalhes da requisição
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 DEBUG API REQUEST');
    console.log('📍 URL Completa:', fullUrl);
    console.log('📍 Endpoint:', endpoint);
    console.log('📍 Método:', config.method || 'GET');
    console.log('📍 Retry:', isRetry);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let response;
    try {
        response = await fetch(fullUrl, config);
    } catch (fetchError) {
        // ❌ Erro de conexão - API não alcançável
        console.error('❌ ERRO DE CONEXÃO COM A API:', fetchError.message);
        throw new Error(`Erro de conexão com a API. Verifique se o servidor está rodando.`);
    }

    // 🔍 DEBUG: Mostra detalhes da resposta
    console.log('📥 RESPONSE STATUS:', response.status, response.statusText);

    // 🔄 Se receber 401 (Unauthorized) e não for retry, tenta renovar o token
    if (response.status === 401 && !isRetry) {
        console.log('🔄 Token expirado, tentando renovar...');

        // Evita múltiplas tentativas simultâneas de refresh
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
            console.log('✅ Token renovado com sucesso! Refazendo requisição...');
            // Refaz a requisição original com o novo token
            return apiRequest(endpoint, options, true);
        } catch (refreshError) {
            console.error('❌ Falha ao renovar token:', refreshError.message);
            // Redireciona para login se o refresh falhar
            window.location.href = '/login';
            throw new Error('Sessão expirada. Redirecionando para login...');
        }
    }

    // Se a resposta for 204 (No Content), retorna null
    if (response.status === 204) {
        return null;
    }

    // Tenta fazer o parse do JSON
    let data = null;
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (text && contentType && contentType.includes('application/json')) {
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('Erro ao fazer parse do JSON:', parseError);
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: O servidor retornou uma resposta inválida`);
            }
        }
    }

    if (!response.ok) {
        // Lança erro com mensagens da API
        let errorMessage = 'Erro na requisição';

        if (data && data.errors) {
            if (Array.isArray(data.errors)) {
                errorMessage = data.errors.join(', ');
            } else if (typeof data.errors === 'string') {
                errorMessage = data.errors;
            } else if (typeof data.errors === 'object') {
                const messages = Object.values(data.errors).flat();
                errorMessage = messages.join(', ');
            }
        } else if (data && data.message) {
            errorMessage = data.message;
        } else if (data && data.title) {
            errorMessage = data.title;
        } else if (response.status === 401) {
            errorMessage = 'Acesso não autorizado. Faça login novamente.';
        } else if (response.status === 403) {
            errorMessage = 'Você não tem permissão para acessar este recurso.';
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

/**
 * Requisição GET
 */
export function get(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'GET' });
}

/**
 * Requisição POST
 */
export function post(endpoint, body, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * Requisição PUT
 */
export function put(endpoint, body, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/**
 * Requisição DELETE
 */
export function del(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
}
