import http from "./httpService";

const getAllTestimonials = async () => {
  const response = await http.get("/testimonial");
  return response;
};

const getTestimonialDetails = async (testimonialId) => {
  const response = await http.get(`/testimonial/${testimonialId}`);
  return response;
};

const createTestimonial = async (testimonial) => {
  const response = await http.post(`/testimonial`, testimonial);
  return response;
};

const updateTestimonial = async (testimonial) => {
  const response = await http.put(`/testimonial/${testimonial.id}`, testimonial);
  return response;
};

const removeTestimonial = async (testimonialId) => {
  const response = await http.delete(`/testimonial/${testimonialId}`);
  return response;
};

export default {
  getAllTestimonials,
  getTestimonialDetails,
  createTestimonial,
  updateTestimonial,
  removeTestimonial,
};
