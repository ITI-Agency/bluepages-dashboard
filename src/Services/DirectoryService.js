import http from "./httpService";

const getAllDirectories = async () => {
  return await http.get(`/directory`);
};

const getDirectoryDetails = async (directoryId) => {
  return await http.get(`/directory/${directoryId}`);
};

const createDirectory = async (directory) => {
  // {
  //   pdf: File,
  //   cityId
  // }
  return await http.post(`/directory`, directory);
};

const updateDirectory = async (directory,id) => {
  return await http.put(`/directory/${id}`, directory);
};
const removeDirectory = async (directoryId) => {
  return await http.delete(`/directory/${directoryId}`);
};

export default {
  getAllDirectories,
  getDirectoryDetails,
  createDirectory,
  updateDirectory,
  removeDirectory,
};
