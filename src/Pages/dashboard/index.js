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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import LoadingDataLoader from "components/LoadingDataLoader";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import SettingsServices from "Services/SettingsServices";
import { useState } from "react";
import { useEffect } from "react";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const { sales, tasks } = reportsLineChartData;
  useEffect(() => {
    getAllStatistics();
  }, []);

  const getAllStatistics = async () => {
    setLoading(true);
    try {
      const response = await SettingsServices.getStatistics();
      if (response && response.status == 200) {
        setLoading(false);
        setStatistics(response.data);
      } else {
        localStorage.removeItem("AUTH_JWT");
        toast.error("sorry something went wrong while getting statistics!");
        setLoading(false);
      }
    } catch (error) {
      localStorage.removeItem("AUTH_JWT");
      toast.error("sorry something went wrong while getting statistics!");
      setLoading(false);
    }
  };
  if (loading) return <LoadingDataLoader />;

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="leaderboard"
                title="Users"
                count={`${statistics?.usersCount || 100}`}
                percentage={{
                  color: "success",
                  amount: statistics?.usersCount || 100,
                  label: "than lask year",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="menu_book"
                title="Companies"
                count={`${statistics?.companiesCount || 100}`}
                percentage={{
                  color: "success",
                  amount: statistics?.companiesCount || 100,
                  label: "than last year",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Offers"
                count={`${statistics?.offersCount || 100}`}
                percentage={{
                  color: "success",
                  amount: statistics?.offersCount || 100,
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="newspaper"
                title="Directories"
                count={`${statistics?.directoriesCount || 100}`}
                percentage={{
                  color: "success",
                  amount: statistics?.directoriesCount || 100,
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Grid container mt={4.5} spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="flag"
                title="Countries"
                count={`${statistics?.countriesCount || 100}`}
                percentage={{
                  color: "success",
                  amount: statistics?.countriesCount || 100,
                  label: "than lask year",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="location_city"
                title="Cities"
                count={`${statistics?.citiesCount || 100}`}
                percentage={{
                  color: "success",
                  amount: statistics?.citiesCount || 100,
                  label: "than last year",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="add_shopping_cart"
                title="Active Categories"
                count={`${statistics?.activecategoriesCount || 100}`}
                percentage={{
                  color: "success",
                  amount: statistics?.activecategoriesCount || 100,
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="request_page"
                title="Directory Requests"
                count={`${statistics?.requestDirectoriesCount || 100}`}
                percentage={{
                  color: "success",
                  amount: statistics?.requestDirectoriesCount || 100,
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox> */}
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
