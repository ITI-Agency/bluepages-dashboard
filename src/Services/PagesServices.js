import http from "./httpService";

const getPageDetails = async (categoryId) => {
  const response = await http.get(`/pages/${categoryId}`);
  return response;
};

const getAllPages = async () => {
  const response = await http.get(`/pages`);
  return response;
};

const createPage = async (category) => {
  const response = await http.post(`/pages`, category);
  return response;
};

const updatePage = async (category,id) => {
  const response = await http.put(`/pages/${id}`, { ...category });
  return response;
};

const deletePage = async (categoryId) => {
  const response = await http.delete(`/pages/${categoryId}`);
  return response;
};

export default {
	getPageDetails,
	getAllPages,
	createPage,
	updatePage,
	deletePage
};
