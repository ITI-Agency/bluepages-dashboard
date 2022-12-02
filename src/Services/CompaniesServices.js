import http from "./httpService";
import Utils from "../Utils";

const getCompanyDetails = async (companyId) => {
  const response = await http.get(`/companies/${companyId}`);
  return response;
};

const getAllCompanies = async (filters = []) => {
  // [
  //   { userId: 1 },
  //   { cityId: 1 },
  //   { countryId: 1 },
  //   { categories[]: 1 },
  //   {branches: true},
  //   {user: true},
  //   {city: true},
  //   {country: true}
  // ];
  //prepare filters to be queries
  const queries = Utils.prepareQueryFilters(filters);
  const response = await http.get(`/companies${queries}`);
  return response;
};

const createCompany = async (company) => {
  const response = await http.post(`/companies`, company);
  return response;
};

const createMultipleCompany = async (companies) => {
  const dataArr = {
    data: companies, // as array
    //here you can add category id and/or country & city id
  };
  const response = await http.post(`/companies/multiple`, companies);
  return response;
};

const getCompanyImages = async (companyId) => {
  return await http.get(`/companies/${companyId}/get-images`);
};

const addCompanyImages = async (companyId, images) => {
  return await http.put(`/companies/${companyId}/add-images`, images);
};

const removeCompanyImages = async (companyId,payload) => {
  return await http.delete(`/companies/${companyId}/remove-images`,payload);
};

const updateCompany = async (company,id) => {
  const response = await http.put(`/companies/${id}`, company);
  return response;
};

const deleteCompany = async (companyId) => {
  const response = await http.delete(`/companies/${companyId}`);
  return response;
};

// company phones
const getAllCompanyPhones = async (companyId) => {
  return await http.get(`/phone?companyId=${companyId}`);
};
const getPhoneDetails = async (phoneId) => {
  return await http.get(`phone/${phoneId}`);
};
const createPhone = async (companyId, phone) => {
  //   {
  //     "phone": "0199848744",
  //     "companyId":2
  // }
  return await http.post(`/phone`, {
    phone,
    companyId,
  });
};
const updatePhone = async (phoneId, phone) => {
  return await http.put(`/phone/${phoneId}`, { phone });
};
const removePhone = async (phoneId) => {
  return await http.delete(`/phone/${phoneId}`);
};

// company videos
const getAllCompanyVideos = async (companyId) => {
  return await http.get(`/video?companyId=${companyId}`);
};
const getVideoDetails = async (videoId) => {
  return await http.get(`/video/${videoId}`);
};
const createVideo = async (companyId, videoLink) => {
  //   {
  //     "video": "video url",
  //     "companyId":2
  // }
  return await http.post(`/video`, {
    video: videoLink,
    companyId,
  });
};
const updateVideo = async (videoId, videoLink) => {
  return await http.put(`/video/${videoId}`, { video: videoLink });
};
const removeVideo = async (videoId) => {
  return await http.delete(`/video/${videoId}`);
};

// company categories
const getAllCompanyCategories = async (companyId) => {
  return await http.get(`/company_category?companyId=${companyId}`);
};
const getCompanyCategoryDetails = async (categoryId) => {
  return await http.get(`/company_category/${categoryId}`);
};
const createCompanyCategory = async (companyId, company_category) => {
  //   {
  //     "company_category": "food",
  //     "companyId":2
  // }
  return await http.post(`/company_category`, {
    company_category,
    companyId,
  });
};
const updateCompanyCategory = async (categoryId, company_category) => {
  return await http.put(`/company_category/${categoryId}`, { company_category });
};
const removeCompanyCategory = async (categoryId) => {
  return await http.delete(`/company_category/${categoryId}`);
};

export default {
  getCompanyDetails,
  getAllCompanies,
  createCompany,
  createMultipleCompany,
  updateCompany,
  deleteCompany,
  getCompanyImages,
  addCompanyImages,
  removeCompanyImages,
  getAllCompanyPhones,
  getPhoneDetails,
  createPhone,
  updatePhone,
  removePhone,
  getAllCompanyVideos,
  getVideoDetails,
  createVideo,
  updateVideo,
  removeVideo,
  getAllCompanyCategories,
  getCompanyCategoryDetails,
  createCompanyCategory,
  updateCompanyCategory,
  removeCompanyCategory,
};
