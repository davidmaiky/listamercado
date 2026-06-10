const API_URL = import.meta.env.VITE_API_URL || '/api';

export const getItems = async () => {
    const response = await fetch(`${API_URL}/items`);
    return response.json();
};

export const addItem = async (item) => {
    const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    return response.json();
};

export const updateItem = async (id, updates) => {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    return response.json();
};

export const deleteItem = async (id) => {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
};
