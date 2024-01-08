import { useState, useEffect, useRef } from "react";
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
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Select, Table, Input, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import Highlighter from "react-highlight-words";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import moment from "moment";
import useFetch from "Hooks/useFetch";
import useLoading from "Hooks/useLoading";
import * as xls from "xlsx";
import xlsx from "json-as-xlsx";
import CategoriesServices from "Services/CategoriesServices";
import { toast } from "react-toastify";
// import * as xls from "xlsx";
// import xlsx from "json-as-xlsx";

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
function Categories() {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [importedData, setImportedData] = useState([]);
  const [open, setOpen] = useState({ state: false });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openSelectModal, setOpenSelectModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [opencategoriesMergeModal, setOpencategoriesMergeModal] =
    useState(false);
  const [merging, setMerging] = useState(false);

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const handleExport = async () => {
    setIsExporting(true);
    const columns = [
      {
        label: "id",
        value: "id",
      },
      {
        label: "name_en",
        value: "name_en",
      },
      {
        label: "name_ar",
        value: "name_ar",
      },
      { label: "status", value: "status" },
      {
        label: "views",
        value: "views",
      },
      { label: "created_at", value: "created_at" },
      { label: "is_offer", value: "is_offer" },
    ];
    const settings = {
      fileName: "bluePages Categories",
    };
    const data = [
      {
        sheet: "Categories",
        columns,
        content: categories,
      },
    ];
    xlsx(data, settings, (sheet) => {
      console.log("Download complete:", sheet);
    });
    setIsExporting(false);
  };
  const handleDeleteSelected = async () => {
    setLoading(true);
    try {
      const response = await CategoriesServices.deleteMultipleCategory({
        data: { ids: selectedRowKeys },
      });
      if (response && response.status == 200) {
        toast.success("success to delete data");
        setLoading(false);
        getAllCategories();
      } else {
        toast.error("something went wrong!");
        setLoading(false);
        getAllCategories();
      }
    } catch (error) {
      toast.error("something went wrong!");
      setLoading(false);
      getAllCategories();
    }
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

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const response = await CategoriesServices.getAllCategories();
      if (response && response.status == 200) {
        setLoading(false);
        setData(response.data);
        setCategories(response.data);
      } else {
        toast.error("sorry something went wrong while getting categories!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting categories!");
      setLoading(false);
    }
  };

  const handleOpen = (item) => {
    setOpen({ state: true, item });
  };
  const handleClose = () => {
    setOpen({ state: false });
  };
  const handleDelete = async (categoryId) => {
    console.log({ categoryId });
    setLoading(true);
    try {
      const res = await CategoriesServices.deleteCategory(categoryId);
      if (res.status == 200) {
        handleClose();
        toast.success("this category has removed successfully!");
        setLoading(false);
        getAllCategories();
      } else {
        handleClose();
        toast.error("sorry something went wrong while removing category!");
        setLoading(false);
      }
    } catch (error) {
      console.log({ error });
      handleClose();
      toast.error("sorry something went wrong while removing category!");
      setLoading(false);
    }
  };
  const handleStatusChange = async (e, item) => {
    console.log({ item });
    const { id, status } = item;
    const dd = categories.map((i) => {
      if (i.id == item.id) i.status = status;
      return i;
    });
    setCategories(dd);
    try {
      const res = await CategoriesServices.updateCategory({ status }, id);
      if (res.status == 200) {
        toast.success("your status has updated successfully!");
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while updating status!");
        setLoading(false);
        getAllCategories();
      }
    } catch (error) {
      toast.error("sorry something went wrong while updating status!");
      setLoading(false);
      getAllCategories();
    }
  };

  const handleImportFile = (e) => {
    setLoading(true);
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xls.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xls.utils.sheet_to_json(worksheet);
        setImportedData(json);
        // const dataToImport = json.map((company) => {
        // 	if (typeof company.categories == "string") {
        // 		company.categories = company.categories.split(",").map((c) => +c);
        // 	} else {
        // 		company.categories = [company.categories];
        // 	}
        // 	return company;
        // });
        // setImportedData(dataToImport);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handleMergeCategories = async (value) => {
    console.log(
      "🚀 ~ file: index.js:313 ~ handleMergeCategories ~ value:",
      value
    );
    // setLoading(true);
    setMerging(true);
    try {
      const response = await CategoriesServices.mergeCategories(value);
      if (response && response.status == 201) {
        toast.success("تم الدمج بنجاح");
        setOpencategoriesMergeModal(false);
        getAllCategories();
        setMerging(false);
      } else {
        toast.error("حدث خطأ ما");
        setOpencategoriesMergeModal(false);
        getAllCategories();
        setMerging(false);
      }
    } catch (error) {
      toast.error("حدث خطأ ما");
      setOpencategoriesMergeModal(false);
      getAllCategories();
      setMerging(false);
    }
  };

  useEffect(() => {
    if (importedData.length) {
      setLoading(false);
      setOpenSelectModal(true);
    }
  }, [importedData]);
  const handleImportData = async (value) => {
    setLoading(true);
    try {
      const response = await CategoriesServices.createMultipleCategory({
        data: importedData,
      });
      if (response && response.status == 201) {
        toast.success("success to import data");
        setOpenSelectModal(false);
        getAllCategories();
      } else {
        toast.error("something went wrong!");
        setOpenSelectModal(false);
        getAllCategories();
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong!");
      setOpenSelectModal(false);
      getAllCategories();
    }
  };

  if (loading) return <LoadingDataLoader />;
  if (openSelectModal)
    return (
      <DashboardLayout>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}
        >
          <Form {...layout} name="control-hooks" onFinish={handleImportData}>
            {/* <MDBox sx={style}> */}
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <MDBox
                  display="flex"
                  alignItems="center"
                  mt={{ xs: 2, sm: 0 }}
                  ml={{ xs: -1.5, sm: 0 }}
                >
                  لقد تم تحميل ملف الإكسيل بنجاح
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox
                  display="flex"
                  alignItems="center"
                  mt={{ xs: 2, sm: 0 }}
                  ml={{ xs: -1.5, sm: 0 }}
                >
                  <MDBox mr={1} className="no-ant-item-margin">
                    <Form.Item>
                      <Button
                        type="success"
                        className="text-black bg-green-500 hover:bg-green-400 hover:text-black"
                        htmlType="submit"
                      >
                        تأكيد
                      </Button>
                    </Form.Item>
                  </MDBox>
                  <MDButton
                    onClick={() => setOpenSelectModal(false)}
                    variant="text"
                    color="dark"
                  >
                    <div className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-400 hover:text-white">
                      إلغاء
                    </div>
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
            {/* </MDBox> */}
          </Form>
        </Paper>
      </DashboardLayout>
    );
  if (opencategoriesMergeModal)
    return (
      <DashboardLayout>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}
        >
          <Form
            layout="vertical"
            {...layout}
            name="control-hooks"
            onFinish={handleMergeCategories}
          >
            {/* <MDBox sx={style}> */}
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Form.Item
                  label="الأنشطه التي ستدمج"
                  name="from"
                  style={{ display: "inline-block", width: "calc(100% - 8px)" }}
                  rules={[
                    { required: true, message: "النشاطات التي سيتم دمجها" },
                  ]}
                >
                  <Select
                    placeholder="النشاطات التي  ستحذف"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    mode="multiple"
                    allowClear
                    options={categories.map((cat) => ({
                      label: cat[`name_ar`],
                      value: cat.id,
                    }))}
                  />
                </Form.Item>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Item
                  name="to"
                  label="النشاط  الجديد"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="النشاطات الجديد  "
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    allowClear
                    options={categories.map((cat) => ({
                      label: cat[`name_ar`],
                      value: cat.id,
                    }))}
                  />
                </Form.Item>
              </Grid>

              <Grid item xs={12} sm={6}>
                <MDBox
                  display="flex"
                  alignItems="center"
                  mt={{ xs: 2, sm: 0 }}
                  ml={{ xs: -1.5, sm: 0 }}
                >
                  <MDBox mr={1} className="no-ant-item-margin">
                    <Form.Item>
                      <Button
                        loading={merging}
                        disabled={merging}
                        type="primary"
                        htmlType="submit"
                      >
                        Confirm
                      </Button>
                    </Form.Item>
                  </MDBox>
                  <MDButton
                    onClick={() => setOpencategoriesMergeModal(false)}
                    variant="text"
                    color="dark"
                  >
                    cancel
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
            {/* </MDBox> */}
          </Form>
        </Paper>
      </DashboardLayout>
    );
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
      title: "Name Ar",
      dataIndex: `name_ar`,
      key: "name",
      render: (text, record) => (
        <MDBox lineHeight={1}>
          <MDTypography
            display="block"
            variant="button"
            fontWeight="medium"
            color="info"
          >
            {record.name_ar}
          </MDTypography>
        </MDBox>
      ),
      ...getColumnSearchProps("name_ar"),
      width: "25%",
    },
    {
      title: "Name En",
      dataIndex: `name_en`,
      key: "name",
      render: (text, record) => (
        <MDBox lineHeight={1}>
          <MDTypography
            display="block"
            variant="button"
            fontWeight="medium"
            color="info"
          >
            {record.name_en}
          </MDTypography>
        </MDBox>
      ),
      ...getColumnSearchProps("name_en"),
    },
    {
      title: "views",
      key: "plan",
      render: (_, record) => (
        <p className="text-sm font-medium text-gray-900 ">{record.views}</p>
      ),
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: "Companies Count",
      key: "companiesCount",
      render: (_, record) => (
        <p className="text-sm font-medium text-gray-900 ">
          {record.companiesCount}
        </p>
      ),
      sorter: (a, b) => a.companiesCount - b.companiesCount,
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
            <Link to={`/categories/edit/${record.id}`}>
              <MDButton variant="text" color="dark">
                <Icon>edit</Icon>&nbsp;edit
              </MDButton>
            </Link>
            <MDBox mr={1}>
              <MDButton
                onClick={() => handleOpen(record)}
                variant="text"
                color="error"
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
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
            { Header: "id", accessor: "id", width: "10%" },
            { Header: "name", accessor: "name_en" },
            { Header: "views", accessor: "views", width: "10%" },
            { Header: "Created", accessor: "createdAt" },
            { Header: "updated", accessor: "updatedAt" },
            { Header: "status", accessor: "status" },
            { Header: "Actions", accessor: "actions" },
          ],
          rows: categories.map((item) => ({
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
            createdAt: <Moment fromNow>{item.createdAt}</Moment>,
            updatedAt: <Moment fromNow>{item.updatedAt}</Moment>,
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
                  <Link to={`/categories/edit/${item.id}`}>
                    <MDButton variant="text" color="dark">
                      <Icon>edit</Icon>&nbsp;edit
                    </MDButton>
                  </Link>
                </MDBox>
              </>
            ),
          })),
        }}
      /> */}
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
        right="8rem"
        top="2rem"
        zIndex={9999}
        color="dark"
        sx={{ cursor: "pointer" }}
        onClick={() => navigate("/categories/create")}
      >
        <Icon fontSize="medium" color="inherit">
          add
        </Icon>
      </MDBox>
      <MDBox marginBottom={2} display="flex">
        <MDBox ml={2} display="flex">
          <Button
            className={`h-full text-white hover:text-white rounded-lg bg-blue-700 hover:bg-blue-600  flex items-center text-[16px] font-semibold ${
              isExporting ? "bg-blue-400 text-white" : "bg-blue-700 text-white"
            } mr-2`}
            loading={isExporting}
            onClick={handleExport}
          >
            <Icon>edit</Icon>Export Excel
          </Button>
          <MDButton variant="gradient" component="label" color="success">
            <Icon>edit</Icon>Import Excel
            <input
              hidden
              accept=".xlsx, .xls, .csv"
              name="excelFile"
              type="file"
              onChange={handleImportFile}
            />
          </MDButton>
        </MDBox>
        <MDBox ml={2} mr={2} display="flex">
          <MDButton
            onClick={handleDeleteSelected}
            variant="gradient"
            component="label"
            color="warning"
          >
            <Icon>delete</Icon>Selected
            {/* <input
								hidden
								accept=".xlsx, .xls, .csv"
								name="excelFile"
								type="file"
								onChange={handleImportFile}
							/> */}
          </MDButton>
        </MDBox>
        <MDBox ml={2}>
          <MDButton
            ml={2}
            onClick={() => setOpencategoriesMergeModal(true)}
            variant="gradient"
            component="label"
            color="error"
          >
            <Icon>edit</Icon>Merge Categories
            {/* <input
							hidden
							accept=".xlsx, .xls, .csv"
							name="excelFile"
							type="file"
							onChange={handleImportFile}
						/> */}
          </MDButton>
        </MDBox>
      </MDBox>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />
      <Modal
        open={open.state}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox sx={style}>
          <MDTypography id="modal-modal-title" variant="h6" component="h2">
            Delete {open.item?.name_en}
          </MDTypography>
          <MDBox
            display="flex"
            alignItems="center"
            mt={{ xs: 2, sm: 0 }}
            ml={{ xs: -1.5, sm: 0 }}
          >
            <MDBox mr={1}>
              <MDButton
                onClick={() => handleDelete(open.item?.id)}
                variant="text"
                color="error"
              >
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

export default Categories;
