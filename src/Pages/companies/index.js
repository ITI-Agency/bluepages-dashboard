import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import useFetch from "Hooks/useFetch";
import { useState, useEffect, useRef } from "react";
import CompaniesServices from "Services/CompaniesServices";
import LoadingDataLoader from "components/LoadingDataLoader";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@mui/material";
import Modal from "@mui/material/Modal";
import MDButton from "components/MDButton";
import Switch from "@mui/material/Switch";
import MDAvatar from "components/MDAvatar";
import SelectDataValModal from "components/SelectDataValModal";
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import CountriesServices from "Services/CountriesServices";
import CitiesServices from "Services/CitiesServices";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select, Table, Input, Space } from "antd";

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
	const [countries, setCountries] = useState([]);
	const [openSelectModal, setOpenSelectModal] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const handleSearch = (
		selectedKeys,
		confirm,
		dataIndex,
	) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ marginBottom: 8, display: 'block' }}
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
							setSearchText((selectedKeys)[0]);
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
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes((value).toLowerCase()),
		onFilterDropdownOpenChange: visible => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: text =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	useEffect(() => {
		getAllCompanies();
		getCountries();
	}, []);
	const getAllCompanies = async () => {
		setLoading(true);
		try {
			const response = await CompaniesServices.getAllCompanies([{ country: "true" }, { city: "true" }]);
			const { status: countriesStatus, data: countriesData } = await CountriesServices.getAllCountries();
			const { status: citiesStatus, data: citiesData } = await CitiesServices.getAllCities();
			if (response && response.status == 200 && countriesStatus == 200 && citiesStatus == 200) {
				setLoading(false);
				setData(response.data);
				setCompanies(response.data);
				setCountries(countriesData);
				setCities(citiesData);
			} else {
				toast.error("sorry something went wrong while getting companies!");
				setLoading(false);
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting companies!");
			setLoading(false);
		}
	};
	const handleOpen = (item) => {
		setOpen({ state: true, item });
	};
	const handleClose = () => {
		setOpen({ state: false });
	};
	const handleDelete = async (companyId) => {
		setLoading(true);
		try {
			const res = await CompaniesServices.deleteCompany(companyId);
			if (res.status == 200) {
				handleClose();
				toast.success("company has removed successfully!");
				setLoading(false);
				getAllCompanies();
			} else {
				handleClose();
				toast.error("sorry something went wrong while removing company!");
				setLoading(false);
			}
		} catch (error) {
			handleClose();
			toast.error("sorry something went wrong while removing company!");
			setLoading(false);
		}
	};
	const handleStatusChange = async (e, item) => {
		const { id, status } = item;
		const dd = companies.map((i) => {
			if (i.id == item.id) i.status = status;
			return i;
		});
		setCompanies(dd);
		try {
			let formData = new FormData();
			formData.append('status', `status`);
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
					const val = uniqueData.findIndex((obj => obj.name_ar == company.name_ar));
					if (val === -1) {
						company.categories = [company.categories];
						uniqueData.push(company);
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
		};
	};

	const handleExport = () => {
		const comp = companies.map((c) => {
			c.categories.length ? (c.categories = c.categories?.map((cat) => cat.id).join(",")) : "";
			return c;
		});

		console.log(comp);
		const columns = [
			{
				label: "name_en",
				value: "name_en",
			},
			{
				label: "name_ar",
				value: "name_ar",
			},
			{
				label: "email",
				value: "email",
			},
			{ label: "standard_phone", value: "standard_phone" },
			{ label: "website", value: "website" },
			{ label: "categories", value: "categories" },
		];
		const settings = {
			fileName: "Directory Companies",
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
		// console.log("this is companies:>", companies);
	};

	const getCountryCities = async (id) => {
		const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(id);
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
	const onCountryChange = (e) => {
		console.log("this is e:>", e);
		getCountryCities(e);
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
			const response = await CompaniesServices.createMultipleCompany({
				data: importedData,
				countryId: value.countryId,
				cityId: value.cityId,
			});
			if (response && response.status == 201) {
				toast.success("success to import data");
				setOpenSelectModal(false);
				getAllCompanies();
			} else {
				toast.error("something went wrong!");
				setOpenSelectModal(false);
				getAllCompanies();
			}
		} catch (error) {
			toast.error("something went wrong!");
			setOpenSelectModal(false);
			getAllCompanies();
		}
	};

	if (loading) return <LoadingDataLoader />;
	if (openSelectModal)
		return (
			<DashboardLayout>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
					<Form {...layout} name="control-hooks" onFinish={handleImportData}>
						{/* <MDBox sx={style}> */}
						<Grid container spacing={5}>
							<Grid item xs={12} sm={6}>
								<Form.Item name="countryId" label="Country" rules={[{ required: true }]}>
									<Select placeholder="Select a Country" onChange={onCountryChange} allowClear>
										{countries.map((country) => (
											<Option value={country.id} key={country.id}>
												{country.name_en}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Grid>
							{cities.length ? (
								<Grid item xs={12} sm={6}>
									<Form.Item name="cityId" label="City" rules={[{ required: true }]}>
										<Select placeholder="Select a City" allowClear>
											{cities.map((city) => (
												<Option value={city.id} key={city.id}>
													{city.name_en}
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
									<MDButton onClick={() => setOpenSelectModal(false)} variant="text" color="dark">
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
			key: 'id',
			render: (text, record) => <p className='text-sm font-medium text-gray-900 '>{record.id}</p>,
		},
		{
			title: "logo",
			key: 'id',
			render: (text, record) => record.logo ? (
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
			key: 'name',
			render: (text, record) => (
				<Link to={`/companies/${record.id}`}>
					<MDBox lineHeight={1}>
						<MDTypography display="block" variant="button" fontWeight="medium" color="info">
							{record.name_ar}
						</MDTypography>
						<MDTypography variant="caption">{record.email}</MDTypography>
					</MDBox>
				</Link>
			),
			...getColumnSearchProps('name_ar'),
		},
		{
			title: "Country",
			key: 'country',
			render: (text, record) => (
				<>
					<MDBox lineHeight={1}>
						<MDTypography display="block" variant="button" fontWeight="medium">
							{record?.country?.name_ar}
						</MDTypography>
					</MDBox>
				</>
			),
			filters: countries?.map(c => ({ text: c.name_ar, value: c.id })),
			onFilter: (value, record) => record?.countryId == value,
		},
		{
			title: "City",
			key: 'city',
			render: (text, record) => (
				<>
					<MDBox lineHeight={1}>
						<MDTypography display="block" variant="button" fontWeight="medium">
							{record?.city?.name_ar}
						</MDTypography>
					</MDBox>
				</>
			),
			filters: cities?.map(c => ({ text: c.name_ar, value: c.id })),
			onFilter: (value, record) => record.cityId == value,
		},
		{
			title: "plan",
			key: 'plan',
			render: (_, record) => (
				<MDBox lineHeight={1}>
					<MDTypography display="block" variant="button" fontWeight="medium">
						{record.plan.name_ar}
					</MDTypography>
				</MDBox>
			),
			filters: plans.map((p) => ({ text: p.name_ar, value: p.name_ar })),
			onFilter: (value, record) => record.plan.name_ar.indexOf(value) === 0,
		},
		{
			title: "views",
			key: 'plan',
			render: (_, record) => <p className='text-sm font-medium text-gray-900 '>{record.views}</p>,
			sorter: (a, b) => a.views - b.views,
		},
		{
			title: "verified",
			key: 'verified',
			render: (_, record) => record.verified ? (
				<MDBox
					display="flex"
					justifyContent="center"
					alignItems="center"
					width="2rem"
					height="2rem"
					bgColor="success"
					shadow="sm"
					borderRadius="50%"
					color="white"
				>
					<Icon fontSize="medium" color="inherit">
						checkcircleicon
					</Icon>
				</MDBox>
			) : (
				<Icon fontSize="medium" color="dark">
					infoicon
				</Icon>
			),
			filters: [
				{
					text: 'verified',
					value: true
				},
				{
					text: 'not verified',
					value: false
				},
			],
			onFilter: (value, record) => record.verified === value,
		},
		{
			title: "Active",
			key: 'status',
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
					text: 'Active',
					value: true
				},
				{
					text: 'Not Active',
					value: false
				},
			],
			onFilter: (value, record) => record.status === value,
		},
		{
			title: "created_at",
			key: 'created_at',
			render: (_, record) => <Moment fromNow>{record.createdAt}</Moment>,
			sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),

		},

		{
			title: "control",
			key: 'action',
			render: (_, record) => (
				<>
					<MDBox
						display="flex"
						alignItems="center"
						mt={{ xs: 2, sm: 0 }}
						ml={{ xs: -1.5, sm: 0 }}
					>
						<Link to={`/companies/${record.id}`}>
							<MDButton variant="text" color="info">
								<Icon>preview</Icon>&nbsp;show
							</MDButton>
						</Link>
						<Link to={`/companies/${record.id}/edit-info`}>
							<MDButton variant="text" color="dark">
								<Icon>edit</Icon>&nbsp;edit
							</MDButton>
						</Link>
						<MDBox mr={1}>
							<MDButton onClick={() => handleOpen(record)} variant="text" color="error">
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
			<MDBox marginBottom={2} display="flex">
				<MDBox>
					<MDButton variant="gradient" color="info" onClick={handleExport}>
						<Icon>edit</Icon>Export Excel
					</MDButton>
				</MDBox>
				<MDBox ml={2}>
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
			</MDBox>
			<Table columns={columns} dataSource={companies} />
			{/* <DataTable
        table={{
          columns: [
            { Header: "logo", accessor: "logo", width: "7%" },
            { Header: "name & email", accessor: "name" },
            { Header: "Phone & website", accessor: "standard_phone" },
            { Header: "Plan", accessor: "plan" },
            { Header: "views", accessor: "views" },
            { Header: "verified", accessor: "verified" },
            { Header: "Active", accessor: "status" },
            { Header: "actions", accessor: "actions" },
          ],
          rows: companies.map((item) => {
            return {
              ...item,
              logo: item.logo ? (
                <MDAvatar src={item.logo} alt={item.name_en} shadow="sm" />
              ) : (
                <MDAvatar src={LogoPlaceholder} alt={item.name_en} shadow="sm" />
                // <img
                //   src="assets/images/logo-placeholder.png"
                //   alt={item.name_en}
                //   width="2rem"
                //   height="2rem"
                // />
              ),
              name: (
                <>
                  <Link to={`/companies/${item.id}`}>
                    <MDBox lineHeight={1}>
                      <MDTypography display="block" variant="button" fontWeight="medium">
                        {item.name_en}
                      </MDTypography>
                      <MDTypography variant="caption">{item.email}</MDTypography>
                    </MDBox>
                  </Link>
                </>
              ),
              standard_phone: (
                <MDBox lineHeight={1}>
                  <MDTypography display="block" fontSize="medium">
                    {item.website}
                  </MDTypography>
                  <MDTypography variant="caption">{item.standard_phone}</MDTypography>
                </MDBox>
              ),
              plan: (
                <MDBox lineHeight={1}>
                  <MDTypography display="block" variant="button" fontWeight="medium">
                    {item.plan.name_en}
                  </MDTypography>
                </MDBox>
              ),moment
              verified: item.verified ? (
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="2rem"
                  height="2rem"
                  bgColor="success"
                  shadow="sm"
                  borderRadius="50%"
                  color="white"
                >
                  <Icon fontSize="medium" color="inherit">
                    checkcircleicon
                  </Icon>
                </MDBox>
              ) : (
                <Icon fontSize="medium" color="dark">
                  infoicon
                </Icon>
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
                    <Link to={`/companies/edit/${item.id}`}>
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
        canSearch
        onSearch={handleSearch}
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
				right="2rem"
				bottom="2rem"
				zIndex={99}
				color="dark"
				sx={{ cursor: "pointer" }}
				onClick={() => navigate("/companies/create")}
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
			{/* <Modal
        open={openSelectModal}
        onClose={setOpenSelectModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
      </Modal> */}
		</DashboardLayout>
	);
};

export default Companies;
