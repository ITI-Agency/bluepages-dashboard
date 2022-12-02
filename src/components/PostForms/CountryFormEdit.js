import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, Rate, Upload } from "antd";
const { TextArea } = Input;

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

function CountryFormEdit({ mutation, country }) {
  const { useForm, Item } = Form;
  const [form] = useForm();
  console.log(country)
  // useEffect(() => {
    if (country) {
      form.setFieldsValue({
        name_ar: country.name_ar,
        name_en: country.name_en,
        code: country.code,
        title_ar: country.title_ar,
        title_en: country.title_en,
        subtitle_ar: country.subtitle_ar,
        subtitle_en: country.subtitle_en,
      });
    }
  // }, []);

  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <>

      <Container sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
          <img className="relative top-10 " src={country.flag} alt={country.name_en} style={{ width: "6rem", height: "6rem" }} />
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            onFinish={mutation.mutate}
            initialValues={{}}
            form={form}
            className='-mt-14'
          >
            <Item label="Flag" name="file" getValueFromEvent={getFile} valuePropName="fileList">
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

            <Item label="Name ar" name="name_ar" rules={[{ required: true, message: 'برجاء إختيار المستخدم' }]}>
              <Input />
            </Item>
            <Item label="Name en" name="name_en" rules={[{ required: true, message: 'برجاء إختيار المستخدم' }]}>
              <Input />
            </Item>
            <Item label="Code" name="code" rules={[{ required: true, message: 'برجاء إختيار الكود' }]}>
              <Input />
            </Item>
            <Item label="Title ar" name="title_ar" rules={[{ required: true, message: 'برجاء إختيار العنوان' }]}>
              <Input />
            </Item>
            <Item label="Title en" name="title_en" rules={[{ required: true, message: 'برجاء إختيار العنوان' }]}>
              <Input />
            </Item>
            <Item label="Subtitle ar" name="subtitle_ar" rules={[{ required: true, message: 'برجاء إختيار العنوان الفرعي' }]}>
              <Input />
            </Item>
            <Item label="Subtitle en" name="subtitle_en" rules={[{ required: true, message: 'برجاء إختيار العنوان الفرعي' }]}>
              <Input />
            </Item>

            <Item
              wrapperCol={{
                span: 12,
                offset: 4,
              }}
            >
              <Button className="text-white bg-blue-500" type="primary" htmlType="submit">
                {country ? "Update" : "Submit"}
              </Button>
            </Item>
          </Form>
        </Paper>
      </Container>
    </>

  );
}

export default CountryFormEdit;
