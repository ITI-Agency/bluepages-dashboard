import React, { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select } from 'antd';
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import useLoading from "Hooks/useLoading";
import TextArea from 'antd/lib/input/TextArea';
import PagesServices from "Services/PagesServices";
import { toast } from "react-toastify";
import SubscriptionPlanPackagesServices from "Services/SubscriptionPlanPackagesServices";
import Util from "../../Utils";
const plans = Util.plans;
const { Option } = Select;

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
function CreatePage() {
	const navigate = useNavigate();
	const { setLoading } = useLoading();
	const [planPackages, setPlanPackages] = useState([]);


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
		console.log({ PackageData: data });
		return SubscriptionPlanPackagesServices.createSubscriptionPlanPackage({ ...data });
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
		},
		onSuccess: () => {
			toast.success('لقد تم إنشاء الباقه بنجاح');
			navigate("/plan-packages");

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

								<Form.Item label='خطه الإشتراك للصفحات' name="subscriptionPlanId" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار خطه الإشتراك' }]}>
									<Select
										placeholder='برجاء إختيار خطه الإشتراك'
										allowClear
									>
										{plans?.filter(p=>p.package_id!==1)?.map((p) => (<Option key={p.package_id} value={p.package_id}>{p[`name_ar`]}</Option>))}
									</Select>
								</Form.Item>
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
							<Form.Item label="المده (بالأيام)" className="ltr:mr-4 rtl:ml-4"  name="duration" rules={[{ required: true, message: "برجاء إدخال المده (بالأيام)" }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
													<Input type='number' placeholder=" المده (بالأيام)" />
												</Form.Item>
												<Form.Item label="السعر" className="" name="price" rules={[{ required: true, message: "برجاء إدخال  السعر " }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
													<Input type='number' placeholder="السعر" />
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
					</div>
				</Paper>
			</Container>
		</DashboardLayout>
	);
}

export default CreatePage;
