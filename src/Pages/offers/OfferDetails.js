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

import useFetch from "Hooks/useFetch";
import { useParams } from "react-router-dom";

// Overview page components
import Header from "layouts/profile/components/Header/OfferHeader";
import PlatformSettings from "layouts/profile/components/PlatformSettings/OfferPlatformSettings";
import OffersServices from "Services/OffersServices";

// Data

// Images


function OfferDetails() {
  const { id: offerId } = useParams();
  const [offer, setOffer] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const getOfferDetails = async () => {
    try {
      const response = await OffersServices.getOfferDetails(offerId);
			setOffer(response);

    } catch (error) {
      setOffer(false);
    }
  };
  useEffect(() => {
    getOfferDetails();
    return () => {};
  }, []);

  if (offer === false)
    return (
      <DashboardLayout>
        <p>There is an error.</p>
      </DashboardLayout>
    );
  if (offer === null) return <LoadingDataLoader />;
	console.log({offer})
  return (
    <DashboardLayout>
      <Header offer={offer} onTabChange={setActiveTab} activeTab={activeTab}>
        {activeTab == 0 && (
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4}>
                <PlatformSettings
                  offer={offer}
                  action={{ route: "edit-info", tooltip: "Edit Company details" }}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="Company details:"
                  description={offer.description_ar}
                  info={{
                    hotline: offer.hotline,
                    mobile: offer.standard_phone,
                    email: offer.email,
                    country: offer.country.name_ar,
                    postCode: offer.post_code,
                  }}
                  social={[
                    {
                      link: offer.facebook,
                      icon: <FacebookIcon />,
                      color: "facebook",
                    },
                    {
                      link: offer.twitter,
                      icon: <TwitterIcon />,
                      color: "twitter",
                    },
                    {
                      link: offer.instagram,
                      icon: <InstagramIcon />,
                      color: "instagram",
                    },
                    // {
                    //   link: offer.linkedin,
                    //   icon: <LinkedinIcon />,
                    //   color: "linkedin",
                    // },
                    {
                      link: offer.website,
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
  
      </Header>
    </DashboardLayout>
  );
}

export default OfferDetails;
