import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import MDInput from "components/MDInput";
import Button from "@mui/material/Button";

import { useNavigate, useParams } from "react-router-dom";
import useFetch from "Hooks/useFetch";
import BranchesServices from "Services/BranchesServices";

function EditBranch() {
  const { id: branchId } = useParams();
  const navigate = useNavigate();
  const { data, error } = useFetch(() => BranchesServices.getBranchDetails(branchId));
  const [branch, setBranch] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (e) => {
    setBranch({ ...branch, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    const { id, name, email } = branch;
    const response = await BranchsServices.updateBranch({ id, name, email });
    console.log("this is update repsponse:>", response, response.statusText);
    if (response.statusText == "OK") {
      navigate("/branchs");
    }
    console.log("this is the response", response);
    setLoading(false);
  };

  useEffect(() => {
    if (data) setBranch(data);
  }, [data]);
  if (error)
    return (
      <DashboardLayout>
        <p>There is an error.</p>
      </DashboardLayout>
    );
  if (!data || loading) return <LoadingDataLoader />;
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
                  label="name en"
                  name="name_en"
                  value={branch.name_en}
                  onChange={handleFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="text"
                  label="name ar"
                  name="name_ar"
                  value={branch.name_ar}
                  onChange={handleFieldChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} mt={4}>
              <Button variant="contained" style={{ color: "#fff" }} onClick={handleFormSubmit}>
                Update
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}

export default EditBranch;
