import http from "./httpService";
import Utils from "../Utils";

const getAllOffers = async () => {
	const response = await http.get("/offers");
	return response;
};
const getAllOffersPaginate = async (filters = []) => {
	console.log({ filters });
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
	const response = await http.get(`/offers/getAll/paginate${queries}`);
	return response;
};
const getOfferDetails = async (offerId) => {
	const AUTH_JWT = sessionStorage.getItem("AUTH_JWT");
	const data = await fetch(`${process.env.REACT_APP_API_BASE_URL}offers/${offerId}`, {
		headers: {
			'Authorization': `Bearer ${AUTH_JWT}`
		}
	});
	return data.json();
	// const response = await http.get(`/offer/${offerId}`);
	// return response;
};

const createOffer = async (offer) => {
	const response = await http.post(`/offers`, offer);
	return response;
};

const updateOffer = async (offer, id) => {
	const response = await http.put(`/offers/${id}`, offer);
	return response;
};

const removeOffer = async (offerId) => {
	const response = await http.delete(`/offers/${offerId}`);
	return response;
};

// for end user
// const updateOfferViews = async (offer) => {
//   const response = await http.patch(`/offers/increase-views/${offer.id}`, offer);
//   return response;
// };
// const addToFavorite = async (offer) => {
//   const response = await http.put(`/offers/${offer.id}/add-favorite`, offer);
//   return response;
// };

// const removeFavorite = async (offer) => {
//   const response = await http.put(`/offers/${offer.id}/remove-favorite`, offer);
//   return response;
// };

//offer images
const addOfferImage = async (offerId, images) => {
	const response = await http.put(`/offers/${offerId}/add-images`, images);
	return response;
};
const getOfferImages = async (offerId) => {
	const response = await http.get(`/offer/${offerId}/get-images`);
	return response;
};
const removeOfferImage = async (offerId, payload) => {
	const response = await http.delete(`/offers/${offerId}/remove-images`, payload);
	return response;
};
const deleteMultipleOffer = async (ids) => {
	// const dataArr = {
	//   data: companies, // as array
	//   //here you can add category id and/or country & city id
	// };
	const response = await http.delete(`/offers/delete/multiple`, ids);
	return response;
};
//offer videos
const getAllOfferVideos = async (companyId) => {
	return await http.get(`/video?companyId=${companyId}`);
};
const getVideoDetails = async (videoId) => {
	return await http.get(`/video/${videoId}`);
};
const createVideo = async (offerId, videoLink) => {
	//   {
	//     "video": "video url",
	//     "offerId":2
	// }
	return await http.post(`/offerVideos`, {
		video: videoLink,
		offerId,
	});
};
const updateVideo = async (videoId, videoLink) => {
	return await http.put(`/video/${videoId}`, { video: videoLink });
};
const removeVideo = async (videoId) => {
	return await http.delete(`/video/${videoId}`);
};

export default {
	getAllOffers,
	getOfferDetails,
	getOfferImages,
	createOffer,
	updateOffer,
	// updateOfferViews,
	// addToFavorite,
	// removeFavorite,
	addOfferImage,
	removeOfferImage,
	removeOffer,
	getAllOffersPaginate,
	deleteMultipleOffer
};
