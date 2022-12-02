import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, Rate, Upload } from "antd";
const { TextArea } = Input;

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

function TestimonialForm({ onSubmit, testimonialDetails }) {
  const { useForm, Item } = Form;
  const [form] = useForm();
  useEffect(() => {
    if (testimonialDetails) {
      form.setFieldsValue({
        name: testimonialDetails.name,
        job: testimonialDetails.job,
        rating: testimonialDetails.rating,
        content: testimonialDetails.content,
      });
    }
  }, [testimonialDetails]);

  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Container sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={onSubmit}
          initialValues={{}}
          form={form}
        >
          <Item label="Image" name="file" getValueFromEvent={getFile} valuePropName="fileList">
            <Upload beforeUpload={() => false} listType="picture-card">
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </div>
            </Upload>
          </Item>
          <Item label="Name" name="name">
            <Input />
          </Item>
          <Item name="rating" label="Rate">
            <Rate />
          </Item>
          <Item label="Job" name="job">
            <Input />
          </Item>
          <Item label="Content" name="content">
            <TextArea rows={4} />
          </Item>
          <Item
            wrapperCol={{
              span: 12,
              offset: 4,
            }}
          >
            <Button type="primary" htmlType="submit">
              {testimonialDetails ? "Update" : "Submit"}
            </Button>
          </Item>
        </Form>
      </Paper>
    </Container>
  );
}

export default TestimonialForm;
