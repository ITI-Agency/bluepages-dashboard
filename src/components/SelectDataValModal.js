import React, { useState, useEffect } from "react";

import { Icon } from "@mui/material";
import Modal from "@mui/material/Modal";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import { Button, Form, Select } from "antd";

import CountriesServices from "Services/CountriesServices";

const { Option } = Select;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function SelectDataValModal({ openModal, onCloseModal, onSubmit }) {
  useEffect(() => {
    getCountries();
  }, []);
  const getCountryCities = async (id) => {
    const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(id);
    if (citiesStatus == 200) {
      setCities(citiesData);
    }
  };
  const getCountries = async () => {
    setLoading(true);
    try {
      const response = await CountriesServices.getAllCountries();
      if (response && response.status == 200) {
        setCountries(response.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const onCountryChange = (e) => {
    console.log("this is e:>", e);
    getCountryCities(e);
  };
  // const handleImport = (values) => {
  //   console.log("thsi s values:>", values);
  // };
  return (
    <Modal
      open={openModal}
      onClose={onCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Form {...layout} name="control-hooks" onFinish={onSubmit}>
        <MDBox sx={style}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Form.Item name="countryId" label="Country" rules={[{ required: true }]}>
                <Select placeholder="Select a Country" onChange={onCountryChange} allowClear>
                  {countries.map((country) => (
                    <Option value={country.id} key={country.id}>
                      {country.name_en}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid>
            {cities.length && (
              <Grid item xs={12} sm={6}>
                <Form.Item name="cityId" label="City" rules={[{ required: true }]}>
                  <Select placeholder="Select a City" allowClear>
                    {cities.map((city) => (
                      <Option value={city.id} key={city.id}>
                        {city.name_en}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>
            )}
          </Grid>
          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Import
                </Button>
              </Form.Item>
            </MDBox>
            <MDButton onClick={onCloseModal} variant="text" color="dark">
              cancel
            </MDButton>
          </MDBox>
        </MDBox>
      </Form>
    </Modal>
  );
}

export default SelectDataValModal;
