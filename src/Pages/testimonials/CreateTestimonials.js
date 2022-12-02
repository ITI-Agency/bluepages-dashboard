import React, { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import TestimonialForm from "components/PostForms/TestimonialForm";
import TestimonialsServices from "Services/TestimonialsServices";
import { toast } from "react-toastify";

import LoadingDataLoader from "components/LoadingDataLoader";
import { useNavigate } from "react-router-dom";

function CreateTestimonials() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const testimonial = new FormData();

  const handleSubmit = (formValues) => {
    Object.keys(formValues).forEach((t) => {
      if (t == "file") {
        testimonial.append(t, formValues[t][0].originFileObj);
      } else {
        testimonial.append(t, formValues[t]);
      }
    });
    // const testimonial = e.value;
    postTestimonialData(testimonial);
  };
  const postTestimonialData = async (testimonial) => {
    setLoading(true);
    try {
      const response = await TestimonialsServices.createTestimonial(testimonial);
      if (response && response.status == 201) {
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
      <h1>Create Testimonial</h1>
      <TestimonialForm onSubmit={handleSubmit} />
    </DashboardLayout>
  );
}

export default CreateTestimonials;
