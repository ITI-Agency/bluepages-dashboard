import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";

import { useNavigate, useParams } from "react-router-dom";
import useFetch from "Hooks/useFetch";
import OffersServices from "Services/OffersServices";

function EditOffer() {
  const { id: offerId } = useParams();
  const { setLoading } = useLoading();
  const { navigate } = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const postOffer = async (offerData) => {
    setLoading(true);
    const res = await OffersServices.createOffer(offerData);
    console.log("thsi is the response of posting company:>", res);
    if (res.status == 201) {
      setLoading(false);
      navigate("/offers");
    } else {
      setLoading(false);
      console.log("there is an error:>", res);
    }
  };

  useEffect(() => {
    getFieldsData();
  }, []);

  const getFieldsData = async () => {
    const { status: countriesStatus, data: countriesData } =
      await CountriesServices.getAllCountries();
    const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(1);
    const { status: usersStatus, data: usersData } = await UserServices.getAllUsers();
    const { status: categoriesStatus, data: categoriesData } =
      await CategoriesServices.getAllCategories();
    const { status: companiesStatus, data: companiesData } =
      await CompaniesServices.getAllCompanies();

    if (
      countriesStatus == 200 &&
      citiesStatus == 200 &&
      usersStatus == 200 &&
      categoriesStatus == 200 &&
      companiesStatus == 200
    ) {
      setCountries(countriesData);
      setCities(citiesData);
      setUsers(usersData);
      setCategories(categoriesData);
      setCompanies(companiesData);
      setDataLoaded(true);
      return;
    }
  };
  if (!dataLoaded) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      <OfferFormUpdate
        onSubmit={updateOffer}
        users={users}
        cities={cities}
        countries={countries}
        categories={categories}
        companies={companies}
      />
    </DashboardLayout>
  );
}

export default EditOffer;
