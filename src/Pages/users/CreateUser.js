import React, { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import MDInput from "components/MDInput";
import SelectField from "components/SelectField";
import Button from "@mui/material/Button";
import UserServices from "Services/UserServices";
import { useNavigate } from "react-router-dom";
import useLoading from "Hooks/useLoading";
import UserForm from "components/PostForms/UserForm";
import { toast } from "react-toastify";

function CreateUser() {
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const handleFormSubmit = async (user) => {
    setLoading(true);
    try {
      const response = await UserServices.createUser(user);
      if (response.status == 201) {
        navigate("/users");
        setLoading(false);
        toast.success("User created Successfully!");
      } else {
        setLoading(false);
        toast.error("there something went wrong!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("there something went wrong!");
    }
  };

  return (
    <DashboardLayout>
      <Container sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
          <UserForm onSubmit={handleFormSubmit} />
          {/* <form>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="text"
                  label="name"
                  name="name"
                  onChange={handleFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="email"
                  label="email"
                  name="email"
                  onChange={handleFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="password"
                  label="password"
                  name="password"
                  onChange={handleFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  onChange={handleFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectField
                  options={roles}
                  label="role"
                  name="role"
                  onSelect={handleFieldChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} mt={4}>
              <Button variant="contained" style={{ color: "#fff" }} onClick={handleFormSubmit}>
                Submit
              </Button>
            </Grid>
          </form> */}
        </Paper>
      </Container>
    </DashboardLayout>
  );
}

export default CreateUser;
