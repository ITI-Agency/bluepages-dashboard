
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
import DirectoryRequestService from "Services/DirectoryRequestService";
import { useMutation } from '@tanstack/react-query';
const { Option } = Select;
import { Button, Form, Select, Table, Input, Space, Radio } from "antd";

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
const plainOptions = ['Apple', 'Pear', 'Orange'];
function Pages() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [directories, setDirectories] = useState([]);
	const navigate = useNavigate();
	const [open, setOpen] = useState({ state: false });
	const [edit, setEdit] = useState({ state: false });
	const [decision, setDecision] = useState();
	useEffect(() => {
		getAllDirectoryRequests();
	}, []);

	const getAllDirectoryRequests = async () => {
		setLoading(true);
		try {
			const response = await DirectoryRequestService.getAllDirectoryRequests();
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
		setOpen({ state: true, id: id });
	};
	const handleOpenEdit = (id) => {
		setEdit({ state: true, id });
	};
	const handleClose = () => {
		setOpen({ state: false });
	};
	const handleCloseEdit = () => {
		setEdit({ state: false });
	};
	const handleOkEdit = useMutation(data => {
		console.log(data);
		if (!decision) {
			toast.error("برجاء إختيار القرار قبل التأكيد");
			handleCloseEdit();
			return;
		}
		setLoading(true);
		return DirectoryRequestService.updateDirectoryRequest({ status: decision }, data.id);
	}, {
		onError: (error) => {
			console.log({ error });
			handleCloseEdit();
			setLoading(false);
			toast.error("لقد حدث خطأ ما");
		},
		onSuccess: (res) => {
			if (res) {
				setLoading(false);
				toast.success('لقد تم تعديل الطلب   بنجاح');
				handleCloseEdit();
				// navigate("/directories");
				getAllDirectoryRequests();
			}
		},
	});


	const handleDelete = async (pageId) => {
		console.log({ pageId });
		try {
			const res = await DirectoryRequestService.removeDirectory(pageId);
			if (res.status == 200) {
				handleClose();
				toast.success("this page was removed successfully!");
				setLoading(false);
				getAllDirectoryRequests();
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
	const statusFilters = [
		{ text: "Pending", value: "pending" },
		{ text: "Accepted", value: "accepted" },
		{ text: "Rejected", value: "rejected" },
	];
	const columns = [
		{
			title: "#",
			dataIndex: `id`,
			key: 'id',
			render: (text, record) => <p className='text-sm font-medium text-gray-900 '>{record.id}</p>,
		},
		{
			title: "City",
			key: 'city',
			render: (text, record) => (
				<MDBox lineHeight={1}>
					<MDTypography display="block" variant="button" fontWeight="medium">
						{record.city.name_ar}
					</MDTypography>
				</MDBox>
			),
		},
		{
			title: "Name",
			dataIndex: `name`,
			key: 'name',
			render: (text, record) => (
				<MDBox lineHeight={1}>
					<MDTypography display="block" variant="button" fontWeight="medium">
						{text}
					</MDTypography>
				</MDBox>
			),
		},
		{
			title: "Type",
			dataIndex: `type`,
			key: 'type',
			render: (text, record) => (
				<MDBox lineHeight={1}>
					<MDTypography display="block" variant="button" fontWeight="medium">
						{text}
					</MDTypography>
				</MDBox>
			),
		},
		{
			title: "Company Name",
			dataIndex: `company_name`,
			key: 'company_name',
			render: (text, record) => (
				<MDBox lineHeight={1}>
					<MDTypography display="block" variant="button" fontWeight="medium">
						{text}
					</MDTypography>
				</MDBox>
			),
		},
		{
			title: "Email",
			dataIndex: `email`,
			key: 'email',
			render: (text, record) => (
				<MDBox lineHeight={1}>
					<MDTypography display="block" variant="button" fontWeight="medium">
						{text}
					</MDTypography>
				</MDBox>
			),
			width:"20%"
		},
		{
			title: "Phone",
			dataIndex: `phone`,
			key: 'phone',
			render: (text, record) => (
				<MDBox lineHeight={1}>
					<MDTypography display="block" variant="button" fontWeight="medium">
						{text}
					</MDTypography>
				</MDBox>
			),
		},
		{
			title: "Status",
			dataIndex: `status`,
			key: 'status',
			render: (text, record) => (
				record.status == 'pending' ?
					<p className="text-yellow-400 border-[1px] px-1 rounded border-yellow-400"> {record.status}</p>
					:
					record.status == 'accepted' ?
						<p className="text-green-400 border-[1px] px-1 rounded border-green-400">{record.status}</p>
						:
						<p className="text-red-400 border-[1px] px-1 rounded border-red-400">{record.status}</p>
			),
			filters: statusFilters,
			onFilter: (value, record) => record.status.indexOf(value) === 0,
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
						flexDirection={{ xs: 'column', sm: 'column' }}
						alignItems="center"
						justifyContent="center"
						mt={{ xs: 2, sm: 0 }}
						ml={{ xs: -1.5, sm: 0 }}
					>
						<MDBox mr={1}>
							<MDButton onClick={() => handleOpen(record.id)} variant="text" color="error">
								<Icon>delete</Icon>&nbsp;delete
							</MDButton>
						</MDBox>
						{
							record.status == 'pending' ?
								<MDButton onClick={() => {
									setDecision(null);
									handleOpenEdit(record.id);
								}}
									variant="text" color="dark">
									<Icon>edit</Icon>&nbsp;edit
								</MDButton>
								: null
						}

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
						{ Header: "City", accessor: "city.name_ar" },
						{ Header: "Name", accessor: "name" },
						{ Header: "type", accessor: "type" },
						{ Header: "Company Name", accessor: "company_name" },
						{ Header: "Email", accessor: "email" },
						{ Header: "Phone", accessor: "phone" },
						{ Header: "status", accessor: "status" },
						// { Header: "updated", accessor: "updatedAt" },
						// { Header: "status", accessor: "status" },
						{ Header: "Actions", accessor: "actions" },
						{ Header: "Created", accessor: "createdAt" },
					],
					rows: directories.map((item) => ({
						...item,
						id: (
							<MDTypography display="block" variant="button" fontWeight="medium">
								{item.id}
							</MDTypography>
						),
						status: (
							item.status == 'pending' ?
								<p className="text-yellow-400 border-[1px] px-1 rounded border-yellow-400"> {item.status}</p>
								:
								item.status == 'accepted' ?
									<p className="text-green-400 border-[1px] px-1 rounded border-green-400">{item.status}</p>
									:
									<p className="text-red-400 border-[1px] px-1 rounded border-red-400">{item.status}</p>
						),

						createdAt: <Moment fromNow>{item.createdAt}</Moment>,
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
									{
										item.status == 'pending' ?
											<MDButton onClick={() => {
												setDecision(null);
												handleOpenEdit(item.id);
											}}
												variant="text" color="dark">
												<Icon>edit</Icon>&nbsp;edit
											</MDButton>
											: null
									}

								</MDBox>
							</>
						),
					})),
				}}
			/> */}
			<Table columns={columns} dataSource={directories} />

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
			<Modal
				open={edit.state}
				onClose={handleCloseEdit}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				dir="rtl"
			>
				<MDBox sx={style}>
					<MDTypography id="modal-modal-title" variant="h6" component="h2">
						برجاء إختيار القرار
					</MDTypography>
					<Radio.Group onChange={(e) => setDecision(e.target.value)} >
						<Radio value="accepted">قبول</Radio>
						<Radio value="rejected">رفض</Radio>
					</Radio.Group>
					<MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
						<MDBox mt={4} mr={1}>
							<MDButton style={{ border: "1px green solid", borderRadius: "10px" }} onClick={() => handleOkEdit.mutate({ id: edit.id, decision })} variant="text" color="success">
								<Icon>checked</Icon>&nbsp;تأكيد
							</MDButton>
						</MDBox>
						<MDBox mt={4} mr={1}>
							<MDButton style={{ border: "1px blue solid", borderRadius: "10px" }} onClick={handleCloseEdit} variant="text" color="info">
								العوده
							</MDButton>
						</MDBox>
					</MDBox>
				</MDBox>
			</Modal>
		</DashboardLayout>
	);
}

export default Pages;
