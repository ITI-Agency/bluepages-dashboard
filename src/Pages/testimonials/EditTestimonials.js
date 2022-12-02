import React, { useState, useEffect } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import TestimonialForm from "components/PostForms/TestimonialForm";
import TestimonialsServices from "Services/TestimonialsServices";
import { toast } from "react-toastify";

import LoadingDataLoader from "components/LoadingDataLoader";
import { useNavigate, useParams } from "react-router-dom";

function CreateTestimonials() {
  const navigate = useNavigate();
  const { id: testimonialId } = useParams();
  const [testimonialDetails, setTestimonialDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const testimonial = new FormData();
  const getTestimonialDetails = async () => {
    setLoading(true);
    try {
      const response = await TestimonialsServices.getTestimonialDetails(testimonialId);
      if (response && response.status == 200) {
        setLoading(false);
        setTestimonialDetails(response.data);
      } else {
        toast.error("sorry something went wrong while getting testimonials!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting testimonials!");
      setLoading(false);
    }
  };
  useEffect(() => {
    getTestimonialDetails();
  }, []);

  const handleSubmit = (formValues) => {
    Object.keys(formValues).forEach((t) => {
      if (formValues[t]) {
        if (t == "file") {
          testimonial.append(t, formValues[t][0].originFileObj);
        } else {
          testimonial.append(t, formValues[t]);
        }
      }
    });
    // const testimonial = e.value;
    postTestimonialData(testimonial);
  };
  const postTestimonialData = async (testimonial) => {
    testimonial.id = testimonialId;
    setLoading(true);
    try {
      const response = await TestimonialsServices.updateTestimonial(testimonial);
      if (response && response.status == 200) {
        toast.success("your testimonial has created successfully!");
        setLoading(false);
        navigate(`/testimonials`);
      } else {
        toast.error("sorry something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong!");
      setLoading(false);
    }
  };
  if (loading) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      <h1>Update Testimonial</h1>
      <TestimonialForm onSubmit={handleSubmit} testimonialDetails={testimonialDetails} />
    </DashboardLayout>
  );
}

export default CreateTestimonials;
