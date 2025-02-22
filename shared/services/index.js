import axios from "axios";

export const getAllCategories = async () => await axios.get("/api/categories");

export const getAllProducts = async (page = 1, limit = 10, search = '', price = [], categories = [], rating = '', sort = '') =>
  axios.get(`/api/products?page=${page}&limit=${limit}&search=${search}` +
    `&price=${price.join('|')}&categories=${categories.join('|')}&rating=${rating}&sort=${sort}`);
