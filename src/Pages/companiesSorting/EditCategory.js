import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import MDInput from "components/MDInput";
import Button from "@mui/material/Button";

import { useNavigate, useParams } from "react-router-dom";
import CategoriesServices from "Services/CategoriesServices";
import useFetch from "Hooks/useFetch";
import { Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};

function EditCategory() {
	const { id: CategoryId } = useParams();
	const navigate = useNavigate();
	const [category, setCategory] = useState(null);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		getCategory();
	}, []);
	const getCategory = async () => {
		setLoading(true);
		try {
			const response = await CategoriesServices.getCategoryDetails(CategoryId);
			if (response && response.status == 200) {
				setLoading(false);
				setCategory(() => response.data);
			} else {
				toast.error("sorry something went wrong while getting packages!");
				setLoading(false);
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting pages!");
			setLoading(false);
		}
	};

	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};
	// const handleFormSubmit = async () => {
	// 	setLoading(true);
	// 	const { id, name_en, name_ar } = category;
	// 	const response = await CategoriesServices.updateCategory({ id, name_en, name_ar });
	// 	console.log("this is update repsponse:>", response, response.statusText);
	// 	if (response.statusText == "OK") {
	// 		navigate("/categories");
	// 	}
	// 	console.log("this is the response", response);
	// 	setLoading(false);
	// };
	const mutation = useMutation(data => {
		console.log({data})
			const fd = new FormData();
		return CategoriesServices.updateCategory(data,category.id);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('something went wrong');
			setLoading(false);
		},
		onSuccess: () => {
			toast.success("your category has been edited successfully!");
			setLoading(false);
			navigate(`/categories`);
		},
	});


	if (!category || loading) return <LoadingDataLoader />;
	const initialValues = {
		name_en: category.name_en || "",
		name_ar: category.name_ar || "",
	};
	return (
		<DashboardLayout>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>

					<Form layout="vertical" initialValues={initialValues} {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
						<Form.Item style={{ marginBottom: 0 }} >
							<Form.Item label="الإسم بالعربيه" name="name_ar" rules={[{ required: true, message: 'الإسم باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder='الإسم باللغه العربيه' />
							</Form.Item>
							<Form.Item label="الإسم بالإنجليزيه" className="ltr:mr-4 rtl:ml-4" name="name_en" rules={[{ required: true, message: 'الإسم باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder='الإسم باللغه الإنجليزيه' />
							</Form.Item>

						</Form.Item>
						<Form.Item className="mt-8" >
							<Button type="primary" htmlType="submit" className='mx-2 bg-blue-500 rtl:pt-2'>
								submit
							</Button>
							<Button htmlType="button" onClick={onReset} className='mx-2 rtl:pt-2 '>
								reset
							</Button>
						</Form.Item>
					</Form>
				</Paper>
			</Container>
		</DashboardLayout>
	);
}

export default EditCategory;
