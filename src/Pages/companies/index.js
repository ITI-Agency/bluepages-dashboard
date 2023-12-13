import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import CompaniesServices from "Services/CompaniesServices";
import LoadingDataLoader from "components/LoadingDataLoader";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import {
  Link,
  useLocation,
  useNavigate,
  useResolvedPath,
} from "react-router-dom";
import { Icon } from "@mui/material";
import Modal from "@mui/material/Modal";
import MDButton from "components/MDButton";
// import Switch from "@mui/material/Switch";
import MDAvatar from "components/MDAvatar";
import SelectDataValModal from "components/SelectDataValModal";
import Paper from "@mui/material/Paper";
import CountriesServices from "Services/CountriesServices";
import CitiesServices from "Services/CitiesServices";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Select,
  Table,
  Input,
  Space,
  Tag,
  Switch,
  InputNumber,
} from "antd";
import pLimit from "p-limit";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
const { Option } = Select;

import DataTable from "examples/Tables/DataTable";

import LogoPlaceholder from "assets/images/logo-placeholder.png";
// import useNotify from "Hooks/useNotify";
import { toast } from "react-toastify";
// import xlsx from "xlsx";
import * as xls from "xlsx";
import xlsx from "json-as-xlsx";
import Moment from "react-moment";
import Utils from "../../Utils";
import moment from "moment";
import Highlighter from "react-highlight-words";
import CategoriesServices from "Services/CategoriesServices";
const plans = Utils.plans;
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

function Companies() {
  // const { setNotification } = useNotify();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState({ state: false });
  const [loading, setLoading] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [openSelectModal, setOpenSelectModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteIdModal, setOpenDeleteIdModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableFilter, setTableFilter] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const searchInput = useRef(null);
  const location = useLocation();

  useEffect(() => {
    console.log("tableFilter", tableFilter);
  }, [tableFilter]);
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
    // onFilter: (value, record) =>
    // 	record[dataIndex]
    // 		.toString()
    // 		.toLowerCase()
    // 		.includes((value).toLowerCase()),
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
    getAllCompanies();
    getCountries();
    getCategories();
  }, [location.pathname]);
  const getAllCompanies = async () => {
    // setLoading(true);
    setDeleting(true);

    try {
      const response = await CompaniesServices.getAllCompaniesPaginate([
        { country: "true" },
        { city: "true" },
        { limit: 10 },
        { page: 1 },
        {
          requests:
            location.pathname === "/companies-requests" ? "true" : "false",
        },
        { user: "true" },
      ]);
      const { status: countriesStatus, data: countriesData } =
        await CountriesServices.getAllCountries();
      const { status: citiesStatus, data: citiesData } =
        await CitiesServices.getAllCities();

      if (
        response &&
        response.status == 200 &&
        countriesStatus == 200 &&
        citiesStatus == 200
      ) {
        setDeleting(false);
        // setLoading(false);
        setData(response.data);
        setCompanies(response.data);
        setCountries(countriesData);
        setCities(citiesData);
      } else {
        toast.error("sorry something went wrong while getting companies!");
        setDeleting(false);
        // setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting companies!");
      setDeleting(false);
      // setLoading(false);
    }
  };
  const handleOpen = (item) => {
    setOpen({ state: true, item });
  };
  const handleClose = () => {
    setOpen({ state: false });
  };
  const handleDelete = async (companyId) => {
    // setLoading(true);
    try {
      const res = await CompaniesServices.deleteCompany(companyId);
      if (res.status == 200) {
        handleClose();
        toast.success("company has removed successfully!");
        // setLoading(false);
        getAllCompanies();
      } else {
        handleClose();
        toast.error("sorry something went wrong while removing company!");
        // setLoading(false);
      }
    } catch (error) {
      handleClose();
      toast.error("sorry something went wrong while removing company!");
      // setLoading(false);
    }
  };
  const handleStatusChange = async (e, item) => {
    const { id, status } = item;
    const dd = companies?.items?.map((i) => {
      if (i.id == item.id) i.status = status;
      return i;
    });
    setCompanies({ items: dd, meta: companies.meta });
    try {
      let formData = new FormData();
      formData.append("status", status);
      const res = await CompaniesServices.updateCompany(formData, id);
      if (res.status == 200) {
        toast.success("your status has updated successfully!");
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while updating status!");
        setLoading(false);
        getAllCompanies();
      }
    } catch (error) {
      toast.error("sorry something went wrong while updating status!");
      setLoading(false);
      getAllCompanies();
    }
  };
  const handleSortableChange = async (e, item) => {
    const { id, sortable } = item;
    const dd = companies?.items?.map((i) => {
      if (i.id == item.id) i.sortable = sortable;
      return i;
    });
    setCompanies({ items: dd, meta: companies.meta });
    try {
      let formData = new FormData();
      formData.append("sortable", sortable);
      const res = await CompaniesServices.updateCompany(formData, id);
      if (res.status == 200) {
        toast.success("company sortable  updated successfully!");
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while updating status!");
        setLoading(false);
        getAllCompanies();
      }
    } catch (error) {
      toast.error("sorry something went wrong while updating status!");
      setLoading(false);
      getAllCompanies();
    }
  };
  const handleVerifiedChange = async (e, item) => {
    const { id, verified } = item;
    const dd = companies?.items?.map((i) => {
      if (i.id == item.id) i.verified = verified;
      return i;
    });
    setCompanies({ items: dd, meta: companies.meta });
    try {
      let formData = new FormData();
      formData.append("verified", verified);
      const res = await CompaniesServices.updateCompany(formData, id);
      if (res.status == 200) {
        toast.success("your verified has updated successfully!");
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while updating verified!");
        setLoading(false);
        getAllCompanies();
      }
    } catch (error) {
      toast.error("sorry something went wrong while updating verified!");
      setLoading(false);
      getAllCompanies();
    }
  };
  // const handleSearch = (e) => {
  //   const param = e.target.value.toLowerCase();
  //   const filtered = data.filter(
  //     (d) =>
  //       d.name_en.toLowerCase().includes(param) ||
  //       d.email.toLowerCase().includes(param) ||
  //       d.standard_phone.toLowerCase().includes(param) ||
  //       d.plan.name_en.toLowerCase().includes(param) ||
  //       d.website.toLowerCase().includes(param)
  //   );
  //   setCompanies(filtered);
  // };

  const getCountryCities = async (id) => {
    const { status: citiesStatus, data: citiesData } =
      await CountriesServices.getAllCities(id);
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
  const getCategories = async () => {
    try {
      const { status: categoriesStatus, data: categoriesData } =
        await CategoriesServices.getAllCategoriesMapped();
      if (categoriesStatus == 200) {
        setCategories(categoriesData);
      } else {
        toast.error("sorry something went wrong while getting categories!");
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting categories!");
    }
  };
  const onCountryChange = (e) => {
    getCountryCities(e);
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
        const uniqueData = [];
        json.forEach((company) => {
          const val = uniqueData.findIndex(
            (obj) => obj.name_ar == company.name_ar
          );
          if (val === -1) {
            company.categories = [company.categories];
            uniqueData.push({
              ...company,
              standard_phone: company.standard_phone?.toString(),
            });
          } else {
            uniqueData[val].categories.push(company.categories);
          }
        });
        setImportedData(uniqueData);

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
  const handleExport = async () => {
    setIsExporting(true);

    console.log("filter before export", tableFilter);

    const filterForExport = tableFilter.filter(
      (filter) =>
        Object.keys(filter)[0] != "page" &&
        Object.keys(filter)[0] != "limit" &&
        Object.keys(filter)[0] !== "requests"
    );
    // add requests exports
    filterForExport.push({
      requests: location.pathname === "/companies-requests" ? "true" : "false",
    });

    filterForExport.city = "true";
    filterForExport.country = "true";
    filterForExport.user = "true";
    console.log("filter for export", filterForExport);
    console.log({ filterForExport });
    const response = await CompaniesServices.getAllCompanies(filterForExport);
    console.log("🚀 ~ file: index.js:453 ~ handleExport ~ response:", response);
    console.log({ companies: response?.data });
    if (response && response.status == 200) {
      const comp = response?.data?.map((c) => {
        c.categories.length
          ? (c.categories = c.categories?.map((cat) => cat?.name_ar).join(","))
          : "";
        c.cityName = c.city?.name_ar;
        return c;
      });
      const columns = [
        {
          label: "name_en",
          value: "name_en",
        },
        { label: "cityName", value: "cityName" },
        {
          label: "name_ar",
          value: "name_ar",
        },
        {
          label: "email",
          value: "email",
        },
        { label: "standard_phone", value: "standard_phone" },
        { label: "hotline", value: "hotline" },
        { label: "website", value: "website" },
        { label: "categoryNames", value: "categories" },
        { label: "agent_name", value: "agent_name" },
      ];
      const settings = {
        fileName: "bluePages Companies",
      };
      const data = [
        {
          sheet: "Companies",
          columns,
          content: comp,
        },
      ];
      xlsx(data, settings, (sheet) => {
        console.log("Download complete:", sheet);
      });
      setIsExporting(false);
    } else {
      setIsExporting(false);
      toast.error("sorry something went wrong while getting companies!");
    }
  };
  useEffect(() => {
    if (importedData.length) {
      setLoading(false);
      setOpenSelectModal(true);
    }
  }, [importedData]);
  const sliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };

  const handleImportData = async (value) => {
    const sliceIntoChunks = (arr, chunkSize) => {
      const res = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
      }
      return res;
    };
    const chunkedData = sliceIntoChunks(importedData, 5000);
    const limit = pLimit(1);
    const request = chunkedData.map(async (dataChunk) => {
      return limit(() =>
        CompaniesServices.createMultipleCompany({
          data: dataChunk,
          countryId: value.countryId,
          cityId: value.cityId,
        })
      );
    });
    setLoading(true);
    try {
      const response = await Promise.all(request);
      console.log({ response });
      toast.success("تم إدخال البيانات بنجاح");
      setOpenSelectModal(false);
      getAllCompanies();
    } catch (error) {
      toast.error("لقد حدث خطأ ما, يرجي التحقق من بياناتك");
      console.log({ error });
      setOpenSelectModal(false);
      getAllCompanies();
    }
  };
  const handleDeleteData = async (value) => {
    // console.log(value.planId);
    // setLoading(true);
    try {
      const response = await CompaniesServices.deleteByPlan(
        value.planId,
        value.cityId
      );
      if (response && response.status == 200) {
        toast.success("تم الحذف بنجاح");
        setOpenDeleteModal(false);
        getAllCompanies();
      } else {
        toast.error("حدث خطأ ما");
        setOpenDeleteModal(false);
        getAllCompanies();
      }
    } catch (error) {
      toast.error("حدث خطأ ما");
      setOpenDeleteModal(false);
      getAllCompanies();
    }
  };
  const handleDeleteByIdData = async (value) => {
    console.log(
      "🚀 ~ file: index.js:496 ~ handleDeleteByIdData ~ value:",
      value
    );
    try {
      const response = await CompaniesServices.deleteById(value);
      if (response && response.status == 200) {
        toast.success("تم الحذف بنجاح");
        setOpenDeleteIdModal(false);
        getAllCompanies();
      } else {
        toast.error("حدث خطأ ما");
        setOpenDeleteIdModal(false);
        getAllCompanies();
      }
    } catch (error) {
      toast.error("حدث خطأ ما");
      setOpenDeleteIdModal(false);
      getAllCompanies();
    }
  };
  const handleDeleteSelected = async () => {
    setLoading(true);
    try {
      const response = await CompaniesServices.deleteMultipleCompany({
        data: { ids: selectedRowKeys },
      });
      if (response && response.status == 200) {
        toast.success("success to delete data");
        setLoading(false);
        getAllCompanies();
      } else {
        toast.error("something went wrong!");
        setLoading(false);
        getAllCompanies();
      }
    } catch (error) {
      toast.error("something went wrong!");
      setLoading(false);
      getAllCompanies();
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
                <Form.Item
                  name="countryId"
                  label="Country"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select a Country"
                    onChange={onCountryChange}
                    allowClear
                  >
                    {countries.map((country) => (
                      <Option value={country.id} key={country.id}>
                        {country.name_ar}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>
              {cities.length ? (
                <Grid item xs={12} sm={6}>
                  <Form.Item
                    name="cityId"
                    label="City"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select a City" allowClear>
                      {cities.map((city) => (
                        <Option value={city.id} key={city.id}>
                          {city.name_ar}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Grid>
              ) : (
                ""
              )}
              <Grid item xs={12} sm={6}>
                <MDBox
                  display="flex"
                  alignItems="center"
                  mt={{ xs: 2, sm: 0 }}
                  ml={{ xs: -1.5, sm: 0 }}
                >
                  <MDBox mr={1} className="no-ant-item-margin">
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Import
                      </Button>
                    </Form.Item>
                  </MDBox>
                  <MDButton
                    onClick={() => setOpenSelectModal(false)}
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
  if (openDeleteModal)
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
            onFinish={handleDeleteData}
          >
            {/* <MDBox sx={style}> */}
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Form.Item
                  label="الخطه  "
                  name="planId"
                  style={{ display: "inline-block", width: "calc(100% - 8px)" }}
                  rules={[{ required: true, message: "برجاء إختيار الخطه " }]}
                >
                  <Select placeholder="برجاء إختيار الخطه " allowClear>
                    {plans?.map((p) => (
                      <Option key={p.package_id} value={p.package_id}>
                        {p[`name_ar`]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Item
                  name="cityId"
                  label="المدينه"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="برجاء إختيار المدينه" allowClear>
                    {cities.map((city) => (
                      <Option value={city.id} key={city.id}>
                        {city.name_ar}
                      </Option>
                    ))}
                  </Select>
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
                      <Button type="primary" htmlType="submit">
                        Confirm
                      </Button>
                    </Form.Item>
                  </MDBox>
                  <MDButton
                    onClick={() => setOpenDeleteModal(false)}
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
  if (openDeleteIdModal)
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
            onFinish={handleDeleteByIdData}
          >
            {/* <MDBox sx={style}> */}
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Form.Item
                  label="الرقم لبدايه الحذف "
                  name="small_id"
                  style={{ display: "inline-block", width: "calc(100% - 8px)" }}
                  rules={[{ required: true, message: "الرقم لبدايه الحذف " }]}
                >
                  <InputNumber allowClear />
                </Form.Item>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Item
                  name="large_id"
                  label="الرقم لنهايه الحذف "
                  rules={[{ required: true }]}
                >
                  <InputNumber allowClear />
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
                      <Button type="primary" htmlType="submit">
                        Confirm
                      </Button>
                    </Form.Item>
                  </MDBox>
                  <MDButton
                    onClick={() => setOpenDeleteIdModal(false)}
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
      title: "logo",
      key: "id",
      render: (text, record) =>
        record.logo ? (
          <MDAvatar src={record.logo} alt={record.name_ar} shadow="sm" />
        ) : (
          <MDAvatar src={LogoPlaceholder} alt={record.name_ar} shadow="sm" />
          // <img
          //   src="assets/images/logo-placeholder.png"
          //   alt={item.name_en}
          //   width="2rem"
          //   height="2rem"
          // />
        ),
    },
    {
      title: "name",
      dataIndex: `name_ar`,
      key: "search",
      render: (text, record) => (
        <Link to={`/companies/${record.id}`}>
          <MDBox lineHeight={1}>
            <MDTypography
              display="block"
              variant="button"
              fontWeight="medium"
              color="info"
            >
              {record.name_ar}
            </MDTypography>
            <MDTypography variant="caption">{record.email}</MDTypography>
          </MDBox>
        </Link>
      ),
      // width: '20%',
      ...getColumnSearchProps("name_ar"),
    },
    {
      title: "user",
      render: (text, record) => (
        <MDBox lineHeight={1}>
          <MDTypography
            display="block"
            variant="button"
            fontWeight="medium"
            color="info"
          >
            {record?.user?.name}
          </MDTypography>
        </MDBox>
      ),
    },
    // {
    // 	title: "Country",
    // 	key: 'countryId',
    // 	render: (text, record) => (
    // 		<>
    // 			<MDBox lineHeight={1}>
    // 				<MDTypography display="block" variant="button" fontWeight="medium">
    // 					{record?.country?.name_ar}
    // 				</MDTypography>
    // 			</MDBox>
    // 		</>
    // 	),
    // 	filters: countries?.map(c => ({ text: c.name_ar, value: c.id })),
    // 	// onFilter: (value, record) => record?.countryId == value,
    // },
    {
      title: "City",
      key: "cityId",
      render: (text, record) => (
        <>
          <MDBox lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              {record?.city?.name_ar}
            </MDTypography>
          </MDBox>
        </>
      ),
      filters: cities?.map((c) => ({ text: c.name_ar, value: c.id })),
      // onFilter: (value, record) => record.cityId == value,
    },

    {
      title: "plan",
      key: "packageId",

      render: (_, record) => (
        <MDBox lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {record.plan.name_ar}
          </MDTypography>
        </MDBox>
      ),
      filters: plans.map((p) => ({ text: p.name_ar, value: p.package_id })),
      // onFilter: (value, record) => record.plan.name_ar.indexOf(value) === 0,
    },
    {
      title: "Categories",
      key: "categories",
      render: (text, record) => (
        <>
          {record?.categories?.map((cat) => {
            return (
              <Tag className="mt-1" color={"geekblue"} key={cat}>
                {cat?.name_ar?.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      // filters: categories?.map(c => ({ text: c.name_ar, value: c.id })),
      // onFilter: (value, record) => record.cityId == value,
    },
    // {
    // 	title: "views",
    // 	key: 'plan',
    // 	render: (_, record) => <p className='text-sm font-medium text-gray-900 '>{record.views}</p>,
    // 	sorter: (a, b) => a.views - b.views,
    // },
    // {
    // 	title: "verified",
    // 	key: 'verified',
    // 	render: (_, record) => record.verified ? (
    // 		<MDBox
    // 			display="flex"
    // 			justifyContent="center"
    // 			alignItems="center"
    // 			width="2rem"
    // 			height="2rem"
    // 			bgColor="success"
    // 			shadow="sm"
    // 			borderRadius="50%"
    // 			color="white"
    // 		>
    // 			<Icon fontSize="medium" color="inherit">
    // 				checkcircleicon
    // 			</Icon>
    // 		</MDBox>
    // 	) : (
    // 		<Icon fontSize="medium" color="dark">
    // 			infoicon
    // 		</Icon>
    // 	),
    // 	filters: [
    // 		{
    // 			text: 'verified',
    // 			value: true
    // 		},
    // 		{
    // 			text: 'not verified',
    // 			value: false
    // 		},
    // 	],
    // 	onFilter: (value, record) => record.verified === value,
    // },

    {
      title: "Verified",
      key: "verified",
      render: (_, record) => (
        <>
          <Switch
            className={`${record.verified ? "bg-blue-500" : "bg-gray-200"}`}
            checked={record.verified}
            onChange={(e) => {
              record.verified = !record.verified;
              handleVerifiedChange(e, record);
            }}
          />
        </>
      ),
      // filters: [
      // 	{
      // 		text: 'Active',
      // 		value: true
      // 	},
      // 	{
      // 		text: 'Not Active',
      // 		value: false
      // 	},
      // ],
      // onFilter: (value, record) => record.status === value,
    },
    {
      title: "Active",
      key: "status",
      render: (_, record) => (
        <>
          <Switch
            className={`${record.status ? "bg-green-500" : "bg-gray-200"}`}
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
      // onFilter: (value, record) => record.status === value,
    },
    {
      title: "Sortable",
      key: "sortable",
      render: (_, record) => (
        <>
          <Switch
            className={`${record.sortable ? "bg-green-500" : "bg-gray-200"}`}
            checked={record.sortable}
            onChange={(e) => {
              record.sortable = !record.sortable;
              handleSortableChange(e, record);
            }}
          />
        </>
      ),
      filters: [
        {
          text: "Sortable",
          value: true,
        },
        {
          text: "Not Sortable",
          value: false,
        },
      ],
      // onFilter: (value, record) => record.status === value,
    },
  ];
  location.pathname === "/companies-requests" &&
    columns.push({
      title: "Type",
      key: "type-verified",
      render: (_, record) => (
        <>
          {record?.is_sms_request === "REQ" ? <p>طلب توثيق</p> : <p>إعلان</p>}
        </>
      ),
      filters: [
        {
          text: "Data Verification",
          value: "true",
        },
        {
          text: "Not Data Verification",
          value: null,
        },
      ],
      onFilter: (value, record) => record.is_sms_request === value,
    });
  columns.push(
    ...[
      {
        title: "created_at",
        key: "created_at",
        render: (_, record) => <Moment fromNow>{record.createdAt}</Moment>,
        sorter: (a, b) =>
          moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      },
      {
        title: "control",
        key: "action",
        width: "20%",
        // fixed: "right",
        render: (_, record) => (
          <>
            <MDBox
              display="flex"
              alignItems="center"
              mt={{ xs: 2, sm: 0 }}
              ml={{ xs: -1.5, sm: 0 }}
            >
              <Link to={`/companies/${record.id}`}>
                <MDButton
                  style={{ padding: 0 }}
                  className="px-0"
                  variant="text"
                  color="info"
                >
                  <Icon>preview</Icon>&nbsp;show
                </MDButton>
              </Link>
              <Link
                to={`/companies/${record.id}/edit-info?referrer=${location.pathname}`}
              >
                <MDButton
                  style={{ padding: 0 }}
                  className="px-0"
                  variant="text"
                  color="dark"
                >
                  <Icon>edit</Icon>&nbsp;edit
                </MDButton>
              </Link>
              <MDBox mr={1}>
                <MDButton
                  style={{ padding: 0 }}
                  className="px-0"
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
    ]
  );
  const handleChange = async (pagination, filters, sorter) => {
    const filtersArray = [
      { country: "true" },
      { city: "true" },
      { limit: pagination.pageSize },
      { page: pagination.current },
      {
        requests:
          location.pathname === "/companies-requests" ? "true" : "false",
      },
      { user: "true" },
    ];
    const categoryInTableFilter = tableFilter.find((it) =>
      it.hasOwnProperty("categories[]")
    );
    if (categoryInTableFilter) filtersArray.push(categoryInTableFilter);
    Object.entries(filters).forEach((f) => {
      if (f[1] && f[1].length) {
        if (f[0] === "packageId") {
          f[1].forEach((it) => {
            filtersArray.push({ "packages[]": it });
          });
        } else {
          filtersArray.push({ [f[0]]: f[1][0] });
        }
      }
    });
    try {
      const response = await CompaniesServices.getAllCompaniesPaginate(
        filtersArray
      );
      if (response && response.status == 200) {
        setTableFilter(filtersArray);
        setCompanies(response.data);
      } else {
        toast.error("sorry something went wrong while getting companies!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting companies!");
      setLoading(false);
    }

    // const offset = pagination.current * pagination.pageSize - pagination.pageSize;
    // const limit = pagination.pageSize;
    // const params = {};

    // if (sorter.hasOwnProperty("column")) {
    // 	params.order = { field: sorter.field, dir: sorter.order };
    // }

    // getData(offset, limit, params);
  };

  const handleCategoryChange = async (value) => {
    const filtersArray = [
      { country: "true" },
      { city: "true" },
      {
        requests:
          location.pathname === "/companies-requests" ? "true" : "false",
      },
      { user: "true" },
    ];
    const excludeProperties = (o) =>
      !(
        o.hasOwnProperty("categories[]") ||
        o.hasOwnProperty("country") ||
        o.hasOwnProperty("city") ||
        o.hasOwnProperty("requests") ||
        o.hasOwnProperty("user")
      );

    const tableFilterWithoutCategory = tableFilter.filter(excludeProperties);
    if (value) {
      tableFilterWithoutCategory.push({ "categories[]": value });
    }
    const filterToSend = [...tableFilterWithoutCategory, ...filtersArray];
    try {
      const response = await CompaniesServices.getAllCompaniesPaginate(
        filterToSend
      );
      if (response && response.status == 200) {
        setTableFilter(filterToSend);
        setCompanies(response.data);
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while getting companies!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("sorry something went wrong while getting companies!");
      setLoading(false);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <DashboardLayout>
      <MDBox marginBottom={2} className="flex justify-between">
        <MDBox className="flex">
          {/* <MDBox> */}
          <Button
            className={`h-full text-white hover:text-white rounded-lg bg-blue-700 hover:bg-blue-600  flex items-center text-[16px] font-semibold ${
              isExporting ? "bg-blue-400 text-white" : "bg-blue-700 text-white"
            }`}
            loading={isExporting}
            onClick={handleExport}
          >
            {/* <div className="flex items-center text-[16px] font-semibold"> */}
            <Icon>edit</Icon>Export
            {/* </div> */}
          </Button>
          {/* </MDBox> */}
          {location.pathname === "/companies-requests" ? (
            ""
          ) : (
            <MDBox ml={2}>
              <MDButton variant="gradient" component="label" color="success">
                <Icon>edit</Icon>Import
                <input
                  hidden
                  accept=".xlsx, .xls, .csv"
                  name="excelFile"
                  type="file"
                  onChange={handleImportFile}
                />
              </MDButton>
            </MDBox>
          )}
          <MDBox ml={2} mr={2}>
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
          <MDBox>
            <MDButton
              onClick={() => setOpenDeleteIdModal(true)}
              variant="gradient"
              component="label"
              color="error"
            >
              <Icon>delete</Icon>By ID
            </MDButton>
          </MDBox>
          {location.pathname === "/companies-requests" ? (
            ""
          ) : (
            <MDBox ml={2}>
              <MDButton
                ml={2}
                onClick={() => setOpenDeleteModal(true)}
                variant="gradient"
                component="label"
                color="error"
              >
                <Icon>delete</Icon>By Plan
                {/* <input
							hidden
							accept=".xlsx, .xls, .csv"
							name="excelFile"
							type="file"
							onChange={handleImportFile}
						/> */}
              </MDButton>
            </MDBox>
          )}
          <MDBox ml={2}>
            <Select
              style={{ width: 200, borderRadius: 30 }}
              size="large"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={categories?.map((co) => ({
                label: co.name_ar,
                value: co.id,
              }))}
              placeholder="Search By Category"
              allowClear
              onChange={handleCategoryChange}
            />
          </MDBox>
        </MDBox>
      </MDBox>
      <Table
        onChange={handleChange}
        columns={columns}
        scroll={{ x: 400 }}
        dataSource={companies.items}
        pagination={{
          position: ["bottom", "right"],
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50", "100"],
          total: companies?.meta?.totalItems,
        }}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
          },
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
        right="8rem"
        top="2rem"
        zIndex={9999}
        color="dark"
        sx={{ cursor: "pointer" }}
        onClick={() =>
          navigate(`/companies/create?referrer=${location.pathname}`)
        }
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
            Delete {open.item?.name_en}
          </MDTypography>
          <MDBox
            display="flex"
            alignItems="center"
            mt={{ xs: 2, sm: 0 }}
            ml={{ xs: -1.5, sm: 0 }}
          >
            <MDBox mr={1}>
              {/* <MDButton onClick={() => handleDelete(open.item?.id)} variant="text" color="error">
								<Icon>delete</Icon>&nbsp;delete
							</MDButton> */}
              <Button
                danger
                loading={deleting}
                onClick={() => handleDelete(open.item?.id)}
                variant="text"
                color="red"
              >
                delete
              </Button>
            </MDBox>
            <MDButton onClick={handleClose} variant="text" color="dark">
              cancel
            </MDButton>
          </MDBox>
        </MDBox>
      </Modal>
      {/* <Modal
        open={openSelectModal}
        onClose={setOpenSelectModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
      </Modal> */}
    </DashboardLayout>
  );
}

export default Companies;
