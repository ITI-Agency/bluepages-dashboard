import http from "./httpService";

const getAllDirectoryRequests = async () => {
  return await http.get(`/request-directory`);
};

const getDirectoryRequestDetails = async (directoryId) => {
  return await http.get(`/request-directory/${directoryId}`);
};

const createDirectory = async (directory) => {
  // {
  //   pdf: File,
  //   cityId
  // }
  return await http.post(`/request-directory`, directory);
};

const updateDirectoryRequest = async (directory,id) => {
  return await http.put(`/request-directory/${id}`, directory);
};
const removeDirectory = async (directoryId) => {
  return await http.delete(`/request-directory/${directoryId}`);
};

export default {
  getAllDirectoryRequests,
  getDirectoryRequestDetails,
  createDirectory,
  updateDirectoryRequest,
  removeDirectory,
};
