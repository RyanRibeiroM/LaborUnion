const API_BASE_URL = '/api';

/**
 * Faz uma requisição para a API
 * @param {string} endpoint - O endpoint da API (ex: '/login')
 * @param {object} options - Opções do fetch
 * @returns {Promise<any>} - Resposta da API
 */
export async function apiRequest(endpoint, options = {}) {
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
    console.log('📍 URL Base:', API_BASE_URL);
    console.log('📍 Endpoint:', endpoint);
    console.log('📍 Método:', config.method || 'GET');
    console.log('📍 Headers:', config.headers);
    if (config.body) {
        console.log('📍 Body:', config.body);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let response;
    try {
        response = await fetch(fullUrl, config);
    } catch (fetchError) {
        // ❌ Erro de conexão - API não alcançável
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ ERRO DE CONEXÃO COM A API');
        console.error('❌ Mensagem:', fetchError.message);
        console.error('❌ A PORTA DA API PODE ESTAR ERRADA!');
        console.error('❌ Verifique o arquivo: vite.config.js');
        console.error('❌ Procure por: target: "https://localhost:PORTA"');
        console.error('❌ URL tentada:', fullUrl);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        throw new Error(`A PORTA DA API ESTÁ ERRADA! Verifique vite.config.js. O servidor não está respondendo na URL: ${fullUrl}`);
    }

    // 🔍 DEBUG: Mostra detalhes da resposta
    console.log('📥 RESPONSE STATUS:', response.status, response.statusText);
    console.log('📥 RESPONSE URL:', response.url);

    // Se a resposta for 204 (No Content), retorna null
    if (response.status === 204) {
        return null;
    }

    // Tenta fazer o parse do JSON, mas trata erros se a resposta estiver vazia
    let data = null;
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (text && contentType && contentType.includes('application/json')) {
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('Erro ao fazer parse do JSON:', parseError, 'Texto recebido:', text);
            // Se falhar o parse e a resposta não for ok, lança erro genérico
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: O servidor retornou uma resposta inválida`);
            }
        }
    }

    if (!response.ok) {
        // Se for erro 401 (não autorizado), redirecionar para login
        if (response.status === 401) {
            console.warn('🔒 Token expirado ou inválido. Redirecionando para login...');
            // Limpar tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Redirecionar para login
            window.location.href = '/';
            throw new Error('Acesso não autorizado. Redirecionando para login...');
        }

        // Lança erro com mensagens da API (suporta diferentes formatos)
        let errorMessage = 'Erro na requisição';

        if (data.errors) {
            if (Array.isArray(data.errors)) {
                errorMessage = data.errors.join(', ');
            } else if (typeof data.errors === 'string') {
                errorMessage = data.errors;
            } else if (typeof data.errors === 'object') {
                // Handle validation errors object format: { field: ['error1', 'error2'] }
                const messages = Object.values(data.errors).flat();
                errorMessage = messages.join(', ');
            }
        } else if (data.message) {
            errorMessage = data.message;
        } else if (data.title) {
            errorMessage = data.title;
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
