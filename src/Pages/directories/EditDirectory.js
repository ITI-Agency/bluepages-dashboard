import React, { useEffect, useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select } from 'antd';
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id: directoryId } = useParams();

	const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
	const [directory, setDirectory] = useState({});
	const [dataLoaded, setDataLoaded] = useState(false);
	const [cities, setCities] = useState([]);
	const [pdf, setpdf] = useState([]);

	const [content, setContent] = useState('إكتب المحتوي هنا');
	// useEffect(() => {
	// 	getFieldsData();
	// }, []);
	// const getFieldsData = async () => {
	// 	const { status: citiesStatus, data: citiesData } = await CitiesServices.getAllCities();
	// 	console.log("this is data:>", {
	// 		citiesData,
	// 	});
	// 	if (
	// 		citiesStatus == 200
	// 	) {
	// 		setCities(citiesData);
	// 		setDataLoaded(true);
	// 		return;
	// 	}
	// };
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
			formData.append("file", pdf[0].originFileObj);
		}else{
			toast.error('الرجاء إضافه صور أولا')
			return;
		}
		// Object.keys(data).forEach((t) => {
		// 	formData.append(t, data[t]);
		// });
		setLoading(true);
		return DirectoryService.updateDirectory(formData,directoryId);
		}, {
			onError: (error) => {
				console.log({ error });
				setLoading(false);
				toast.error("لقد حدث خطأ ما, برجاء التأكد من ملأ البيانات بطريقه صحيحه");
			},
			onSuccess: (res) => {

				if(res){
				setLoading(false);
					toast.success('لقد تم تعديل الدليل بنجاح')
					navigate("/directories");
				}
			},
	});

	if (loading) return <LoadingDataLoader />;

	return (
		<DashboardLayout>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
					<div className="mt-4">
						<Form layout="vertical" {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
							<Form.Item style={{ marginBottom: 0 }} >
		
								<Form.Item label="تعديل ملف الدليل" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="logo">
									{/* <ImgCrop aspect={4.47} rotate> */}
									<Upload
										onChange={({ fileList }) => { setpdf( fileList ); }}
							beforeUpload={() => false}>
										<Button icon={<UploadOutlined />}>إضغط لإضافه ملف </Button>
									</Upload>
									{/* </ImgCrop> */}
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

export default CreateDirectory;
