import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Skeleton } from 'antd';
import { BsBackspaceFill } from 'react-icons/bs';
import TextArea from 'antd/lib/input/TextArea';
import BranchesServices from "Services/BranchesServices";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';

// import useFetch from "Hooks/useFetch";
const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
const EditBranch = ({ company, setCreate, setEdit, id }) => {
	const queryClient = useQueryClient();

	const { data: singleBranch, isLoading } = useQuery(['single-branch', id], () => BranchesServices.getBranchDetails(id));
	const handleGoBack = () => {
		setCreate(false);
		setEdit(false);
	};
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};



	const mutation = useMutation(data => {
		console.log(data);
			return BranchesServices.updateBranch(data,id)
		}, {
			onError: (error) => {
				console.log({ error });
				toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
			},
			onSuccess: () => {
				// Boom baby!
				queryClient.invalidateQueries({ queryKey: ['company-branches'] });
				queryClient.invalidateQueries({ queryKey: ['single-branch',id] });
				toast.success('لقد تم تعديل الفرع بنجاح');
				handleGoBack();
				// Router.push('/login')
			},
	});

	if (isLoading) {
		return (
			<div className="p-8 mx-auto mt-8 bg-white rounded-md shadow-md md:w-9/12">
				<Skeleton active />
			</div>

		);
	}
	const initialValues = {
		name_ar: singleBranch.name_ar || "",
		name_en: singleBranch.name_en || "",
		address_ar: singleBranch.address_ar || "",
		address_en: singleBranch.address_en || "",
		description_ar: singleBranch.description_ar || "",
		description_en: singleBranch.description_en || "",
		phone: singleBranch.phone || "",
		phone_number: singleBranch.phone_number || "",
		link: singleBranch.link || "",

	};
	return (
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
					<div className='mx-8'>
						<button
							onClick={handleGoBack}
							className=" px-4 py-2.5 bg-purple-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-400 hover:shadow-lg focus:bg-purple-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mb-4"
						>
							<BsBackspaceFill className="mr-2 font-bold text-white" />
							Go Back
						</button>
						<div className="mt-4">
							<Form layout="vertical" initialValues={initialValues} {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
								<Form.Item style={{ marginBottom: 0 }} >
									<Form.Item label="الإسم بالعربيه" name="name_ar" rules={[{ required: true, message: 'الإسم باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
										<Input placeholder='الإسم باللغه العربيه' />
									</Form.Item>
									<Form.Item label="الإسم بالإنجليزيه" className="" name="name_en" rules={[{ required: true, message: 'الإسم باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
										<Input placeholder='الإسم باللغه الإنجليزيه' />
									</Form.Item>
								</Form.Item>
								<Form.Item style={{ marginBottom: 0 }} >
									<Form.Item label="العنوان بالعربيه" name="address_ar" rules={[{ required: true, message: 'العنوان باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
										<Input placeholder='العنوان باللغه العربيه' />
									</Form.Item>
									<Form.Item label="العنوان بالإنجليزيه" className="" name="address_en" rules={[{ required: true, message: 'العنوان باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
										<Input placeholder='العنوان باللغه الإنجليزيه' />
									</Form.Item>
								</Form.Item>
								<Form.Item style={{ marginBottom: 0 }} >
									<Form.Item label="الوصف بالعربيه" name="description_ar" rules={[{ required: true, message: 'الوصف باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
										<TextArea placeholder='الوصف باللغه العربيه' rows={4} />
									</Form.Item>
									<Form.Item label="الوصف بالإنجليزيه" className="" name="description_en" rules={[{ required: true, message: 'الوصف باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
										<TextArea placeholder='الوصف باللغه الإنجليزيه' rows={4} />
									</Form.Item>
								</Form.Item>
								<Form.Item style={{ marginBottom: 0 }} >
									<Form.Item label="الرابط" name="link" className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
										<Input placeholder="الرابط" />
									</Form.Item>
									<Form.Item label="رقم الهاتف" className="ltr:mr-2 rtl:ml-2" name="phone" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
										<Input placeholder="رقم الهاتف" />
									</Form.Item>
									<Form.Item label="رقم الجوال" className="" name="phone_number" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
										<Input placeholder="رقم الجوال" />
									</Form.Item>
								</Form.Item>
								<Form.Item >
									<Button type="primary" htmlType="submit" className='mx-2 bg-blue-500 rtl:pt-2'>
										submit
									</Button>
									<Button htmlType="button" onClick={onReset} className='mx-2 rtl:pt-2 '>
										reset
									</Button>

								</Form.Item>
							</Form>
						</div>
					</div>
				</Paper>
			</Container>
	);
};

export default EditBranch;
// import MDInput from "components/MDInput";
// import Button from "@mui/material/Button";

// import { useNavigate, useParams } from "react-router-dom";
// import useFetch from "Hooks/useFetch";
// import BranchesServices from "Services/BranchesServices";

// function EditBranch() {
//   const { id: branchId } = useParams();
//   const navigate = useNavigate();
//   const { data, error } = useFetch(() => BranchesServices.getBranchDetails(branchId));
//   const [branch, setBranch] = useState({ name: "", email: "" });
//   const [loading, setLoading] = useState(false);

//   const handleFieldChange = (e) => {
//     setBranch({ ...branch, [e.target.name]: e.target.value });
//   };

//   const handleFormSubmit = async () => {
//     setLoading(true);
//     const { id, name, email } = branch;
//     const response = await BranchsServices.updateBranch({ id, name, email });
//     console.log("this is update repsponse:>", response, response.statusText);
//     if (response.statusText == "OK") {
//       navigate("/branchs");
//     }
//     console.log("this is the response", response);
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (data) setBranch(data);
//   }, [data]);
//   if (error)
//     return (
//       <DashboardLayout>
//         <p>There is an error.</p>
//       </DashboardLayout>
//     );
//   if (!data || loading) return <LoadingDataLoader />;
//   return (
//     <DashboardLayout>
//       <Container sx={{ mb: 4 }}>
//         <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
//           <form>
//             <Grid container spacing={5}>
//               <Grid item xs={12} sm={4}>
//                 <MDInput
//                   fullWidth
//                   type="text"
//                   label="name en"
//                   name="name_en"
//                   value={branch.name_en}
//                   onChange={handleFieldChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <MDInput
//                   fullWidth
//                   type="text"
//                   label="name ar"
//                   name="name_ar"
//                   value={branch.name_ar}
//                   onChange={handleFieldChange}
//                 />
//               </Grid>
//             </Grid>
//             <Grid item xs={12} sm={6} mt={4}>
//               <Button variant="contained" style={{ color: "#fff" }} onClick={handleFormSubmit}>
//                 Update
//               </Button>
//             </Grid>
//           </form>
//         </Paper>
//       </Container>
//     </DashboardLayout>
//   );
// }

// export default EditBranch;
