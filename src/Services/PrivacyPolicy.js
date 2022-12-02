import http from "./httpService";

const getAllPrivacyPolicy = async () => {
  return await http.get(`/privacy-policy`);
};

const createPrivacyPolicy = async (PrivacyPolicy) => {
  //   {
  //     "page": "link_Video",
  //     "slug":1,
  //     "title": "link_Video",
  //     "content": "link_Video"
  // }
  const response = await http.post(`/privacy-policy`, PrivacyPolicy);
  return response;
};

const updatePrivacyPolicy = async (PrivacyPolicy) => {
  const response = await http.put(`/privacy-policy/${PrivacyPolicy.id}`, PrivacyPolicy);
  return response;
};

export default {
  getAllPrivacyPolicy,
  createPrivacyPolicy,
  updatePrivacyPolicy,
};
