import http from "./httpService";
import Utils from "../Utils";

const getSubscriptionPlanPackageDetails = async (subscriptionPlanPackageId) => {
  const response = await http.get(`/subscriptionPlanPackages/${subscriptionPlanPackageId}`);
  return response;
};

const getAllSubscriptionPlanPackages = async (filters = []) => {
  //prepare filters to be queries
  const queries = Utils.prepareQueryFilters(filters);
  const response = await http.get(`/subscriptionPlanPackages${queries}`);
  return response;
};

const createSubscriptionPlanPackage = async (subscriptionPlanPackage) => {
  const response = await http.post(`/subscriptionPlanPackages`, subscriptionPlanPackage);
  return response;
};

const updateSubscriptionPlanPackage = async (subscriptionPlanPackage) => {
  const response = await http.put(`/subscriptionPlanPackages/${subscriptionPlanPackage.id}`, { ...subscriptionPlanPackage });
  return response;
};

const deleteSubscriptionPlanPackage = async (subscriptionPlanPackageId) => {
  const response = await http.delete(`/subscriptionPlanPackages/${subscriptionPlanPackageId}`);
  return response;
};

export default {
  getSubscriptionPlanPackageDetails,
  getAllSubscriptionPlanPackages,
  createSubscriptionPlanPackage,
  updateSubscriptionPlanPackage,
  deleteSubscriptionPlanPackage,
};
