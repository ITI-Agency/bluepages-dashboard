import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, Rate, Upload } from "antd";
const { TextArea } = Input;

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

function CityForm({ onSubmit }) {
  const { useForm, Item } = Form;

  const [form] = useForm();

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
            <Upload beforeUpload={() => false} listType="picture-card" rules={[{ required: true, message: 'برجاء إختيار المستخدم' }]}>
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

          <Item label="Name ar" name="name_ar" rules={[{ required: true, message: 'برجاء إختيار الاسم' }]}>
            <Input />
          </Item>

          <Item label="Name en" name="name_en" rules={[{ required: true, message: 'برجاء إختيار الاسم' }]}>

            <Input />
          </Item>

          <Item
            wrapperCol={{
              span: 12,
              offset: 4,
            }}
          >
            <Button type="primary" htmlType="submit">
              {"Submit"}
            </Button>
          </Item>
        </Form>
      </Paper>
    </Container>
  );
}

export default CityForm;
