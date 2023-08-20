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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

import React from "react";

// Material Dashboard 2 React layouts
import Dashboard from "Pages/dashboard";
import Companies from "Pages/companies";
import Categories from "Pages/categories";
import Countries from "Pages/countries";
import Users from "Pages/users";
import Offers from "Pages/offers";
import About from "Pages/pages/About";
import PrivacyPolicy from "Pages/pages/PrivacyPolicy";
import Contact from "Pages/pages/Contact";
import Testimonials from "Pages/testimonials";
import Settings from "Pages/settings";
import Pages from 'Pages/pages'
import Directories from 'Pages/directories'
import DirectoryRequests from 'Pages/directoryRequests'
import PlanPackages from 'Pages/planPackages'
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "Pages/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

import BusinessIcon from "@mui/icons-material/Business";

import useAuth from "Hooks/useAuth";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Branches from "Pages/branches";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: (
      <RequireAuth>
        <Users />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "Companies",
    key: "companies-admins",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/companies-admins",
    component: (
      <RequireAuth>
        <Companies />
      </RequireAuth>
    ),
    // child:
  },
  {
    type: "collapse",
    name: "Company Requests",
    key: "companies-requests",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/companies-requests",
    component: (
      <RequireAuth>
        <Companies />
      </RequireAuth>
    ),
    // child:
  },
  {
    type: "collapse",
    name: "Offers",
    key: "offers-admins",
    icon: <Icon fontSize="small">local_offer</Icon>,
    route: "/offers-admins",
    component: (
      <RequireAuth>
        <Offers />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "Offer Requests",
    key: "offers-requests",
    icon: <Icon fontSize="small">local_offer</Icon>,
    route: "/offers-requests",
    component: (
      <RequireAuth>
        <Offers />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "Categories",
    key: "categories",
    icon: <Icon fontSize="small">category</Icon>,
    route: "/cats",
    component: (
      <RequireAuth>
        <Categories />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "Countries",
    key: "countries",
    icon: <Icon fontSize="small">public</Icon>,
    route: "/countries",
    component: (
      <RequireAuth>
        <Countries />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "Testimonials",
    key: "testimonials",
    icon: <Icon fontSize="small">thumb_up_alt</Icon>,
    route: "/testimonials",
    component: (
      <RequireAuth>
        <Testimonials />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "planPackages",
    key: "planPackages",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/plan-packages",
    component: (
      <RequireAuth>
        <PlanPackages />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "pages",
    key: "pages",
    icon: <Icon fontSize="small">task</Icon>,
    route: "/pages",
    component: (
      <RequireAuth>
        <Pages />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "directories",
    key: "directories",
    icon: <Icon fontSize="small">inventory_2</Icon>,
    route: "/directories",
    component: (
      <RequireAuth>
        <Directories />
      </RequireAuth>
    ),
  },
  {
    type: "collapse",
    name: "Directory Requests",
    key: "directory-requests",
    icon: <Icon fontSize="small">local_shipping</Icon>,
    route: "/directory-requests",
    component: (
      <RequireAuth>
        <DirectoryRequests />
      </RequireAuth>
    ),
  },
	{
  type: "collapse",
  name: "Settings",
  key: "settings",
  icon: <Icon fontSize="small">settings</Icon>,
  route: "/settings",
  component: (
    <RequireAuth>
      <Settings />
    </RequireAuth>
  ),
},
  // {
  //   type: "collapse",
  //   name: "Branches",
  //   key: "branches",
  //   icon: <Icon fontSize="small">language</Icon>,
  //   route: "/branches",
  //   component: <Branches />,
  // },
  // to be showen
  // {
  //   type: "collapse",
  //   name: "Directories",
  //   key: "directories",
  //   icon: <Icon fontSize="small">bookmark_border</Icon>,
  //   route: "/directories",
  //   component: (
  //     <RequireAuth>
  //       <RequestDirectory />
  //     </RequireAuth>
  //   ),
  // },
  // to be showen


  // {

  //   type: "collapse",
  //   name: "About",
  //   key: "about",
  //   icon: <Icon fontSize="small">info</Icon>,
  //   route: "/pages/about",
  //   component: (
  //     <RequireAuth>
  //       <About />
  //     </RequireAuth>
  //   ),
  // },

  // to be showen
  // {
  //   type: "collapse",
  //   name: "PrivacyPolicy",
  //   key: "PrivacyPolicy",
  //   icon: <Icon fontSize="small">privacy_tip</Icon>,
  //   route: "/pages/privacy-policy",
  //   component: (
  //     <RequireAuth>
  //       <PrivacyPolicy />
  //     </RequireAuth>
  //   ),
  // },
  //
  //
  //
  // {
  //   type: "collapse",
  //   name: "Contact",
  //   key: "contact",
  //   icon: <Icon fontSize="small">perm_contact_calendar</Icon>,
  //   route: "/notifications",
  //   component: (
  //     <RequireAuth>
  //       <Notifications />
  //     </RequireAuth>
  //   ),
  // },

  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/sign-in",
  //   component: <SignIn />,
  // },
];

export default routes;

export function RequireAuth({ children }) {
  const { authed } = useAuth();

  return authed ? children : <Navigate to="/sign-in" replace />;
}
