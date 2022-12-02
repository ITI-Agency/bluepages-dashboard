import React, { useState, useEffect } from "react";
// import { Container } from "@mui/system";
// import { Grid } from "@mui/material";

import MDInput from "components/MDInput";
import SelectField from "components/SelectField";
import MultiSelectField from "components/MultiSelectField";
import Button from "@mui/material/Button";

import { UploadOutlined } from "@ant-design/icons";
import { Button as AntBtn, Upload } from "antd";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ImageUploader from "components/ImageUploader";

function CompanyForm({ onSubmit, countries, cities, users, categories, onCountryChange }) {
  const [company, setCompany] = useState({});
  const [files, setFiles] = useState([]);
  const formData = new FormData();
  // useEffect(() => {}, [countries]);
  const handleFieldChange = (e) => {
    if (e.target.name == "countryId") {
      onCountryChange(e.target.value);
    }
    company[e.target.name] = e.target.value;
    setCompany(company);
  };
  const handleFormSubmit = (e) => {
    console.log("this is submition", company);
    Object.keys(company).forEach((c) => {
      if (c == "categories") {
        company[c].map((category) => formData.append("categories[]", category));
      } else {
        formData.append(c, company[c]);
      }
    });
    files.forEach((file) => {
      formData.append(file.filename, file.file);
    });
    console.log("this is form data", formData);
    onSubmit(formData);
  };
  const handleFileFieldChange = (e) => {
    setFiles([
      ...files,
      {
        filename: e.target.name,
        file: e.target.files[0],
      },
    ]);
    // formData.append(e.target.name, e.target.files[0]);
  };
  // const handleImageChange = (e, name) => {
  //   setFiles([...files, { filename: name, file: filesObj.file.originFileObj }]);
  //   // formData.append(files.filename, files.file);
  //   console.log("this  is files:>", filesObj);
  // };
  return (
    <form>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Typography>Basic Info</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" component="label" style={{ color: "#fff" }}>
            Upload Company Logo
            <input
              hidden
              multiple
              accept="image/*"
              name="logoFile"
              type="file"
              onChange={handleFileFieldChange}
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" component="label" style={{ color: "#fff" }}>
            Upload Company Banner
            <input
              hidden
              multiple
              accept="image/*"
              name="bannerFile"
              type="file"
              onChange={handleFileFieldChange}
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            type="text"
            fullWidth
            label="Name Ar"
            name="name_ar"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="Name En"
            name="name_en"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput fullWidth type="email" label="Email" name="email" onChange={handleFieldChange} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="phone"
            label="Phone"
            name="standard_phone"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="url"
            label="Website Url"
            name="website"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectField
            options={countries}
            label="country"
            name="countryId"
            onSelect={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectField options={cities} label="city" name="cityId" onSelect={handleFieldChange} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectField options={users} label="user" name="userId" onSelect={handleFieldChange} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MultiSelectField
            options={categories}
            label="categories"
            name="categories"
            onSelect={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="Description En"
            name="description_en"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="Description Ar"
            name="description_ar"
            onChange={handleFieldChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography>Address</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="Street En"
            name="street_en"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="Street Ar"
            name="street_ar"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="District En"
            name="district_en"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="District Ar"
            name="district_ar"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="Building No"
            name="building_no"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="commercial reg"
            name="commercial_reg"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="post code"
            name="post_code"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="degree"
            name="degree"
            onChange={handleFieldChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="hotline"
            name="hotline"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="agent_name"
            name="agent_name"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="latitude"
            name="latitude"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="text"
            label="longitude"
            name="longitude"
            onChange={handleFieldChange}
          />
        </Grid>

        {/* <Grid item xs={12} sm={4}>
              <Button variant="contained" component="label" style={{ color: "#fff" }}>
                Upload Banner
                <input
                  hidden
                  accept="image/*"
                  name="bannerFile"
                  type="file"
                  onChange={handleFileFieldChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" component="label" style={{ color: "#fff" }}>
                Upload Logo
                <input
                  hidden
                  accept="image/*"
                  name="logoFile"
                  type="file"
                  onChange={handleFileFieldChange}
                />
              </Button>
            </Grid> */}
        <Grid item xs={12}>
          <Typography>Social</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="url"
            label="facebook"
            name="facebook"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="url"
            label="twitter"
            name="twitter"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="url"
            label="linkedin"
            name="linkedin"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="url"
            label="whatsapp"
            name="whatsapp"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="url"
            label="snapchat"
            name="snapchat"
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MDInput
            fullWidth
            type="url"
            label="instagram"
            name="instagram"
            onChange={handleFieldChange}
          />
        </Grid>

        {/* <Grid item xs={12}>
              <Typography>Images</Typography>
            </Grid>
            <Grid item xs={12}>
              <ImageUploader />
            </Grid> */}
      </Grid>
      <Grid item xs={12} sm={6} mt={4}>
        <Button variant="contained" style={{ color: "#fff" }} onClick={handleFormSubmit}>
          Submit
        </Button>
      </Grid>
    </form>
  );
}

export default CompanyForm;
