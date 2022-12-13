import React, { useState, useEffect } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CompanyFormUpdate from "components/UpdateForms/CompanyFormUpdate";
import CompaniesServices from "Services/CompaniesServices";
import { toast } from "react-toastify";

import LoadingDataLoader from "components/LoadingDataLoader";
import { useNavigate, useParams } from "react-router-dom";
import { Paper,Container } from "@mui/material";
import {  Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import EditCompanyForm from "./EditCompanyForm";
import PageBranches from '../pageBranches/PageBranches';
import PagePhones from '../pagePhones/PagePhones';
import PageVideos from '../pageVideos/PageVideos';
function EditCompany() {
  const navigate = useNavigate();
  const { id: companyId } = useParams();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const company = new FormData();
  const getCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await CompaniesServices.getCompanyDetails(companyId);
      if (response && response.status == 200) {
        setLoading(false);
        setCompanyDetails(response.data);
      } else {
        toast.error("sorry something went wrong while getting company!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting company!");
      setLoading(false);
    }
  };
  useEffect(() => {
    getCompanyDetails();
  }, []);

  const handleSubmit = (formValues) => {
    Object.keys(formValues).forEach((t) => {
      if (formValues[t]) {
        //dont forget to check if files
        // if (t == "file") {
        //   testimonial.append(t, formValues[t][0].originFileObj);
        // }
        company.append(t, formValues[t]);
      }
    });
    // const company = e.value;
    updateCompanyData(company);
  };
  const updateCompanyData = async (company) => {
    company.id = companyId;
    setLoading(true);
    try {
      const response = await CompaniesServices.updateCompany(company);
      if (response && response.status == 200) {
        toast.success("your company has created successfully!");
        setLoading(false);
        navigate(`/companies`);
      } else {
        toast.error("sorry something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong!");
      setLoading(false);
    }
  };
  if (loading || !companyDetails) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      {/* <h1>Update Company</h1> */}
      <Container sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
				<Tabs>
				<TabPane tab="Company Information" key="company_information">
					<EditCompanyForm company={companyDetails} id={companyId}   />
				</TabPane>
				<TabPane tab="Company Branches" key="company_branches">
					<PageBranches company={companyDetails} />
				</TabPane>
				<TabPane tab="Company Phones" key="company_phones">
					<PagePhones company={companyDetails} />
				</TabPane>
				<TabPane tab="Company Videos" key="company_videos">
					<PageVideos company={companyDetails} />
				</TabPane>
			</Tabs>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}

export default EditCompany;
