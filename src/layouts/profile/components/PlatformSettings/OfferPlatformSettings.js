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

import { useState } from "react";
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

function PlatformSettings({ offer, action }) {
  const { categories } = offer;
  const [followsMe, setFollowsMe] = useState(true);
  const [answersPost, setAnswersPost] = useState(false);
  const [mentionsMe, setMentionsMe] = useState(true);
  const [newLaunches, setNewLaunches] = useState(false);
  const [productUpdate, setProductUpdate] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Company details:
        </MDTypography>
        <MDTypography component={Link} to={action.route} variant="body2" color="secondary">
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </MDTypography>
      </MDBox>
      <MDBox p={2} lineHeight={1}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          description:
        </MDTypography>
        <MDTypography variant="button" color="text" fontWeight="light">
          {offer.description_en}
        </MDTypography>
      </MDBox>
      <MDBox pt={1} px={2}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Views: {offer.views}
        </MDTypography>
      </MDBox>
      <MDBox pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Categories:
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          {categories.map((category) => (
            <MDBox>
              <MDBadge badgeContent={category.name_en} color="info" variant="gradient" size="md" />
            </MDBox>
          ))}
        </MDBox>
      </MDBox>
      <MDBox pt={1} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Company User:
        </MDTypography>
        <MDBox>
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            name: {offer.user.name}
          </MDTypography>
        </MDBox>
        <MDBox>
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            email: {offer.user.email}
          </MDTypography>
        </MDBox>
        <MDBox>
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            user status:{" "}
            {offer.user.status ? (
              <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
            ) : (
              <MDBadge badgeContent="not active" color="danger" variant="gradient" size="sm" />
            )}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
