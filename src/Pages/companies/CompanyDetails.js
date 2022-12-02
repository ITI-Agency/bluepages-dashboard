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

import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedinIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import LoadingDataLoader from "components/LoadingDataLoader";

import CompaniesServices from "Services/CompaniesServices";
import useFetch from "Hooks/useFetch";
import { useParams } from "react-router-dom";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data

// Images


import branch from "./branch.jpeg"
function CompanyDetails() {
  const { id: companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const getCompanyDetails = async () => {
    try {
      const response = await CompaniesServices.getCompanyDetails(companyId);
      if (response && response.status == 200) {
        setCompany(response.data);
      }
    } catch (error) {
      setCompany(false);
    }
  };
  useEffect(() => {
    getCompanyDetails();
    return () => {};
  }, []);

  if (company === false)
    return (
      <DashboardLayout>
        <p>There is an error.</p>
      </DashboardLayout>
    );
  if (company === null) return <LoadingDataLoader />;
	console.log({company})
  return (
    <DashboardLayout>
      <Header company={company} onTabChange={setActiveTab} activeTab={activeTab}>
        {activeTab == 0 && (
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4}>
                <PlatformSettings
                  company={company}
                  action={{ route: "edit-info", tooltip: "Edit Company details" }}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="Company details:"
                  description={company.description_en}
                  info={{
                    hotline: company.hotline,
                    mobile: company.standard_phone,
                    email: company.email,
                    country: company.country.name_en,
                    postCode: company.post_code,
                  }}
                  social={[
                    {
                      link: company.facebook,
                      icon: <FacebookIcon />,
                      color: "facebook",
                    },
                    {
                      link: company.twitter,
                      icon: <TwitterIcon />,
                      color: "twitter",
                    },
                    {
                      link: company.instagram,
                      icon: <InstagramIcon />,
                      color: "instagram",
                    },
                    // {
                    //   link: company.linkedin,
                    //   icon: <LinkedinIcon />,
                    //   color: "linkedin",
                    // },
                    {
                      link: company.website,
                      icon: <LanguageIcon />,
                      color: "website",
                    },
                  ]}
                  action={{ route: "edit-info", tooltip: "Edit Company Info" }}
                  shadow={false}
                />
                <Divider orientation="vertical" sx={{ mx: 0 }} />
              </Grid>
              {/* <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid> */}
            </Grid>
          </MDBox>
        )}
        {activeTab == 1 && (
          <>
            <MDBox pt={2} px={2} lineHeight={1.25}>
              <MDTypography variant="h6" fontWeight="medium">
                Branches
              </MDTypography>
              {/* <MDBox mb={1}>
                <MDTypography variant="button" color="text">
                  Architects design houses
                </MDTypography>
              </MDBox> */}
            </MDBox>
            <MDBox p={2}>
              <Grid container spacing={6}>
							{company.branches.map((b)=><Grid item xs={12} md={6} xl={3}>
                  <DefaultProjectCard
                    image={branch}
                    label={b.address_ar}
                    title={b.name_ar}
                    description={b.description_ar || " No Description for this branch"}
                    action={{
                      type: "internal",
                      route: "#",
                      color: "info",
                      label: "view Offer",
                    }}
                    
                  />
                </Grid>)}
                
              
              </Grid>
            </MDBox>
          </>
        )}
      </Header>
    </DashboardLayout>
  );
}

export default CompanyDetails;
