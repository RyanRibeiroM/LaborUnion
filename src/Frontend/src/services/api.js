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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Se a resposta for 204 (No Content), retorna null
    if (response.status === 204) {
        return null;
    }

    const data = await response.json();

    if (!response.ok) {
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
