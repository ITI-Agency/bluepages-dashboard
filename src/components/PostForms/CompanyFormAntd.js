import React, { createRef, useState } from "react";

import { Button, Form, Select, Input, Space, Upload } from "antd";
const { Option } = Select;
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 0 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24 },
  },
};

function CompanyFormAntd({ onSubmit, users, cities, countries, categories, onCountryChange }) {
  const { useForm, Item, List } = Form;
  const form = useForm();
  const [bannerFile, setBannerFile] = useState([]);
  const [logoFile, setLogoFile] = useState([]);
  const [images, setImages] = useState([]);
  const validateMessages = {
    required: "${label} required!",
    types: {
      email: "${label} must be valid!",
    },
  };
  const handleSubmit = (data) => {
    console.log({ companyData: data });
    let formData = new FormData();
    // upload categories
    data.categories.forEach((cat) => {
      formData.append("categories[]", cat);
    });
    console.log({ phones: data.phones });
    console.log({ videos: data.videos });
    // phones
    data?.phones?.forEach((ph) => {
      formData.append("phones[]", ph);
    });
    // videos
    data?.videos?.forEach((vid) => {
      formData.append("videos[]", vid);
    });
    // branches
    data?.branches?.forEach((br, i) => {
      formData.append(`branches[${i}][name_ar]`, br?.name_ar);
      formData.append(`branches[${i}][name_en]`, br?.name_en);
      formData.append(`branches[${i}][address_ar]`, br?.address_ar);
      formData.append(`branches[${i}][address_en]`, br?.address_en);
      formData.append(`branches[${i}][description_en]`, br?.description_en || "");
      formData.append(`branches[${i}][description_ar]`, br?.description_ar || "");
      formData.append(`branches[${i}][phone]`, br?.phone || "");
      formData.append(`branches[${i}][link]`, br?.link || "");
    });
    delete data.categories;
    delete data.phones;
    delete data.videos;
    delete data.branches;

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    // upload images
    if (images?.fileList && images?.fileList?.length) {
      images.fileList.forEach((el) => {
        formData.append("images[]", el.originFileObj);
      });
    }

    if (logoFile?.fileList?.length) {
      formData.append("logoFile", logoFile.fileList[0].originFileObj);
    }
    if (bannerFile?.fileList?.length) {
      formData.append("bannerFile", bannerFile.fileList[0].originFileObj);
    }

    // return axios.post(`/companies`, formData);
    return onSubmit(formData);
  };
  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={handleSubmit}
        validateMessages={validateMessages}
      >
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography>Basic Info</Typography>
          </Grid>
          <Item style={{ marginBottom: 0 }}>
            <Grid item xs={12} sm={4}>
              <Item
                name="name_ar"
                rules={[{ required: true, message: "name in arabic is required" }]}
              >
                <Input placeholder="name in arabic" />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Item
                name="name_en"
                rules={[{ required: true, message: "name in english is required" }]}
              >
                <Input placeholder="name in english" />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Item
                name="email"
                rules={[{ type: "email", required: true, message: "enter a valid email" }]}
              >
                <Input placeholder="enter an email" />
              </Item>
            </Grid>
          </Item>

          <Item style={{ marginBottom: 0 }}>
            <Grid item xs={12} sm={4}>
              <Item name="userId" rules={[{ required: true, message: "please select user" }]}>
                <Select placeholder="select a user" allowClear>
                  {users?.map((u) => (
                    <Option key={u.id} value={u.id}>
                      {u.name_en ? u.name_en : u.name}
                    </Option>
                  ))}
                </Select>
              </Item>
            </Grid>
            <Item name="website" rules={[{ required: true, message: "website url is required" }]}>
              <Input placeholder="enter a website url" />
            </Item>
            <Item name="countryId" rules={[{ required: true, message: "please select country" }]}>
              <Select placeholder="select a country" allowClear onChange={onCountryChange}>
                {countries?.map((co) => (
                  <Option key={co.id} value={co.id}>
                    {co.name_en}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="cityId" rules={[{ required: true, message: "city is required" }]}>
              <Select placeholder="please choose a city" allowClear>
                {cities?.map((ci) => (
                  <Option key={ci.id} value={ci.id}>
                    {ci[`name_en`]}
                  </Option>
                ))}
              </Select>
            </Item>
          </Item>
          <Item style={{ marginBottom: 0 }}>
            <Item name="standard_phone" rules={[{ required: true, message: "رقم الهاتف مطلوب" }]}>
              <Input placeholder="رقم الهاتف الرئيسي" />
            </Item>

            <Item name="categories" rules={[{ required: true, message: "برجاء إختيار الأنشطه" }]}>
              <Select
                mode="multiple"
                allowClear
                placeholder="برجاء إختيار الأنشطه"
                // defaultValue={['a10', 'c12']}
                // onChange={handleChange}
                options={categories.map((cat) => ({
                  label: cat.name_en,
                  value: cat.id,
                }))}
              />
            </Item>
          </Item>
          <Item style={{ marginBottom: 0 }}>
            <Item
              name="description_ar"
              rules={[{ required: true, message: "الوصف باللغه العربيه مطلوب" }]}
            >
              <Item l>
                <TextArea placeholder="الوصف باللغه العربيه" rows={4} />
              </Item>
            </Item>
            <Item
              name="description_en"
              rules={[{ required: true, message: "الوصف باللغه الإنجليزيه مطلوب" }]}
            >
              <Item l>
                <TextArea placeholder="الوصف باللغه الإنجليزيه" rows={4} />
              </Item>
            </Item>
          </Item>
          <Grid item xs={12}>
            <Typography>Images</Typography>
          </Grid>
          <Item>
            <Item label="اللوجو " valuePropName="banner">
              {/* <ImgCrop rotate> */}
              <Upload
                onChange={({ fileList }) => {
                  setLogoFile({ fileList });
                }}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              {/* </ImgCrop> */}
            </Item>
            <Item label="بنر الشركه" valuePropName="logo">
              {/* <ImgCrop aspect={4.47} rotate> */}
              <Upload
                beforeUpload={() => false}
                onChange={({ fileList }) => {
                  setBannerFile({ fileList });
                }}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              {/* </ImgCrop> */}
            </Item>
          </Item>
          <Item label="صور الشركه" valuePropName="images" style={{ marginBottom: 0 }}>
            <Upload
              multiple={true}
              onChange={({ fileList }) => {
                setImages({ fileList });
              }}
              beforeUpload={() => false}
              action="/upload.do"
              listType="picture-card"
            >
              <div className="block">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Item>
          <Grid item xs={12}>
            <Typography>Addresses</Typography>
          </Grid>
          <Item className="mt-4 mb-0">
            <Item
              name="district_ar"
              rules={[{ required: true, message: "المنطقه باللغه العربيه مطلوب" }]}
            >
              <Input placeholder="المنطقه باللغه العربيه" />
            </Item>
            <Item
              name="district_en"
              rules={[{ required: true, message: "المنطقه باللغه الإنجليزيه مطلوب" }]}
            >
              <Input placeholder="المنطقه باللغه الإنجليزيه" />
            </Item>
            <Item
              name="street_ar"
              rules={[{ required: true, message: "الحي باللغه العربيه مطلوب" }]}
            >
              <Input placeholder="الحي باللغه العربيه" />
            </Item>
          </Item>
          <Item>
            <Item
              name="street_en"
              rules={[{ required: true, message: "الحي باللغه الإنجليزيه مطلوب" }]}
            >
              <Input placeholder="الحي باللغه الإنجليزيه" />
            </Item>
            <Item
              name="building_no"
              className="ltr:mr-4 rtl:ml-4 "
              style={{ display: "inline-block", width: "calc(33% - 8px)" }}
            >
              <Input placeholder="رقم المبني" />
            </Item>

            <Item name="post_code" style={{ display: "inline-block", width: "calc(33% - 8px)" }}>
              <Input placeholder="الرمز البريدي" />
            </Item>
          </Item>
          <Item>
            <Item
              className="ltr:mr-4 rtl:ml-4 "
              name="hotline"
              style={{ display: "inline-block", width: "calc(33% - 8px)" }}
            >
              <Input placeholder="الخط الساخن" />
            </Item>
            <Item
              name="commercial_reg"
              style={{ display: "inline-block", width: "calc(33% - 8px)" }}
            >
              <Input placeholder="رقم السجل" />
            </Item>

            {/* <Item name="post_code" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
							<Input placeholder="الرمز البريدي" />
						</Item> */}
          </Item>
          <Item style={{ width: "100%" }}>
            <Item
              className="ltr:mr-4 rtl:ml-4"
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <List
                name="phones"
                style={{ width: "100%" }}
                // rules={[
                //   {
                //     validator: async (_, names) => {
                //       if (!names || names.length < 2) {
                //         return Promise.reject(new Error('At least 2 passengers'));
                //       }
                //     },
                //   },
                // ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        // label={index === 0 ? 'Passengers' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "برجاء أضف رقم الهاتف أو قم بإلغاء هذا الحقل",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="أضف رقم هاتف" style={{ width: "80%" }} />
                        </Item>
                        {/* {fields.length > 1 ? ( */}
                        <MinusCircleOutlined
                          className="dynamic-delete-button ltr:ml-1 rtl:mr-1"
                          onClick={() => remove(field.name)}
                        />
                        {/* ) : null} */}
                      </Item>
                    ))}
                    <Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        style={{ width: "100%" }}
                      >
                        أضف أرقام هواتف أخري
                      </Button>
                      {/* <Button
                type="dashed"
                onClick={() => {
                  add('The head item', 0);
                }}
                style={{ width: '60%', marginTop: '20px' }}
                icon={<PlusOutlined />}
              >
                Add field at head
              </Button> */}
                      <ErrorList errors={errors} />
                    </Item>
                  </>
                )}
              </List>
            </Item>
            <Item style={{ display: "inline-block", width: "calc(50% - 8px)" }}>
              <List
                name="videos"
                style={{ width: "100%" }}

                // rules={[
                //   {
                //     validator: async (_, names) => {
                //       if (!names || names.length < 2) {
                //         return Promise.reject(new Error('At least 2 passengers'));
                //       }
                //     },
                //   },
                // ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        // label={index === 0 ? 'Passengers' : ''}
                        required={false}
                        key={field.key}
                        // style={{ width: '80%' }}
                      >
                        <Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "برجاء أضف اللينك أو قم بإلغاء هذا الحقل",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="أضف لينك يوتيوب" style={{ width: "80%" }} />
                        </Item>
                        {/* {fields.length > 1 ? ( */}
                        <MinusCircleOutlined
                          className="dynamic-delete-button ltr:ml-1 rtl:mr-1"
                          onClick={() => remove(field.name)}
                        />
                        {/* ) : null} */}
                      </Item>
                    ))}
                    <Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: "100%" }}
                        icon={<PlusOutlined />}
                      >
                        أضف لينكات اليوتيوب
                      </Button>
                      {/* <Button
                type="dashed"
                onClick={() => {
                  add('The head item', 0);
                }}
                style={{ width: '60%', marginTop: '20px' }}
                icon={<PlusOutlined />}
              >
                Add field at head
              </Button> */}
                      <ErrorList errors={errors} />
                    </Item>
                  </>
                )}
              </List>
            </Item>
            {/* <List name="branches">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                      <Item
                        {...restField}
                        name={[name, "name_ar"]}
                        rules={[{ required: true, message: "الإسم مطلوب" }]}
                      >
                        <Input placeholder="الإسم باللغه العربيه" />
                      </Item>
                      <Item
                        {...restField}
                        name={[name, "name_en"]}
                        rules={[{ required: true, message: "الإسم مطلوب" }]}
                      >
                        <Input placeholder="الإسم باللغه الإنجليزيه" />
                      </Item>
                      <Item
                        {...restField}
                        name={[name, "address_ar"]}
                        rules={[{ required: true, message: "العنوان مطلوب" }]}
                      >
                        <Input placeholder="العنوان بالعربيه" />
                      </Item>
                      <Item
                        {...restField}
                        name={[name, "address_en"]}
                        rules={[{ required: true, message: "العنوان مطلوب" }]}
                      >
                        <Input placeholder="العنوان بالإنجليزيه" />
                      </Item>
                      <Item
                        {...restField}
                        name={[name, "phone"]}
                        // rules={[{ required: true, message: "رقم الهاتف" }]}
                      >
                        <Input placeholder="رقم الهاتف" />
                      </Item>
                      <Item
                        {...restField}
                        name={[name, "link"]}
                        // rules={[{ required: true, message: "الرابط" }]}
                      >
                        <Input placeholder="الرابط" />
                      </Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      أضف فروع للشركه
                    </Button>
                  </Item>
                </>
              )}
            </List> */}
          </Item>
          <Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Item>
        </Grid>
      </Form>
    </div>
  );
}

export default CompanyFormAntd;
