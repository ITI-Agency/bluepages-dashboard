import http from "./httpService";

// const createSettings = async (settings) => {
//   const response = await http.post(`/setting`, settings);
//   return response;
// };

const getSettings = async (settings) => {
  const response = await http.get(`/setting`, settings);
  return response;
};
const updateSettings = async (settings) => {
  const response = await http.put(`/setting`, settings);
  return response;
};

export default {
  getSettings,
  updateSettings,
};

// {
//   //mandatory
//   title_en: string;
//   title_ar: string;
//   description_en: string;
//   description_ar: string;
//   keywords: string;
//   facebook: string;
//   twitter: string;
//   instagram: string;
//   linkedin: string;
//   snapchat: string;
//   youtube: string;
//   phone: string;
//   email: string;
//   whatsapp: string;
//   copyright_en: string;
//   copyright_ar: string;
//   location: string;
//   views: string;
//   //optional
//   logo: string;
//   file: MemoryStoredFile;
// }
