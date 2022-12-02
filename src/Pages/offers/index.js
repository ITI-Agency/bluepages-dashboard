import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";
import DataTable from "examples/Tables/DataTable";
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
import { Button, Form, Select, Table, Input, Space } from "antd";

import { toast } from "react-toastify";

import LogoPlaceholder from "assets/images/logo-placeholder.png";

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

	useEffect(() => {
		getAllOffers();
	}, []);
	const getAllOffers = async () => {
		setLoading(true);
		try {
			const response = await OffersServices.getAllOffers();
			if (response && response.status == 200) {
				setLoading(false);
				setData(response.data);
				setOffers(response.data);
			} else {
				toast.error("sorry something went wrong while getting offers!");
				setLoading(false);
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting offers!");
			setLoading(false);
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
		const dd = offers.map((i) => {
			if (i.id == item.id) i.status = status;
			return i;
		});
		setOffers(dd);
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
	if (loading) return <LoadingDataLoader />;
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
			title: "views",
			key: 'plan',
			render: (_, record) => <p className='text-sm font-medium text-gray-900 '>{record.views}</p>,
			sorter: (a, b) => a.views - b.views,
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
			<Table columns={columns} dataSource={offers} />
			{/* <DataTable
        table={{
          columns: [
            { Header: "name", accessor: "name_en" },
            { Header: "image", accessor: "images" },
            { Header: "views", accessor: "views" },
            { Header: "on sale", accessor: "on_sale" },
            { Header: "Active", accessor: "status" },
            { Header: "created", accessor: "createdAt" },
            { Header: "expire", accessor: "endAt" },
            { Header: "actions", accessor: "actions" },
          ],
          rows: offers.map((item) => {
            return {
              ...item,
              name_en: (
                <>
                  <Link to={`/offers/${item.id}`}>
                    <MDBox lineHeight={1}>
                      <MDTypography display="block" variant="button" fontWeight="medium">
                        {item.name_en}
                      </MDTypography>
                      <MDTypography variant="caption">{item.description_en}</MDTypography>
                    </MDBox>
                  </Link>
                </>
              ),
              images: (
                <img
                  src={item.images.length ? item.images[0].image : LogoPlaceholder}
                  alt={item.name_en}
                  style={{ width: "2rem", height: "2rem" }}
                />
              ),
              createdAt: <Moment fromNow>{item.createdAt}</Moment>,
              endAt: <Moment fromNow>{item.endAt}</Moment>,
              on_sale: item.on_sale ? (
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
                    <Link to={`/offers/edit/${item.id}`}>
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
