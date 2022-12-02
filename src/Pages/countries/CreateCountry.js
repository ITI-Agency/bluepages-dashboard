import React, { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CountriesServices from "Services/CountriesServices";

import { toast } from "react-toastify";

import LoadingDataLoader from "components/LoadingDataLoader";
import { useNavigate } from "react-router-dom";
import CountryForm from "components/PostForms/CountryForm";

function CreateCountry() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fd = new FormData();

  const handleSubmit = (formValues) => {

    Object.keys(formValues).forEach((t) => {
      if (t == "file") {
        fd.append(t, formValues[t][0].originFileObj);
      } else if (t == "images") {
        formValues[t].map((image) =>
          fd.append("images[]", image.originFileObj)
        )
      } else {
        fd.append(t, formValues[t]);
      }
    });
    postCountryData(fd);
  };
  const postCountryData = async (countryFormData) => {
    setLoading(true);
    try {
      const response = await CountriesServices.createCountry(countryFormData);
     
      if (response && response.status == 201) {
        toast.success("your countries has created successfully!");
        setLoading(false);
        navigate(`/countries`);
      } else {
        toast.error("sorry something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error)
      toast.error("sorry something went wrong!");
      setLoading(false);
    }
  };
  if (loading) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      <h1>Create Countries</h1>
      <CountryForm onSubmit={handleSubmit} />
    </DashboardLayout>
  );
}

export default CreateCountry;
