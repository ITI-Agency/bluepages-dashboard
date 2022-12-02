import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";
import DataTable from "examples/Tables/DataTable";
import { Icon } from "@mui/material";
import MDBox from "components/MDBox";

import useFetch from "Hooks/useFetch";

import BranchesServices from "Services/BranchesServices";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import MDTypography from "components/MDTypography";

function Branches() {
	const {data,isLoading} = useQuery(['branches'],BranchesServices.getAllBranches)
  const handleDelete = async (branchId) => {
    const res = await BranchesServices.removeBranch(branchId);
    console.log("this si the reponse form delete", res);
    if (res.status == 200) {
      navigate("/branches");
    }
  };
  // if (error)
  //   return (
  //     <DashboardLayout>
  //       <p>There is an error.</p>
  //     </DashboardLayout>
  //   );
    if (isLoading) return <LoadingDataLoader />;

  return (
    <DashboardLayout>
      <DataTable
        table={{
          columns: [
            { Header: "name", accessor: "name_en" },
          ],
          rows: data.data.map((item) =>({
            ...item,
            id: (
              <MDTypography display="block" variant="button" fontWeight="medium">
                {item.id}
              </MDTypography>
            ),
            name_en: (
              <MDTypography display="block" variant="button" fontWeight="medium">
                {item.name_en}
              </MDTypography>
            ),
            // createdAt: <Moment fromNow>{item.createdAt}</Moment>,
            // updatedAt: <Moment fromNow>{item.updatedAt}</Moment>,
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
            // actions: (
            //   <>
            //     <MDBox
            //       display="flex"
            //       alignItems="center"
            //       mt={{ xs: 2, sm: 0 }}
            //       ml={{ xs: -1.5, sm: 0 }}
            //     >
            //       <MDBox mr={1}>
            //         <MDButton onClick={() => handleOpen(item.id)} variant="text" color="error">
            //           <Icon>delete</Icon>&nbsp;delete
            //         </MDButton>
            //       </MDBox>
            //       <Link to={`/branches/edit/${item.id}`}>
            //         <MDButton variant="text" color="dark">
            //           <Icon>edit</Icon>&nbsp;edit
            //         </MDButton>
            //       </Link>
            //     </MDBox>
            //   </>
            // ),
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
        onClick={() => navigate("/branches/create")}
      >
        <Icon fontSize="medium" color="inherit">
          add
        </Icon>
      </MDBox>
    </DashboardLayout>
  );
}

export default Branches;
