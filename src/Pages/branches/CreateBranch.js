import React, { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import MDInput from "components/MDInput";
import Button from "@mui/material/Button";
import BranchesServices from "Services/BranchesServices";
import { useNavigate } from "react-router-dom";
import useLoading from "Hooks/useLoading";

function CreateBranch() {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [branch, setBranch] = useState({});
  const handleFieldChange = (e) => {
    branch[e.target.name] = e.target.value;
    setBranch(branch);
  };
  const handleFormSubmit = async () => {
    setLoading(true);
    const response = await BranchesServices.createBranch(branch);
    console.log(response);
    if (response.status == 201) {
      navigate("/branchs");
    }
    console.log("this is the response", response);
    setLoading(false);
  };
  return (
    <DashboardLayout>
      <Container sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
          <form>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="text"
                  label="Name English"
                  name="name_en"
                  onChange={handleFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="text"
                  label="Name Arabic"
                  name="name_ar"
                  onChange={handleFieldChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} mt={4}>
              <Button variant="contained" style={{ color: "#fff" }} onClick={handleFormSubmit}>
                Submit
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}

export default CreateBranch;
