const API_BASE_URL = 'http://localhost:8080/api/bank'; // Update this URL to match your backend server's address

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        const error = new Error(data.message || 'An error occurred');
        error.statusCode = response.status;
        error.errorCode = data.errorCode || 'UNKNOWN_ERROR';
        throw error;
    }
    console.log('Response from handleResponse:', data);
    return data;
}

export const createAccount = async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/accounts?accountId=${accountId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        //No body is needed for @RequestParam in Spring Boot
    });
    return handleResponse(response);
}

export const getAllAccounts = async () => {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
}

export const getAccountById = async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`);
        return handleResponse(response);
    }

export const checkBalance = async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/balance/${accountId}`);
    return handleResponse(response);
}

export const deposit = async (accountId, amount) => {
    const response = await fetch(`${API_BASE_URL}/deposit`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId, amount }),
    });
    return handleResponse(response);
    }

export const transfer = async (sourceAccountId, targetAccountId, amount) => {
    const response = await fetch(`${API_BASE_URL}/transfer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceAccountId, targetAccountId, amount }),
    });
    return handleResponse(response);
}