import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import LoadingDataLoader from "components/LoadingDataLoader";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Switch from "@mui/material/Switch";
import Modal from "@mui/material/Modal";
import { Icon } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import CountriesServices from "Services/CountriesServices";
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
function CountryDetails() {
  const { id: countryId } = useParams();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState({});
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState({ state: false });
  const navigate = useNavigate();

  const getCountryDetils = async () => {
    setLoading(true);
    try {
      const response = await CountriesServices.getCountryDetails(countryId);
      if (response && response.status == 200) {
        setCountry(response.data);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("sorry somthing went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.error("sorry somthing went wrong");
    }
  };
  const getAllCities = async () => {
    setLoading(true);
    try {
      const response = await CountriesServices.getAllCities(countryId);
      if (response && response.status == 200) {
        setCities(response.data);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("sorry somthing went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.error("sorry somthing went wrong");
    }
  };
  useEffect(() => {
    getCountryDetils();
    getAllCities();
  }, []);
  const handleOpen = (item) => {
    setOpen({ state: true, item });
  };
  const handleClose = () => {
    setOpen({ state: false });
  };
  const handleDelete = async (cityId) => {
    setLoading(true);
    try {
      const res = await CountriesServices.removeCity(cityId);
      if (res.status == 200) {
        handleClose();
        toast.success("this city has removed successfully!");
        setLoading(false);
        getAllCities();
      } else {
        handleClose();
        toast.error("sorry something went wrong while removing city!");
        setLoading(false);
      }
    } catch (error) {
      handleClose();
      toast.error("sorry something went wrong while removing city!");
      setLoading(false);
    }
  };
  const handleStatusChange = async (e, item) => {
    const { id, status } = item;
    const dd = cities.map((i) => {
      if (i.id == item.id) i.status = status;
      return i;
    });
    setCities(dd);
    try {
      const res = await CountriesServices.updateCity({ id, status });
      if (res.status == 200) {
        toast.success("your status has updated successfully!");
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while updating status!");
        setLoading(false);
        getAllCities();
      }
    } catch (error) {
      toast.error("sorry something went wrong while updating status!");
      setLoading(false);
      getAllCities();
    }
  };
  if (loading) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      <MDBox>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {country.name_en}
        </MDTypography>
      </MDBox>
      <DataTable
        table={{
          columns: [
            { Header: "image", accessor: "image" },
            { Header: "Name", accessor: "name_en" },
            { Header: "active", accessor: "status" },
            { Header: "actions", accessor: "actions" },
          ],
          rows: cities.map((item) => {
            return {
              ...item,
              image: (
                <img
                  src={item.image}
                  alt={item.name_en}
                  style={{ width: "2rem", height: "2rem" }}
                />
              ),
              name_en: (
                <MDTypography display="block" variant="button" fontWeight="medium">
                  {item.name_en}
                </MDTypography>
              ),
              status: (
                <>
                  <Switch
                    checked={item.status}
                    onChange={(e) => {
                      item.status = !item.status;
                      handleStatusChange(e, item);
                    }}
                  />
                </>
              ),
              actions: (
                <>
                  <MDBox
                    display="flex"
                    alignItems="center"
                    mt={{ xs: 2, sm: 0 }}
                    ml={{ xs: -1.5, sm: 0 }}
                  >
                    <MDBox mr={1}>
                      <MDButton
                        onClick={() => handleOpen(item.id, item.name_en)}
                        variant="text"
                        color="error"
                      >
                        <Icon>delete</Icon>&nbsp;delete
                      </MDButton>
                    </MDBox>
                    <Link to={`/cities/edit/${item.id}/country/${countryId}`}>
                      <MDButton variant="text" color="dark">
                        <Icon>edit</Icon>&nbsp;edit
                      </MDButton>
                    </Link>
                  </MDBox>
                </>
              ),
            };
          }),
        }}
      />
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="3.25rem"
        height="3.25rem"
        bgColor="white"
        shadow="sm"
        borderRadius="50%"
        position="fixed"
        right="2rem"
        bottom="2rem"
        zIndex={99}
        color="dark"
        sx={{ cursor: "pointer" }}
        onClick={() => navigate(`/cities/create/${country.id}`)}
      >
        <Icon fontSize="medium" color="inherit">
          add
        </Icon>
      </MDBox>
      <Modal
        open={open.state}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox sx={style}>
          <MDTypography id="modal-modal-title" variant="h6" component="h2">
            Delete {open.name_en} ?
          </MDTypography>
          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton onClick={() => handleDelete(open.item)} variant="text" color="error">
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
            <MDButton onClick={handleClose} variant="text" color="dark">
              cancel
            </MDButton>
          </MDBox>
        </MDBox>
      </Modal>
    </DashboardLayout>
  );
}

export default CountryDetails;
