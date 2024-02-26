import http from "./httpService";
import Utils from "../Utils";

const getAllBranches = async (filters = []) => {
  const queries = Utils.prepareQueryFilters(filters);
  const AUTH_JWT = sessionStorageItem("AUTH_JWT");

  const data = await fetch(
    `${process.env.REACT_APP_API_BASE_URL}branch${queries}`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_JWT}`,
      },
    }
  );
  return data.json();
  // const response = await http.get(`/branch${queries}`);
  // return response;
};

const getBranchDetails = async (BranchId) => {
  const AUTH_JWT = sessionStorageItem("AUTH_JWT");
  const data = await fetch(
    `${process.env.REACT_APP_API_BASE_URL}branch/${BranchId}`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_JWT}`,
      },
    }
  );
  return data.json();
  // const response = await http.get(`/branch/${BranchId}`);
  // return response;
};

const createBranch = async (Branch) => {
  const response = await http.post(`/branch`, Branch);
  return response;
};

const updateBranch = async (Branch, id) => {
  const response = await http.put(`/branch/${id}`, Branch);
  return response;
};

const removeBranch = async (BranchId) => {
  const response = await http.delete(`/branch/${BranchId}`);
  return response;
};

export default {
  getAllBranches,
  getBranchDetails,
  createBranch,
  updateBranch,
  removeBranch,
};
