import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";
import UserServices from "Services/UserServices";

function EditUser() {
  const { useForm, Item } = Form;
  const [form] = useForm();
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const { id } = userDetails;
    try {
      const response = await UserServices.updateUser({ id, ...values });
      if (response && response.status == 200) {
        navigate("/users");
        toast.success("user details has updated successfully!");
      } else {
        toast.error("sorry something went wrong while update user details!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while update user details!");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);
  const getUserDetails = async () => {
    setLoading(true);
    try {
      const response = await UserServices.getUserDetails(userId);
      if (response && response.status == 200) {
        setLoading(false);
        setUserDetails(response.data);
        form.setFieldsValue({
          name: response.data.name,
          email: response.data.email,
        });
      } else {
        toast.error("sorry something went wrong while getting user details!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting user details!");
      setLoading(false);
    }
  };
  if (loading) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      <Container sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
          <Form
            name="user-edit"
            layout="vertical"
            form={form}
            onFinish={handleFormSubmit}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4}>
                <Item label="Name" name="name">
                  <Input />
                </Item>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "Please enter a valid email!",
                    },
                  ]}
                >
                  <Input />
                </Item>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Item
                  wrapperCol={{
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Update User
                  </Button>
                </Item>
              </Grid>
            </Grid>
          </Form>
          {/* <form>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="text"
                  label="name"
                  name="name"
                  value={user.name}
                  onChange={handleFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MDInput
                  fullWidth
                  type="email"
                  label="email"
                  name="email"
                  value={user.email}
                  onChange={handleFieldChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} mt={4}>
              <Button variant="contained" style={{ color: "#fff" }} onClick={handleFormSubmit}>
                Update
              </Button>
            </Grid>
          </form> */}
        </Paper>
      </Container>
    </DashboardLayout>
  );
}

export default EditUser;
