import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import React from 'react';
import { BsBackspaceFill } from 'react-icons/bs';

import TextArea from 'antd/lib/input/TextArea';
import BranchesServices from 'Services/BranchesServices';
import { toast } from 'react-toastify';
const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
const AddBranch = ({ company, setCreate, setEdit }) => {

	const queryClient = useQueryClient();


	const handleGoBack = () => {
		setCreate(false);
		setEdit(false);
	};
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};



	const mutation = useMutation(data => {
			console.log(data)
			data.companyId=company.id;
			data.userId=company.userId;

			return BranchesServices.createBranch(data);
		}, {
			onError: (error) => {
				console.log({ error });
				toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
			},
			onSuccess: () => {
				// Boom baby!
				toast.success('لقد تم إنشاء الفرع بنجاح');
				handleGoBack();
				queryClient.invalidateQueries({ queryKey: ['company-branches'] });

				// Router.push('/login')
			},
	});
	return (
		<div className='mx-8'>
			<button
				onClick={handleGoBack}
				className=" px-4 py-2.5 bg-purple-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-400 hover:shadow-lg focus:bg-purple-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mb-4"
			>
				<BsBackspaceFill className="mr-2 font-bold text-white" />
				Go Back
			</button>
			<div className="mt-4">
				<Form layout="vertical" {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
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
						<Form.Item label="رقم الهاتف"  className="ltr:mr-4 rtl:ml-4" name="phone" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
							<Input placeholder="رقم الهاتف" />
						</Form.Item>
						<Form.Item label="رقم الجوال" className="ltr:mr-4 rtl:ml-4"  name="phone_number" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
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
	);
};

export default AddBranch;