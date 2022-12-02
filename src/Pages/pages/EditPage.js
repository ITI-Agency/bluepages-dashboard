import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Container, Paper } from "@mui/material";
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Upload } from 'antd';
import LoadingDataLoader from "components/LoadingDataLoader";
import TextArea from "antd/lib/input/TextArea";
import CountriesServices from "Services/CountriesServices";
import { useNavigate, useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import PagesServices from "Services/PagesServices";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};

function EditCountry() {
	const [page, setPage] = useState(null);
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('إكتب المحتوي هنا');

	useEffect(() => {
		getPage();
	}, []);
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};
	const getFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const getPage = async () => {
		setLoading(true);
		try {
			const response = await PagesServices.getPageDetails(id);
			if (response && response.status == 200) {
				setLoading(false);
				setPage(() => response.data);
				setContent(response?.data?.content)
			} else {
				toast.error("sorry something went wrong while getting packages!");
				setLoading(false);
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting pages!");
			setLoading(false);
		}
	};


	const mutation = useMutation(data => {
		console.log("submitted data", data);
		// 	const fd = new FormData();
			return PagesServices.updatePage({...data,content:content},page.id);
		}, {
			onError: (error) => {
				console.log({ error });
				toast.error('something went wrong');
				setLoading(false);
			},
			onSuccess: () => {
				toast.success("your countries has been edited successfully!");
				setLoading(false);
				navigate(`/pages`);
			},
	});


	if (loading || !page) return <LoadingDataLoader />;
	console.log("page", page);
	const initialValues = {
		title_en: page.title_en || "",
		title_ar: page.title_ar || "",
		slug: page.slug || "",

		// views: settings.views || "",
	};

	return (
		<DashboardLayout>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>

					<Form layout="vertical" initialValues={initialValues} {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
					<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="الإسم بالعربيه" name="title_ar" rules={[{ required: true, message: 'الإسم باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder='الإسم باللغه العربيه' />
								</Form.Item>
								<Form.Item label="الإسم بالإنجليزيه" className="ltr:mr-4 rtl:ml-4" name="title_en" rules={[{ required: true, message: 'الإسم باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder='الإسم باللغه الإنجليزيه' />
								</Form.Item>
								<Form.Item label="إسم الرابط" name="slug" rules={[{ required: true, message: "إسم الرابط مطلوب" }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="إسم الرابط" />
								</Form.Item>
							</Form.Item>

							<Form.Item style={{ marginBottom: 0 }} >
								<ReactQuill rows={5} theme="snow" value={content} onChange={setContent} />
								
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

export default EditCountry;