import http from "./httpService";

const login = async (user) => {
  const response = await http.post("/auth/login", user);
  return response;
};

const signup = async () => {
  const response = await http.post("/auth/register", data);
  return response;
};

const getAllUsers = async () => {
  const response = await http.get("/users?role=USER");
  return response;
};

const getUserDetails = async (userId) => {
  const response = await http.get(`/users/${userId}`);
  return response;
};

const createUser = async (user) => {
  const response = await http.post(`/users`, user);
  return response;
};

const updateUser = async (user) => {
  const response = await http.put(`/users/${user.id}`, user);
  return response;
};

const removeUser = async (userId) => {
  const response = await http.delete(`/users/${userId}`);
  return response;
};

export default {
  login,
  signup,
  getAllUsers,
  getUserDetails,
  createUser,
  updateUser,
  removeUser,
};
