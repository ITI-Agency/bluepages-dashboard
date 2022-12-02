import http from "./httpService";
import Utils from "../Utils";

const getAllVideos = async (filters = []) => {
	const queries = Utils.prepareQueryFilters(filters);
	const AUTH_JWT = sessionStorage.getItem("AUTH_JWT");


	const data = await fetch(`${process.env.REACT_APP_API_BASE_URL}video${queries}`, {
		headers: {
			'Authorization': `Bearer ${AUTH_JWT}`
		}
	});
	return data.json();
  // const response = await http.get(`/video${queries}`);
  // return response;
};

const getVideoDetails = async (VideoId) => {
	const AUTH_JWT = sessionStorage.getItem("AUTH_JWT");
	const data = await fetch(`${process.env.REACT_APP_API_BASE_URL}video/${VideoId}`, {
		headers: {
			'Authorization': `Bearer ${AUTH_JWT}`
		}
	});
	return data.json();
  // const response = await http.get(`/video/${VideoId}`);
  // return response;
};

const createVideo = async (video) => {
  const response = await http.post(`/video`, video);
  return response;
};

const updateVideo = async (video,id) => {
  const response = await http.put(`/video/${id}`, video);
  return response;
};

const removeVideo = async (VideoId) => {
  const response = await http.delete(`/video/${VideoId}`);
  return response;
};

export default {
	getAllVideos,
	getVideoDetails,
	createVideo,
	updateVideo,
	removeVideo
};
