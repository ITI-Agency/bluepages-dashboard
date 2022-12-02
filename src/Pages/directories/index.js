
import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Modal from "@mui/material/Modal";
import { Icon } from "@mui/material";
import LoadingDataLoader from "components/LoadingDataLoader";
import Switch from "@mui/material/Switch";

import { Link, useNavigate } from "react-router-dom";
import Moment from "react-moment";

import useFetch from "Hooks/useFetch";
import useLoading from "Hooks/useLoading";

import PagesServices from "Services/PagesServices";
import { toast } from "react-toastify";
import DirectoryService from "Services/DirectoryService";
import pdf from './pdf-icon.png';

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

function Pages() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [directories, setDirectories] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState({ state: false });
  useEffect(() => {
    getAllDirectories();
  }, []);

  const getAllDirectories = async () => {
    setLoading(true);
    try {
      const response = await DirectoryService.getAllDirectories();
      if (response && response.status == 200) {
        setLoading(false);
        setData(response.data);
        setDirectories(response.data);
      } else {
        toast.error("sorry something went wrong while getting directories!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting directories!");
      setLoading(false);
    }
  };

  const handleOpen = (id) => {
    setOpen({ state: true, id:id });
  };
  const handleClose = () => {
    setOpen({ state: false });
  };
  const handleDelete = async (pageId) => {
		console.log({pageId})
    try {
      const res = await DirectoryService.removeDirectory(pageId);
      if (res.status == 200) {
        handleClose();
        toast.success("this page was removed successfully!");
        setLoading(false);
        getAllDirectories();
      } else {
        handleClose();
        toast.error("sorry something went wrong while removing page!");
        setLoading(false);
      }
    } catch (error) {
      handleClose();
      toast.error("sorry something went wrong while removing page!");
      setLoading(false);
    }
  };
  // const handleStatusChange = async (e, item) => {
  //   const { id, status } = item;
  //   const dd = categories.map((i) => {
  //     if (i.id == item.id) i.status = status;
  //     return i;
  //   });
  //   setCategories(dd);
  //   try {
  //     const res = await CategoriesServices.updateCategory({ id, status });
  //     if (res.status == 200) {
  //       toast.success("your status has updated successfully!");
  //       setLoading(false);
  //     } else {
  //       toast.error("sorry something went wrong while updating status!");
  //       setLoading(false);
  //       getAllCategories();
  //     }
  //   } catch (error) {
  //     toast.error("sorry something went wrong while updating status!");
  //     setLoading(false);
  //     getAllCategories();
  //   }
  // };
  if (loading) return <LoadingDataLoader />;

  return (
    <DashboardLayout>
      <DataTable
        table={{
          columns: [
            { Header: "id", accessor: "id", width: "10%" },
            { Header: "City", accessor: "city.name_ar" },
            { Header: "Pdf", accessor: "pdf" },
            { Header: "Created", accessor: "createdAt" },
            { Header: "updated", accessor: "updatedAt" },
            // { Header: "status", accessor: "status" },
            { Header: "Actions", accessor: "actions" },
          ],
          rows: directories.map((item) => ({
            ...item,
            id: (
              <MDTypography display="block" variant="button" fontWeight="medium">
                {item.id}
              </MDTypography>
            ),
            pdf: (
							<a  target="_blank" href={item.pdf}>
								<img width="40px" src={pdf} alt="pdf-icon" />
							</a>
            ),
            createdAt: <Moment fromNow>{item.createdAt}</Moment>,
            updatedAt: <Moment fromNow>{item.updatedAt}</Moment>,
            // status: (
            //   <>
            //     <Switch
            //       checked={item.status}
            //       onChange={(e) => {
            //         item.status = !item.status;
            //         handleStatusChange(e, item);
            //       }}
            //     />
            //   </>
            // ),
            actions: (
              <>
                <MDBox
                  display="flex"
                  alignItems="center"
                  mt={{ xs: 2, sm: 0 }}
                  ml={{ xs: -1.5, sm: 0 }}
                >
                  <MDBox mr={1}>
                    <MDButton onClick={() => handleOpen(item.id)} variant="text" color="error">
                      <Icon>delete</Icon>&nbsp;delete
                    </MDButton>
                  </MDBox>
                  <Link to={`/directories/edit/${item.id}`}>
                    <MDButton variant="text" color="dark">
                      <Icon>edit</Icon>&nbsp;edit
                    </MDButton>
                  </Link>
                </MDBox>
              </>
            ),
          })),
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
        onClick={() => navigate("/directories/create")}
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
           هل أنت متاكد من الحذف؟
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

export default Pages;
