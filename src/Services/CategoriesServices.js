import http from "./httpService";
import Utils from "../Utils";

const getCategoryDetails = async (categoryId) => {
  const response = await http.get(`/categories/${categoryId}`);
  return response;
};

const getAllCategories = async (filters = []) => {
  //prepare filters to be queries
  const queries = Utils.prepareQueryFilters(filters);
  const response = await http.get(`/categories${queries}`);
  return response;
};
const getAllCategoriesMapped = async (filters = []) => {
  //prepare filters to be queries
  const queries = Utils.prepareQueryFilters(filters);
  const response = await http.get(`/categories/getAll/mapped${queries}`);
  return response;
};

const createCategory = async (category) => {
  const response = await http.post(`/categories`, category);
  return response;
};
const mergeCategories = async (data) => {
  const response = await http.post(`/categories/merge`, data);
  return response;
};
const createMultipleCategory = async (categories) => {
  const dataArr = {
    data: categories, // as array
    //here you can add category id and/or country & city id
  };
  const response = await http.post(`/categories/multiple`, categories);
  return response;
};
const deleteMultipleCategory = async (ids) => {
  const response = await http.delete(`/categories/delete/multiple`, ids);
  return response;
};
const renewMultipleCompany = async (ids) => {
  const response = await http.delete(`/categories/delete/multiple`, ids);
  return response;
};
const updateCategory = async (category, id) => {
  const response = await http.put(`/categories/${id}`, { ...category });
  return response;
};

const deleteCategory = async (categoryId) => {
  const response = await http.delete(`/categories/${categoryId}`);
  return response;
};

export default {
  getCategoryDetails,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createMultipleCategory,
  getAllCategoriesMapped,
  deleteMultipleCategory,
  mergeCategories,
};
