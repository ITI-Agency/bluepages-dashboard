import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { SearchOutlined } from "@ant-design/icons";

import DataTable from "examples/Tables/DataTable";
import LoadingDataLoader from "components/LoadingDataLoader";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Switch from "@mui/material/Switch";

import Modal from "@mui/material/Modal";
import { Icon } from "@mui/material";

import { toast } from "react-toastify";
import Highlighter from "react-highlight-words";

import useFetch from "Hooks/useFetch";
import moment from "moment";
import UserServices from "Services/UserServices";
import { Link, useNavigate } from "react-router-dom";
import useLoading from "Hooks/useLoading";
import Moment from "react-moment";
import { Button, Input, Space, Table } from "antd";

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

function Users() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState({ state: false });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const navigate = useNavigate();
  const searchInput = useRef(null);
  useEffect(() => {
    getAllUsers();
  }, []);



  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await UserServices.getAllUsers();
      if (response && response.status == 200) {
        setLoading(false);
        setData(response.data);
        setUsers(response.data);
      } else {
        toast.error("sorry something went wrong while getting users!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting users!");
      setLoading(false);
    }
  };

  const handleOpen = (item) => {
    setOpen({ state: true, item });
  };
  const handleClose = () => {
    setOpen({ state: false });
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      const res = await UserServices.removeUser(userId);
      if (res.status == 200) {
        handleClose();
        toast.success("this user has removed successfully!");
        setLoading(false);
        getAllUsers();
      } else {
        handleClose();
        toast.error("sorry something went wrong while removing user!");
        setLoading(false);
      }
    } catch (error) {
      handleClose();
      toast.error("sorry something went wrong while removing user!");
      setLoading(false);
    }
  };
  const handleStatusChange = async (e, item) => {
    const { id, status } = item;
    const dd = users.map((i) => {
      if (i.id == item.id) i.status = status;
      return i;
    });
    setUsers(dd);
    try {
      const res = await UserServices.updateUser({ id, status });
      if (res.status == 200) {
        toast.success("your status has updated successfully!");
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while updating status!");
        setLoading(false);
        getAllUsers();
      }
    } catch (error) {
      toast.error("sorry something went wrong while updating status!");
      setLoading(false);
      getAllUsers();
    }
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });



  if (loading) return <LoadingDataLoader />;
  const columns = [
    {
      title: "#",
      dataIndex: `id`,
      key: "id",
      render: (text, record) => (
        <p className="text-sm font-medium text-gray-900 ">{record.id}</p>
      ),
    },
    {
      title: "Name",
      dataIndex: `name`,
      key: "name",
      render: (text, record) => (
        <MDBox lineHeight={1}>
          <MDTypography
            display="block"
            variant="button"
            fontWeight="medium"
            color="info"
          >
            {record.name}
          </MDTypography>
        </MDBox>
      ),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: `email`,
      key: "email",
      render: (text, record) => (
        <MDBox lineHeight={1}>
          <MDTypography
            display="block"
            variant="button"
            fontWeight="medium"
            color="info"
          >
            {record.email}
          </MDTypography>
        </MDBox>
      ),
      ...getColumnSearchProps("email"),
    },
    {
      title: "Role",
      dataIndex: `role`,
      key: "role",
      render: (text, record) => (
        <MDBox lineHeight={1}>
          <MDTypography
            display="block"
            variant="button"
            fontWeight="medium"
            color="info"
          >
            {record.role}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      title: "Active",
      key: "status",
      render: (_, record) => (
        <>
                        <Switch
                    checked={record.status}
                    onChange={(e) => {
                      record.status = !record.status;
                      handleStatusChange(e, record);
                    }}
                  />
        </>
      ),
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Not Active",
          value: false,
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "created_at",
      key: "created_at",
      render: (_, record) => <Moment fromNow>{record.createdAt}</Moment>,
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "control",
      key: "action",
      render: (_, record) => (
        <>
                  <MDBox
                    display="flex"
                    alignItems="center"
                    mt={{ xs: 2, sm: 0 }}
                    ml={{ xs: -1.5, sm: 0 }}
                  >
                    <MDBox mr={1}>
                      <MDButton onClick={() => handleOpen(record)} variant="text" color="error">
                        <Icon>delete</Icon>&nbsp;delete
                      </MDButton>
                    </MDBox>
                    <Link to={`/users/edit/${record.id}`}>
                      <MDButton variant="text" color="dark">
                        <Icon>edit</Icon>&nbsp;edit
                      </MDButton>
                    </Link>
                  </MDBox>
        </>
      ),
    },
  ];
  return (
    <DashboardLayout>
      {/* <DataTable
        table={{
          columns: [
            { Header: "name", accessor: "name" },
            { Header: "role", accessor: "role" },
            { Header: "active", accessor: "status" },
            { Header: "actions", accessor: "actions" },
          ],
          rows: users.map((item) => {
            return {
              ...item,
              name: (
                <Link to={`/users/${item.id}`}>
                  <MDBox ml={2} lineHeight={1}>
                    <MDTypography display="block" variant="button" fontWeight="medium">
                      {item.name}
                    </MDTypography>
                    <MDTypography variant="caption">{item.email}</MDTypography>
                  </MDBox>
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
                      <MDButton onClick={() => handleOpen(item)} variant="text" color="error">
                        <Icon>delete</Icon>&nbsp;delete
                      </MDButton>
                    </MDBox>
                    <Link to={`/users/edit/${item.id}`}>
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
      /> */}
      <Table columns={columns} dataSource={users} />
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
        onClick={() => navigate("/users/create")}
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
            Delete {open.item?.name}
          </MDTypography>
          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton onClick={() => handleDelete(open.item?.id)} variant="text" color="error">
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

export default Users;
