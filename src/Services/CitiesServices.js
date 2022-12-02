import http from "./httpService";
import Utils from "../Utils";


const getAllCities = async (filters = []) => {
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
  const response = await http.get(`/cities${queries}`);
  return response;
};
const getCityDetails = async (cityId) => {
  const response = await http.get(`/cities/${cityId}`);
  return response;
};
const updateCity = async (city,id) => {
  const response = await http.put(`/cities/${id}`, city);
  return response;
};

export default {
	getAllCities,
	getCityDetails,
	updateCity
};
