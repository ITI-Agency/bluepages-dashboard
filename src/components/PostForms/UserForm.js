import React from "react";

import { Button, Form, Input, Select } from "antd";
import { toast } from "react-toastify";
const { Option } = Select;
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};

function UserForm({ onSubmit }) {
  const onFinishFailed = (values) => {
    toast.error(values);
  };
  const roles = [
    {
      id: "SUPERVISOR",
      name: "supervisor",
    },
    {
      id: "USER",
      name: "user",
    },
    {
      id: "ADMIN",
      name: "admin",
    },
  ];
  return (
    <>
      <Form
        name="user"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        validateMessages={validateMessages}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Form.Item
              name="role"
              label="Role"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Select a user role">
                {roles.map((role) => (
                  <Option value={role.id} key={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Form.Item
              wrapperCol={{
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Create User
              </Button>
            </Form.Item>
          </Grid>
        </Grid>
      </Form>
    </>
  );
}

export default UserForm;
