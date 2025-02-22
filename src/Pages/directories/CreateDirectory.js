import React, { useEffect, useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select } from 'antd';
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import useLoading from "Hooks/useLoading";
import TextArea from 'antd/lib/input/TextArea';
import PagesServices from "Services/PagesServices";
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-toastify";
import LoadingDataLoader from "components/LoadingDataLoader";
import CitiesServices from 'Services/CitiesServices';
const { Option } = Select;
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import DirectoryService from "Services/DirectoryService";

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
function CreateDirectory() {
	const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
	const [directory, setDirectory] = useState({});
	const [dataLoaded, setDataLoaded] = useState(false);
	const [cities, setCities] = useState([]);
	const [pdf, setpdf] = useState([]);

	const [content, setContent] = useState('إكتب المحتوي هنا');
	useEffect(() => {
		getFieldsData();
	}, []);
	const getFieldsData = async () => {
		const { status: citiesStatus, data: citiesData } = await CitiesServices.getAllCities();
		console.log("this is data:>", {
			citiesData,
		});
		if (
			citiesStatus == 200
		) {
			setCities(citiesData);
			setDataLoaded(true);
			return;
		}
	};
	// const handleFormSubmit = async () => {
	// 	let formData = new FormData();
	// 	Object.keys(formValues).forEach((t) => {
	// 		if (t == "file") {
	// 			fd.append(t, formValues[t][0].originFileObj);
	// 		} else {
	// 			fd.append(t, formValues[t]);
	// 		}
	// 	});
	// 	setLoading(true);
	// 	const response = await PagesServices.createPage(page);
	// 	console.log(response);
	// 	if (response.status == 201) {
	// 		navigate("/pages");
	// 	}
	// 	console.log("this is the response", response);
	// 	setLoading(false);
	// };
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};

	const mutation = useMutation(data => {
		console.log({ PageData: data });
		let formData = new FormData();
		if (pdf?.length) {
			formData.append("pdf", pdf[0].originFileObj);
		}else{
			toast.error('الرجاء إضافه صور أولا')
			return;
		}
		Object.keys(data).forEach((t) => {
			formData.append(t, data[t]);
		});
		setLoading(true);
		return DirectoryService.createDirectory(formData);
		}, {
			onError: (error) => {
				console.log({ error });
				setLoading(false);
				toast.error("لقد تم إضافه ملف لهذه الغرفه التجاريه بالفعل");
			},
			onSuccess: (res) => {

				if(res){
				setLoading(false);
					toast.success('لقد تم إنشاء الدليل بنجاح')
					navigate("/directories");
				}
			},
	});

	if (!dataLoaded || loading) return <LoadingDataLoader />;

	return (
		<DashboardLayout>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
					<div className="mt-4">
						<Form layout="vertical" {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label='الغرفه التجاريه' className="ltr:mr-4 rtl:ml-4" name="cityId" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار غرفه تجاريه' }]}>
									<Select
										showSearch
										optionFilterProp="children"
										filterOption={(input, option) =>
											(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										options={cities?.map((co) => ({ label: co.name_ar, value: co.id }))}
										placeholder='برجاء إختيار غرفه تجاريه'
										allowClear
									>
										{cities?.map((ci) => (<Option key={ci.id} value={ci.id}>{ci[`name_ar`]}</Option>))}
									</Select>
								</Form.Item>
								<Form.Item label="ملف الدليل (pdf) " style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="logo">
									{/* <ImgCrop aspect={4.47} rotate> */}
									<Upload
										onChange={({ fileList }) => { setpdf( fileList ); }}
							beforeUpload={() => false}>
										<Button icon={<UploadOutlined />}>إضغط لإضافه ملف </Button>
									</Upload>
									{/* </ImgCrop> */}
								</Form.Item>
							</Form.Item>

							<Form.Item label="رقم الترتيب" name="index_number">
                <InputNumber style={{ width: '100%' }} placeholder="أدخل رقم الترتيب" />
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

export default CreateDirectory;
