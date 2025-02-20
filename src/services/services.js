import axios from "axios";

export const getAllCategories = async () => await axios.get("/api/categories");

export const getAllProducts = async (page = 1, limit = 10) =>
  axios.get(`/api/products?page=${page}&limit=${limit}`);
