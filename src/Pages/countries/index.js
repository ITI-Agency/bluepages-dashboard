import React, { useState, useEffect } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import LoadingDataLoader from "components/LoadingDataLoader";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Modal from "@mui/material/Modal";
import MDTypography from "components/MDTypography";
import Switch from "@mui/material/Switch";

import { Icon } from "@mui/material";
import useFetch from "Hooks/useFetch";

import CountriesServices from "Services/CountriesServices";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

function Countries() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [open, setOpen] = useState({ state: false });

  useEffect(() => {
    getAllCountries();
  }, []);
  const getAllCountries = async () => {
    setLoading(true);
    try {
      const response = await CountriesServices.getAllCountries();
      if (response && response.status == 200) {
        setLoading(false);
        setData(response.data);
        setCountries(response.data);
      } else {
        toast.error("sorry something went wrong while getting countries!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting countries!");
      setLoading(false);
    }
  };

  const handleOpen = (id, name) => {
    setOpen({ state: true, id, name });
  };
  const handleClose = () => {
    setOpen({ state: false });
  };

  const handleDelete = async (countryId) => {

    setLoading(true);
    try {
      const res = await CountriesServices.removeCountry(countryId);
      if (res.status == 200) {
        handleClose();
        toast.success("this country has removed successfully!");
        setLoading(false);
        getAllCountries();
      } else {
        handleClose();
        toast.error("sorry something went wrong while removing country!");
        setLoading(false);
      }
    } catch (error) {
      handleClose();
      toast.error("sorry something went wrong while removing country!");
      setLoading(false);
    }
  };
  const handleStatusChange = async (e, item) => {
    const { id, status } = item;
    const dd = countries.map((i) => {
      if (i.id == item.id) i.status = status;
      return i;
    });
    setCountries(dd);
    try {
      const res = await CountriesServices.updateCountry({ id, status });
      if (res.status == 200) {
        toast.success("your status has updated successfully!");
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while updating status!");
        setLoading(false);
        getAllCountries();
      }
    } catch (error) {
      toast.error("sorry something went wrong while updating status!");
      setLoading(false);
      getAllCountries();
    }
  };

  if (loading) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      <DataTable
        table={{
          columns: [
            { Header: "Flag", accessor: "flag" },
            { Header: "Name", accessor: "name_ar" },
            { Header: "Code", accessor: "code" },
            { Header: "active", accessor: "status" },
            { Header: "actions", accessor: "actions" },
          ],
          rows: countries.map((item) => {
            return {
              ...item,
              flag: (
                <img src={item.flag} alt={item.name_en} style={{ width: "2rem", height: "2rem" }} />
              ),
              name_ar: (
                <Link to={`/countries/${item.id}`}>
                  <MDTypography style={{color:'blue'}} display="block" variant="button" >
                    {item.name_ar}
                  </MDTypography>
                </Link>
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
                    <Link to={`/countries/edit/${item.id}`}>
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
        onClick={() => navigate("/countries/create")}
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
            Delete {open.name_en}?
          </MDTypography>
          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton onClick={() => handleDelete(open.id)} variant="text" color="error">
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

export default Countries;

/**
 * TODO
 * 1- CREATE POST FORM IN COMPANIES.
 * 2- POST DATA OF COMPANY
 * 3- EDIT COMPANY DATA
 * 4- PERVIEW COMPANY DATA
 * 3- GET ALL POST TYPES
 * 4-
 */
