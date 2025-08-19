import axios from 'axios';

const baseURL = import.meta.env.PROD ? (import.meta.env.VITE_API_BASE || '') : '';

export const api = axios.create({ baseURL });

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status;
		const data = error?.response?.data;
		return Promise.reject({ status, data, message: error?.message });
	}
);

export async function getAll(resourcePath) {
	try {
		const { data } = await api.get(`/api/${resourcePath}`);
		return data;
	} catch (e) {
		if (e?.status === 404) return [];
		throw e?.data || e;
	}
}

export async function getById(resourcePath, id) {
	const { data } = await api.get(`/api/${resourcePath}/${id}`);
	return data;
}

export async function createItem(resourcePath, payload) {
	const { data } = await api.post(`/api/${resourcePath}`, payload);
	return data;
}

export async function updateItem(resourcePath, id, payload) {
	const { data } = await api.put(`/api/${resourcePath}/${id}`, payload);
	return data;
}

export async function deleteItem(resourcePath, id) {
	const { data } = await api.delete(`/api/${resourcePath}/${id}`);
	return data;
}


