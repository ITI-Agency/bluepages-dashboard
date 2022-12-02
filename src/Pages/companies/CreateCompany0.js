// components
import React, { useState, useEffect } from "react";
import CompanyForm from "components/PostForms/CompanyForm";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";

// hooks
import useLoading from "Hooks/useLoading";

// services & utlities
import CompaniesServices from "Services/CompaniesServices";
import CountriesServices from "Services/CountriesServices";
import UserServices from "Services/UserServices";
import CategoriesServices from "Services/CategoriesServices";

import { useNavigate } from "react-router-dom";

function CreateCompany() {
  const { setLoading } = useLoading();
  const { navigate } = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const postCompany = async (companyData) => {
    setLoading(true);
    const res = await CompaniesServices.createCompany(companyData);
    console.log("thsi is the response of posting company:>", res);
    if (res.status == 201) {
      setLoading(false);
      navigate("/companies");
    } else {
      setLoading(false);
      console.log("there is an error:>", res);
    }
  };

  useEffect(() => {
    getFieldsData();
  }, []);
  const getCountryCities = async (id) => {
    // setLoading(true);
    const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(id);
    if (citiesStatus == 200) {
      setCities(citiesData);
    }
  };
  const getFieldsData = async () => {
    const { status: countriesStatus, data: countriesData } =
      await CountriesServices.getAllCountries();
    // const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(1);
    const { status: usersStatus, data: usersData } = await UserServices.getAllUsers();
    const { status: categoriesStatus, data: categoriesData } =
      await CategoriesServices.getAllCategories();

    console.log("this is data:>", {
      countriesData,
      // citiesData,
      usersData,
      categoriesData,
    });
    if (
      countriesStatus == 200 &&
      // citiesStatus == 200 &&
      usersStatus == 200 &&
      categoriesStatus == 200
    ) {
      setCountries(countriesData);
      // setCities(citiesData);
      setUsers(usersData);
      setCategories(categoriesData);
      setDataLoaded(true);
      return;
    }
  };
  if (!dataLoaded) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      <h1>CreateCompany</h1>
      <CompanyForm
        onSubmit={postCompany}
        users={users}
        cities={cities}
        countries={countries}
        categories={categories}
        onCountryChange={getCountryCities}
      />
    </DashboardLayout>
  );
}

export default CreateCompany;
