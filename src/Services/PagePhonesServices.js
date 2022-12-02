import http from "./httpService";
import Utils from "../Utils";

const getAllPhones = async (filters = []) => {
	const queries = Utils.prepareQueryFilters(filters);
	const AUTH_JWT = sessionStorage.getItem("AUTH_JWT");
	const data = await fetch(`${process.env.REACT_APP_API_BASE_URL}phone${queries}`, {
		headers: {
			'Authorization': `Bearer ${AUTH_JWT}`
		}
	});
	return data.json();
  // const response = await http.get(`/phone${queries}`);
  // return response;
};

const getPhoneDetails = async (PhoneId) => {
	const AUTH_JWT = sessionStorage.getItem("AUTH_JWT");
	const data = await fetch(`${process.env.REACT_APP_API_BASE_URL}phone/${PhoneId}`, {
		headers: {
			'Authorization': `Bearer ${AUTH_JWT}`
		}
	});
	return data.json();
  // const response = await http.get(`/phone/${PhoneId}`);
  // return response;
};

const createPhone = async (phone) => {
  const response = await http.post(`/phone`, phone);
  return response;
};

const updatePhone = async (phone,id) => {
  const response = await http.put(`/phone/${id}`, phone);
  return response;
};

const removePhone = async (PhoneId) => {
  const response = await http.delete(`/phone/${PhoneId}`);
  return response;
};

export default {
	getAllPhones,
	getPhoneDetails,
	createPhone,
	updatePhone,
	removePhone
};
