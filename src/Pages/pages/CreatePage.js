import React, { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import useLoading from "Hooks/useLoading";
import TextArea from 'antd/lib/input/TextArea';
import PagesServices from "Services/PagesServices";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-toastify";
const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
function CreatePage() {
	const navigate = useNavigate();
	const { setLoading } = useLoading();
	const [page, setPage] = useState({});
  const [content, setContent] = useState('إكتب المحتوي هنا');

	const handleFormSubmit = async () => {
		setLoading(true);
		const response = await PagesServices.createPage(page);
		console.log(response);
		if (response.status == 201) {
			navigate("/pages");
		}
		console.log("this is the response", response);
		setLoading(false);
	};
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};



	const mutation = useMutation(data => {
		console.log({ PageData: data });
			return PagesServices.createPage({...data,content:content});
		}, {
			onError: (error) => {
				console.log({ error });
				toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
			},
			onSuccess: () => {
				toast.success('لقد تم إنشاء الصفحه بنجاح')
				navigate("/pages");
		
			},
	});
	return (
		<DashboardLayout>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
					<div className="mt-4">
						<Form layout="vertical" {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
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
					</div>
				</Paper>
			</Container>
		</DashboardLayout>
	);
}

export default CreatePage;
