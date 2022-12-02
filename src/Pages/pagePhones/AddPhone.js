import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import React from 'react';
import { BsBackspaceFill } from 'react-icons/bs';
import PagePhonesServices from 'Services/PagePhonesServices'
import { toast } from 'react-toastify';

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
const AddPhone = ({ company, setCreate, setEdit }) => {

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
		data.companyId=company.id;
		// data.userId=company.userId;

		return PagePhonesServices.createPhone(data);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
		},
		onSuccess: () => {
			// Boom baby!
			toast.success('لقد تم إنشاء رقم الهاتف بنجاح', 'success');
			queryClient.invalidateQueries({ queryKey: ['company-phones'] });
			handleGoBack();
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
						<Form.Item label="رقم الهاتف" name="phone" rules={[{ required: true, message: "رقم الهاتف مطلوب" }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
							<Input placeholder="رقم الهاتف" />
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

export default AddPhone;