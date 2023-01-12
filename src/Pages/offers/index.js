import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";
import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import Modal from "@mui/material/Modal";
import MDButton from "components/MDButton";
import Switch from "@mui/material/Switch";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";
import Moment from "react-moment";
import { SearchOutlined } from '@ant-design/icons';

import useFetch from "Hooks/useFetch";
import Highlighter from "react-highlight-words";

import OffersServices from "Services/OffersServices";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Select, Table, Input, Space, Tag } from "antd";

import { toast } from "react-toastify";

import LogoPlaceholder from "assets/images/logo-placeholder.png";
import CitiesServices from "Services/CitiesServices";
import CategoriesServices from "Services/CategoriesServices";

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
function Offers() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [offers, setOffers] = useState([]);
	const [open, setOpen] = useState({ state: false });
	const [cities, setCities] = useState([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		getAllOffers();
		getCategories();
	}, []);
	const getAllOffers = async () => {
		setLoading(true);
		try {
			const response = await OffersServices.getAllOffersPaginate([{ country: "true" }, { city: "true" }, { limit: 10 }, { page: 1 }]);
			const { status: citiesStatus, data: citiesData } = await CitiesServices.getAllCities();

			if (response && response.status == 200 && citiesStatus == 200) {
				setLoading(false);
				setData(response.data);
				setOffers(response.data);
				setCities(citiesData);
			} else {
				toast.error("sorry something went wrong while getting offers!");
				setLoading(false);
			}
		} catch (error) {
			console.log(error)

			toast.error("sorry something went wrong while getting offers!");
			setLoading(false);
		}
	};
	const getCategories = async () => {
		try {
			const { status: categoriesStatus, data: categoriesData } = await CategoriesServices.getAllCategories([{offer:true}]);
			if (categoriesStatus == 200 ) {
				setCategories(categoriesData);
			} else {
				toast.error("sorry something went wrong while getting offers!");
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting offers!");
		}
	};

	const handleOpen = (item) => {
		setOpen({ state: true, id: item.id, name: item.name_en });
	};
	const handleClose = () => {
		setOpen({ state: false });
	};

	const handleDelete = async (offerId) => {
		setLoading(true);
		try {
			const res = await OffersServices.removeOffer(offerId);
			if (res.status == 200) {
				handleClose();
				toast.success("this offer has removed successfully!");
				setLoading(false);
				getAllOffers();
			} else {
				handleClose();
				toast.error("sorry something went wrong while removing offer!");
				setLoading(false);
			}
		} catch (error) {
			handleClose();
			toast.error("sorry something went wrong while removing offer!");
			setLoading(false);
		}
	};
	const handleStatusChange = async (e, item) => {
		const { id, status } = item;
		const dd = offers?.items?.map((i) => {
			if (i.id == item.id) i.status = status;
			return i;
		});
		setOffers({items:dd,meta:offers.meta});
		try {
			const res = await OffersServices.updateOffer({ status }, id);
			if (res.status == 200) {
				toast.success("your status has updated successfully!");
				setLoading(false);
			} else {
				toast.error("sorry something went wrong while updating status!");
				setLoading(false);
				getAllOffers();
			}
		} catch (error) {
			toast.error("sorry something went wrong while updating status!");
			setLoading(false);
			getAllOffers();
		}
	};
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const handleDeleteSelected = async () => {
		setLoading(true);
		try {
			const response = await OffersServices.deleteMultipleOffer({
				data: { ids: selectedRowKeys }
			});
			if (response && response.status == 200) {
				toast.success("تم الحذف بنجاح");
				setLoading(false);
				getAllOffers();
			} else {
				toast.error("حدث خطأ ما أثناء الحذف");
				setLoading(false);
				getAllOffers();
			}
		} catch (error) {
			toast.error("حدث خطأ ما أثناء الحذف");
			setLoading(false);
			getAllOffers();
		}
	};
	const handleSearch = (
		selectedKeys,
		confirm,
		dataIndex,
	) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
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
		// onFilter: (value, record) =>
		// 	record[dataIndex]
		// 		.toString()
		// 		.toLowerCase()
		// 		.includes((value).toLowerCase()),
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
	const handleChange = async (pagination, filters, sorter) => {
		const filtersArray = [{ country: "true" }, { city: "true" }, { limit: pagination.pageSize }, { page: pagination.current }];
		Object.entries(filters).forEach(f => {
			if (f[1] && f[1].length) {
				if (f[0] === 'categories') {
					f[1].forEach(it => {
						filtersArray.push({ 'categories[]': it });
					});
				} else {
					filtersArray.push({ [f[0]]: f[1][0] });
				}
			}
		});
		try {
			const response = await OffersServices.getAllOffersPaginate(filtersArray);
			if (response && response.status == 200) {
				setOffers(response.data);
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
		const filterCategory = [];
		if (value) filterCategory.push({ 'categories[]': value });

		try {
			const response = await OffersServices.getAllOffersPaginate(filterCategory);
			if (response && response.status == 200) {
				setOffers(response.data);
			} else {
				toast.error("sorry something went wrong while getting companies!");
				setLoading(false);
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting companies!");
			setLoading(false);
		}
	};
	if (loading || !categories) return <LoadingDataLoader />;
	const columns = [
		{
			title: "#",
			dataIndex: `id`,
			key: 'id',
			render: (text, record) => <p className='text-sm font-medium text-gray-900 '>{text}</p>,
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
				<>
					<Link to={`/companies/${record.id}`}>
						<MDBox lineHeight={1}>
							<MDTypography display="block" variant="button" fontWeight="medium">
								{text}
							</MDTypography>
							<MDTypography variant="caption">{record.email}</MDTypography>
						</MDBox>
					</Link>
				</>
			),
			...getColumnSearchProps('name_ar'),
		},


		// {
		// 	title: "Country",
		// 	key: 'country',
		// 	render: (text, record) => (
		// 		<>
		// 				<MDBox lineHeight={1}>
		// 					<MDTypography display="block" variant="button" fontWeight="medium">
		// 					{record?.country?.name_ar}
		// 					</MDTypography>
		// 				</MDBox>
		// 		</>
		// 	),
		// 	filters:countries?.map(c=>({text:c.name_ar,value:c.id})),
		// 	onFilter: (value, record) => record?.countryId == value,
		// },
		// {
		// 	title: "City",
		// 	key: 'city',
		// 	render: (text, record) => (
		// 		<>
		// 				<MDBox lineHeight={1}>
		// 					<MDTypography display="block" variant="button" fontWeight="medium">
		// 					{record?.city?.name_ar}
		// 					</MDTypography>
		// 				</MDBox>
		// 		</>
		// 	),
		// 	filters:cities?.map(c=>({text:c.name_ar,value:c.id})),
		// 	onFilter: (value, record) => record.cityId == value,
		// },
		{
			title: "City",
			key: 'cityId',
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
			// onFilter: (value, record) => record.cityId == value,
		},
		// {
		// 	title: "views",
		// 	key: 'plan',
		// 	render: (_, record) => <p className='text-sm font-medium text-gray-900 '>{record.views}</p>,
		// 	sorter: (a, b) => a.views - b.views,
		// },
		{
			title: "Categories",
			key: 'categories',
			render: (text, record) => (
				<>
					{record?.categories?.map((cat) => {
						return (
							<Tag className="mt-1" color={'geekblue'} key={cat}>
								{cat?.name_ar?.toUpperCase()}
							</Tag>
						);
					})}
				</>
			),
			// filters: categories?.map(c => ({ text: c.name_ar, value: c.id })),
			// onFilter: (value, record) => record.cityId == value,
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
			// onFilter: (value, record) => record.status === value,
		},
		{
			title: "created_at",
			key: 'created_at',
			render: (_, record) => <Moment fromNow>{record.createdAt}</Moment>,
			sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),

		},
		{
			title: "Expire",
			key: 'endAt',
			render: (_, record) => record.endAt ? <Moment format="DD/MM/YYYY" >{record.createdAt}</Moment> : "-",
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
						<Link to={`/offers/${record.id}`}>
							<MDButton variant="text" color="info">
								<Icon>preview</Icon>&nbsp;show
							</MDButton>
						</Link>
						<Link to={`/offers/edit/${record.id}`}>
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
			<MDBox marginBottom={2} className="flex justify-start">
				<MDBox className="flex">
					<MDBox ml={2} mr={4}>
						<MDButton onClick={handleDeleteSelected} variant="gradient" component="label" color="warning">
							<Icon>delete</Icon>Delete Selected
						
						</MDButton>
					</MDBox>
					
				</MDBox>
				<MDBox ml={2}>
					<Select
						size="large"
						style={{ width: 250, borderRadius: 30 }}
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
						}
						options={categories?.map((co) => ({ label: co.name_ar, value: co.id }))}
						placeholder="Search By Category"
						allowClear
						onChange={handleCategoryChange}
					/>
				</MDBox>
				
			</MDBox>
			<Table
				onChange={handleChange}
				columns={columns}
				dataSource={offers?.items}
				pagination={{ position: ['bottom', 'right'], defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '50', '100'], total: offers?.meta?.totalItems }}
				rowKey={(record) => record.id}
				rowSelection={{
					selectedRowKeys,
					onChange: (selectedRowKeys, selectedRows) => {
						setSelectedRowKeys(selectedRowKeys);
					}
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
				onClick={() => navigate("/offers/create")}
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
						Delete {open.name} Offer
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

export default Offers;
