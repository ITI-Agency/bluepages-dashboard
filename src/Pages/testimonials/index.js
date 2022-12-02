import React from "react";
import { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Modal from "@mui/material/Modal";
import MDTypography from "components/MDTypography";

import MDAvatar from "components/MDAvatar";
import { Icon } from "@mui/material";

import { toast } from "react-toastify";
import useFetch from "Hooks/useFetch";

import TestimonialsServices from "Services/TestimonialsServices";
import { Link, useNavigate } from "react-router-dom";

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

function Testimonials() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [open, setOpen] = useState({ state: false });

  useEffect(() => {
    getAllTestimonials();
  }, []);
  const getAllTestimonials = async () => {
    setLoading(true);
    try {
      const response = await TestimonialsServices.getAllTestimonials();
      if (response && response.status == 200) {
        setLoading(false);
        setData(response.data);
        setTestimonials(response.data);
      } else {
        toast.error("sorry something went wrong while getting testimonials!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting testimonials!");
      setLoading(false);
    }
  };

  const handleOpen = (id, name) => {
    setOpen({ state: true, id, name });
  };
  const handleClose = () => {
    setOpen({ state: false });
  };

  const handleDelete = async (testimonId) => {
    setLoading(true);
    try {
      const res = await TestimonialsServices.removeTestimonial(testimonId);
      if (res.status == 200) {
        handleClose();
        toast.success("your testimonial has removed successfully!");
        setLoading(false);
        // getAllTestimonials();
      } else {
        handleClose();
        toast.error("sorry something went wrong while removing testimonial!");
        setLoading(false);
      }
    } catch (error) {
      handleClose();
      toast.error("sorry something went wrong while removing testimonial!");
      setLoading(false);
    }
  };

  if (loading) return <LoadingDataLoader />;
  return (
    <DashboardLayout>
      <DataTable
        table={{
          columns: [
            { Header: "image", accessor: "image" },
            { Header: "name", accessor: "name" },
            { Header: "content", accessor: "content", width: "30%" },
            { Header: "rating", accessor: "rating" },
            { Header: "actions", accessor: "actions" },
          ],
          rows: testimonials.map((item) => {
            return {
              ...item,
              image: <MDAvatar src={item.image} alt={item.name} shadow="sm" />,
              name: (
                <>
                  <Link to={`/testimonials/${item.id}`}>
                    <MDBox lineHeight={1}>
                      <MDTypography display="block" variant="button" fontWeight="medium">
                        {item.name}
                      </MDTypography>
                      <MDTypography variant="caption">{item.job}</MDTypography>
                    </MDBox>
                  </Link>
                </>
              ),
              content: (
                <MDBox
                  width="20rem"
                  maxHeight="3rem"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  WebkitLineClamp="2"
                  display="-webkit-box"
                  WebkitBoxOrient="vertical"
                >
                  <MDTypography variant="caption">{item.content}</MDTypography>
                </MDBox>
              ),
              rating: (
                <MDBox display="flex" alignItems="center">
                  {item.rating}
                  <Icon fontSize="medium" color="warning">
                    star
                  </Icon>
                </MDBox>
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
                        onClick={() => handleOpen(item.id, item.name)}
                        variant="text"
                        color="error"
                      >
                        <Icon>delete</Icon>&nbsp;delete
                      </MDButton>
                    </MDBox>
                    <Link to={`/testimonials/edit/${item.id}`}>
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
        onClick={() => navigate("/testimonials/create")}
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
            Delete {open.name} testimonial
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

export default Testimonials;
