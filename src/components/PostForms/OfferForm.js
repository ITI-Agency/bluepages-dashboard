import React, { useState, useEffect } from "react";
// import { Container } from "@mui/system";
// import { Grid } from "@mui/material";

import MDInput from "components/MDInput";
import SelectField from "components/SelectField";
import MultiSelectField from "components/MultiSelectField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import CountriesServices from "Services/CountriesServices";

function OfferForm({
  onSubmit,
  countries,
  cities,
  users,
  categories,
  companies,
  getCountryCities,
}) {
  const [offer, setOffer] = useState({});
  const [showSaleFields, setShowSaleFields] = useState(false);

  const [date, setDate] = useState(null);
  const saleTypes = [
    { id: "PERCENTAGE", name: "percentage %" },
    { id: "AMOUNT", name: "Fixed Amount" },
  ];
  const formData = new FormData();
  useEffect(() => {
    handleFieldChange({
      target: {
        name: "endAt",
        value: date?._d,
      },
    });
  }, [date]);
  const handleFieldChange = (e) => {
    const value = e.target.value;

    if (value == "true") {
      offer[e.target.name] = true;
    } else if (value == "false") {
      offer[e.target.name] = false;
    } else {
      offer[e.target.name] = value;
    }
    if (e.target.name == "on_sale") setShowSaleFields(offer[e.target.name]);
    // if (e.target.name == "paid") console.log("this is paid", typeof offer[e.target.name]);
    if (e.target.name == "countryId") getCountryCities(e.target.value);
    setOffer(offer);
  };
  const handleFormSubmit = (e) => {
    console.log("this is submition", offer);
    Object.keys(offer).forEach((c) => {
      if (c == "endAt") offer[c] = offer[c].toISOString();
      formData.append(c, offer[c]);
    });
    console.log("this is form data", formData);
    onSubmit(formData);
  };
  const handleFileFieldChange = (e) => {
    const files = e.target.files;
    console.log("thi si sfiles:>", files);
    // formData.append(e.target.name, [...files]);
    [...files].forEach((file) => {
      formData.append("images[]", file);
    });
  };

  return (
    <Container sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
        <form>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography>Basic Info</Typography>
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
              <SelectField
                options={countries}
                label="country"
                name="countryId"
                onSelect={handleFieldChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SelectField
                options={cities}
                label="city"
                name="cityId"
                onSelect={handleFieldChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SelectField
                options={users}
                label="user"
                name="userId"
                onSelect={handleFieldChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SelectField
                options={companies}
                label="Company"
                name="companyId"
                onSelect={handleFieldChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MultiSelectField
                options={categories}
                label="categories"
                name="categoryId"
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
              <Typography>Additional Info</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <MDInput
                fullWidth
                type="text"
                label="Address En"
                name="address_en"
                onChange={handleFieldChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MDInput
                fullWidth
                type="text"
                label="Address Ar"
                name="address_ar"
                onChange={handleFieldChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormLabel id="on_sale">On Sale</FormLabel>
              <RadioGroup
                row
                aria-labelledby="on_sale"
                defaultValue={false}
                name="on_sale"
                onChange={handleFieldChange}
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
            {showSaleFields && (
              <>
                <Grid item xs={12} sm={4}>
                  <MDInput
                    fullWidth
                    type="number"
                    label="Sale Amount"
                    name="sale_amount"
                    onChange={handleFieldChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <SelectField
                    options={saleTypes}
                    label="Sale Type"
                    name="sale_type"
                    onSelect={handleFieldChange}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={4}>
              <FormLabel id="paid">Paid</FormLabel>
              <RadioGroup
                row
                aria-labelledby="paid"
                defaultValue={false}
                name="paid"
                onChange={handleFieldChange}
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={4}>
              <DateTimePicker
                label="End At"
                name="endAt"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" component="label" style={{ color: "#fff" }}>
                Upload offer images
                <input
                  hidden
                  multiple
                  accept="image/*"
                  name="images"
                  type="file"
                  onChange={handleFileFieldChange}
                />
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} mt={4}>
            <Button variant="contained" style={{ color: "#fff" }} onClick={handleFormSubmit}>
              Submit
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default OfferForm;
