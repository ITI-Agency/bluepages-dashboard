/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useMemo } from "react";

// react-router components
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import brandWhite from "assets/images/logoarabic.png";
import brandDark from "assets/images/logoarabic.png";

import NotFound from "./Pages/NotFound";
import SignIn from "Pages/sign-in";

import LoadingComponent from "components/LoadingComponent";

import { RequireAuth } from "routes";

import UserDetails from "Pages/users/UserDetails";
import CreateUser from "Pages/users/CreateUser";
import EditUser from "Pages/users/EditUser";

import CountryDetails from "Pages/countries/CountryDetails";
import CreateCity from "Pages/countries/CreateCity";
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
import CreatePage from "Pages/pages/CreatePage";
import EditPage from "Pages/pages/EditPage";

import BranchDetails from "Pages/branches/BranchDetails";
import CreateBranch from "Pages/branches/CreateBranch";
import EditBranch from "Pages/branches/EditBranch";

import CreateTestimonials from "Pages/testimonials/CreateTestimonials";
import EditTestimonials from "Pages/testimonials/EditTestimonials";

import useAuth from "Hooks/useAuth";
import useLoading from "Hooks/useLoading";

import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import {
  Hydrate,
  Query,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useRef } from "react";
import CreatePlanPackage from "Pages/planPackages/CreatePlanPackage";
import EditPlanPackage from "Pages/planPackages/EditPlanPackage";
import EditCity from "Pages/countries/EditCity";
// import "antd/dist/antd.css";
import CreateDirectory from "./Pages/directories/CreateDirectory";
import EditDirectory from "./Pages/directories/EditDirectory";

export default function App() {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    })
  );
  const [controller, dispatch] = useMaterialUIController();
  const { authed, login, logout } = useAuth();
  const { loading } = useLoading();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const navigateTo = useNavigate();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    handleAuthorization();
  }, [pathname]);

  // useEffect(() => {
  //   handleAuthorization();
  // }, []);
  const location = useLocation();
  const handleAuthorization = () => {
    if (sessionStorageItem("AUTH_JWT") && location.pathname == "/sign-in") {
      login().then(() => navigateTo("dashboard"));
    } else if (!sessionStorageItem("AUTH_JWT")) {
      logout().then(() => navigateTo("/sign-in"));
    } else {
      login();
    }
  };

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );
  if (loading) return <LoadingComponent />;
  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={
                (transparentSidenav && !darkMode) || whiteSidenav
                  ? brandDark
                  : brandWhite
              }
              brandName="Material Dashboard 2"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route component={Login} path={"/login"} exact={true} />
          <Route component={Logout} path={"/logout"} exact={true} />
          <Route component={UnAuthorized} path={"/unauthorized"} exact={true} />
          <Route component={NotFound} path={"**"} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <QueryClientProvider client={queryClient.current}>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={
                (transparentSidenav && !darkMode) || whiteSidenav
                  ? brandDark
                  : brandWhite
              }
              brandName="Material Dashboard 2"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            {/* <Configurator />
						{configsButton} */}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route
            exact
            path="/users/:id"
            element={
              <RequireAuth>
                <UserDetails />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/users/create"
            element={
              <RequireAuth>
                <CreateUser />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/users/edit/:id"
            element={
              <RequireAuth>
                <EditUser />
              </RequireAuth>
            }
          />
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
            path="/companies/:id/edit-info"
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
            path="/cities/create/:countryId"
            element={
              <RequireAuth>
                <CreateCity />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/cities/edit/:cityId/country/:countryId"
            element={
              <RequireAuth>
                <EditCity />
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
          {/* <Route
						exact
						path="/branches/:id"
						element={
							<RequireAuth>
								<BranchDetails />
							</RequireAuth>
						}
					/> */}
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
          <Route
            exact
            path="/pages/create"
            element={
              <RequireAuth>
                <CreatePage />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/pages/edit/:id"
            element={
              <RequireAuth>
                <EditPage />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/plan-packages/create"
            element={
              <RequireAuth>
                <CreatePlanPackage />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/plan-packages/edit/:id"
            element={
              <RequireAuth>
                <EditPlanPackage />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/directories/create"
            element={
              <RequireAuth>
                <CreateDirectory />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/directories/edit/:id"
            element={
              <RequireAuth>
                <EditDirectory />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/testimonials/create"
            element={
              <RequireAuth>
                <CreateTestimonials />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/testimonials/edit/:id"
            element={
              <RequireAuth>
                <EditTestimonials />
              </RequireAuth>
            }
          />

          <Route exact path="/sign-in" element={<SignIn />} />
          <Route exact path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
