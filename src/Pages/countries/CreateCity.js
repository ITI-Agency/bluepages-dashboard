import React, { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CountriesServices from "Services/CountriesServices";

import { toast } from "react-toastify";

import LoadingDataLoader from "components/LoadingDataLoader";
import { useNavigate, useParams } from "react-router-dom";
import CityForm from "components/PostForms/CityForm";


function CreateCity() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fd = new FormData();
  const { countryId } = useParams();

  const handleSubmit = (formValues) => {
    formValues.countryId = countryId
    Object.keys(formValues).forEach((t) => {
      if (t == "file") {
        fd.append(t, formValues[t][0].originFileObj);
      } else {
        fd.append(t, formValues[t]);
      }
    });
    postCityData(fd);
  };
  const postCityData = async (cityFormData) => {
    setLoading(true);
    try {
      const response = await CountriesServices.createCity(cityFormData);
      console.log(response)
      if (response && response.status == 201) {
        toast.success("your City has created successfully!");
        setLoading(false);
        navigate(`/countries/${countryId}`);
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
      <h1>Create Cities</h1>
      <CityForm onSubmit={handleSubmit} />
    </DashboardLayout>
  );
}

export default CreateCity;

