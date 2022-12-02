import http from "./httpService";
import Utils from "../Utils";

const getCountryDetails = async (countryId) => {
  const response = await http.get(`/countries/${countryId}`);
  return response;
};

const getAllCountries = async (filters = []) => {
  //prepare filters to be queries
  const queries = Utils.prepareQueryFilters(filters);
  const response = await http.get(`/countries${queries}`);
  console.log({ response })
  return response;
};

const createCountry = async (country) => {
  const response = await http.post(`/countries`, country);
  return response;
};

const updateCountry = async (country,id) => {
  const response = await http.put(`/countries/${id}`,country);
  return response;
};

const removeCountry = async (countryId) => {
  const response = await http.delete(`/countries/${countryId}`);
  return response;
};
// country images
const addCountryImages = async (countryId, images) => {
  const res = await http.put(`/countries/${countryId}/add-images`, images);
  return res
};

const getCountryImages = async (countryId) => {
  return await http.get(`/countries/${countryId}/get-images`);
};

const removeCountryImages = async (countryId) => {
  return await http.delete(`/countries/${countryId}/remove-images`);
};

// cities
const getAllCities = async (countryId) => {
  const response = await http.get(`/cities?countryId=${countryId}`);
  return response;
};
const getCityDetails = async (cityId) => {
  const response = await http.get(`/cities/${cityId}`);
  return response;
};
const createCity = async (city) => {
  const response = await http.post(`/cities`, city);
  return response;
};
const updateCity = async (city) => {
  const response = await http.put(`/cities/${city.id}`, city);
  return response;
};

const removeCity = async (city) => {
  const response = await http.delete(`/cities/${city}`);
  return response;
};

export default {
  getCountryDetails,
  getAllCountries,
  createCountry,
  updateCountry,
  addCountryImages,
  getCountryImages,
  removeCountryImages,
  removeCountry,
  getAllCities,
  getCityDetails,
  createCity,
  updateCity,
  removeCity,
};
