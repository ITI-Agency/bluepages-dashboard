import React from "react";

import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "routes";

import CountryDetails from "Pages/countries/CountryDetails";
import CreateCountry from "Pages/countries/CreateCountry";
import EditCountry from "Pages/countries/EditCountry";

import CategoryDetails from "Pages/categories/CategoryDetails";
import CreateCategory from "Pages/categories/CreateCategory";
import EditCategory from "Pages/categories/EditCategory";

import CompanyDetails from "Pages/companies/CompanyDetails";
import CreateCompany from "Pages/companies/CreateCompany";
import EditCompany from "Pages/companies/EditCompany";

import OfferDetails from "Pages/offers/OfferDetails";
import CreateOffer from "Pages/offers/CreateOffer";
import EditOffer from "Pages/offers/EditOffer";

import BranchDetails from "Pages/branches/BranchDetails";
import CreateBranch from "Pages/branches/CreateBranch";
import EditBranch from "Pages/branches/EditBranch";

function PagesRoutes() {
  return (
    <Routes>
      <Route
        exact
        path="/companies/:id"
        element={
          <RequireAuth>
            <CompanyDetails />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/companies/create"
        element={
          <RequireAuth>
            <CreateCompany />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/companies/edit/:id"
        element={
          <RequireAuth>
            <EditCompany />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/categories/:id"
        element={
          <RequireAuth>
            <CategoryDetails />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/categories/create"
        element={
          <RequireAuth>
            <CreateCategory />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/categories/edit/:id"
        element={
          <RequireAuth>
            <EditCategory />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/countries/:id"
        element={
          <RequireAuth>
            <CountryDetails />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/countries/create"
        element={
          <RequireAuth>
            <CreateCountry />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/countries/edit/:id"
        element={
          <RequireAuth>
            <EditCountry />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/branches/:id"
        element={
          <RequireAuth>
            <BranchDetails />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/branches/create"
        element={
          <RequireAuth>
            <CreateBranch />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/branches/edit/:id"
        element={
          <RequireAuth>
            <EditBranch />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/offers/:id"
        element={
          <RequireAuth>
            <OfferDetails />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/offers/create"
        element={
          <RequireAuth>
            <CreateOffer />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/offers/edit/:id"
        element={
          <RequireAuth>
            <EditOffer />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default PagesRoutes;
