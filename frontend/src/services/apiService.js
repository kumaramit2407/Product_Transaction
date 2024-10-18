import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTransactions = (search, page, perPage) =>
  axios.get(`${API_URL}/transactions`, { params: { search, page, perPage } });

export const getStatistics = (month) =>
  axios.get(`${API_URL}/statistics/${month}`);

export const getPriceRange = (month) =>
  axios.get(`${API_URL}/price-range/${month}`);

export const getCategories = (month) =>
  axios.get(`${API_URL}/categories/${month}`);

export const getCombinedData = (month) =>
  axios.get(`${API_URL}/combined/${month}`);
