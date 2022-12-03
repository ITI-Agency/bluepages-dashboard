import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Container, Paper } from "@mui/material";
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Upload } from 'antd';
import LoadingDataLoader from "components/LoadingDataLoader";
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from '@ant-design/icons';
import SettingsServices from '../../Services/SettingsServices';

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};

function Settings() {
	const [settings, setSettings] = useState(null);
	const [logoFileAr, setLogoFileAr] = useState([]);
	const [logoFileEn, setLogoFileEn] = useState([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getSettings();
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

	const getSettings = async () => {
		setLoading(true);
		try {
			const response = await SettingsServices.getSettings();
			console.log({ response });
			if (response && response.status == 200) {
				setLoading(false);
				setSettings(response.data);
				setLogoFileAr(response?.data?.logo_ar);
				setLogoFileEn(response?.data?.logo_en);
			} else {
				toast.error("sorry something went wrong while getting packages!");
				setLoading(false);
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting packages!");
			setLoading(false);
		}
	};


	const mutation = useMutation(data => {
		console.log({ data });
		const fd = new FormData();
		if (!data.logoFileAr) delete data.logoFileAr;
		if (!data.logoFileEn) delete data.logoFileEn;
		Object.keys(data).forEach((t) => {
			if (t == "logoFileAr" || t == "logoFileEn") {
				fd.append(t, data[t][0].originFileObj);
			} else {
				fd.append(t, data[t]);
			}
		});

		return SettingsServices.updateSettings(fd);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('something went wrong');
		},
		onSuccess: () => {
			toast.success('Settings edited successfully');
			form.setFieldsValue({ file: null });
			window.location.reload(false);
			// navigate("/plan-packages");
		},
	});


	if (loading || !settings) return <LoadingDataLoader />;
	console.log("settings", settings);
	const initialValues = {
		title_ar: settings.title_ar || "",
		title_en: settings.title_en || "",
		email: settings.email || "",
		address_en: settings.address_en || "",
		address_ar: settings.address_ar || "",
		whatsapp: settings.whatsapp || "",
		description_en: settings.description_en || "",
		description_ar: settings.description_ar || "",
		phone: settings.phone || "",
		keywords: settings.keywords || "",
		facebook: settings.facebook || "",
		twitter: settings.twitter || "",
		instagram: settings.instagram || "",
		snapchat: settings.snapchat || "",
		youtube: settings.youtube || "",
		copyright_en: settings.copyright_en || "",
		copyright_ar: settings.copyright_ar || "",
		location: settings.location || "",
		// latitude: settings.latitude || "",
		// longitude: settings.longitude || "",
		location_link: settings.location_link || "",
		price_for_main_page_offers: Number(settings.price_for_main_page_offers) || 0,
		// views: settings.views || "",
	};

	return (
		<DashboardLayout>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
					<div className="mt-4">
						<Form layout="vertical" initialValues={initialValues} {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
							<Form.Item className="mt-4 mb-0">
								<Form.Item label="اللوجو للغه العربيه " name="logoFileAr" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} getValueFromEvent={getFile} valuePropName="fileList">
									<Upload
										beforeUpload={() => false}>
										<Button icon={<UploadOutlined />}>أضف لوجو اللغه العربيه</Button>
									</Upload>

								</Form.Item>
								<Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} >
									{
										logoFileAr ?
											// <Image
											// 	width={100}
											// 	src={company?.logo}
											// />
											<img src={logoFileAr} alt="" width="140px" className="p-4 bg-gray-700 rounded-lg" />
											: null
									}
								</Form.Item>
							</Form.Item>
							<Form.Item className="mt-4 mb-0">
								<Form.Item label="اللوجو للغه الإنجليزيه " name="logoFileEn" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} getValueFromEvent={getFile} valuePropName="fileList">
									<Upload
										beforeUpload={() => false}>
										<Button icon={<UploadOutlined />}>أضف لوجو اللغه العربيه</Button>
									</Upload>

								</Form.Item>
								<Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} >
									{
										logoFileEn ?
											// <Image
											// 	width={100}
											// 	src={company?.logo}
											// />
											<img src={logoFileEn} alt="" width="140px" className="p-4 bg-gray-700 rounded-lg" />
											: null
									}
								</Form.Item>
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="الإسم بالعربيه" name="title_ar" rules={[{ required: true, message: 'الإسم باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder='الإسم باللغه العربيه' />
								</Form.Item>
								<Form.Item label="الإسم بالإنجليزيه" className="ltr:mr-4 rtl:ml-4" name="title_en" rules={[{ required: true, message: 'الإسم باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder='الإسم باللغه الإنجليزيه' />
								</Form.Item>
								<Form.Item label="الإيميل" name="email" rules={[{ required: true, message: "الإيميل مطلوب" }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="الإيميل" />
								</Form.Item>
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="العنوان بالعربيه" name="address_ar" rules={[{ required: true, message: 'العنوان باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder='العنوان باللغه العربيه' />
								</Form.Item>
								<Form.Item label="العنوان بالإنجليزيه" className="ltr:mr-4 rtl:ml-4" name="address_en" rules={[{ required: true, message: 'العنوان باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder='العنوان باللغه الإنجليزيه' />
								</Form.Item>
								<Form.Item label="كلمات دلاليه (مثال: أعمال,السعوديه,...)" name="keywords" rules={[{ required: true, message: "الواتساب مطلوب" }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="كلمات دلاليه (مثال: أعمال,السعوديه,...)" />
								</Form.Item>
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label='الوصف باللغه العربيه' name="description_ar" rules={[{ required: true, message: 'الوصف باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Form.Item >
										<TextArea defaultValue={settings?.description_ar} placeholder='الوصف باللغه العربيه' rows={4} />
									</Form.Item>
								</Form.Item>
								<Form.Item label='الوصف باللغه الإنجليزيه' className="ltr:mr-4 rtl:ml-4 " name="description_en" rules={[{ required: true, message: 'الوصف باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Form.Item >
										<TextArea defaultValue={settings?.description_en} placeholder='الوصف باللغه الإنجليزيه' rows={4} />
									</Form.Item>
								</Form.Item>
								<Form.Item label="رقم الهاتف" name="phone" rules={[{ required: true, message: "رقم الهاتف مطلوب" }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="رقم الهاتف" />
								</Form.Item>
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="حقوق الملكيه بالعربيه" name="copyright_ar" rules={[{ required: true, message: 'حقوق الملكيه باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
									<Input placeholder='حقوق الملكيه باللغه العربيه' />
								</Form.Item>
								<Form.Item label="حقوق الملكيه بالإنجليزيه" className="ltr:mr-4 rtl:ml-4" name="copyright_en" rules={[{ required: true, message: 'حقوق الملكيه باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
									<Input placeholder='حقوق الملكيه باللغه الإنجليزيه' />
								</Form.Item>
								{/* <Form.Item label="عدد المشاهدات" className="" name="total_views" rules={[{ required: true, message: "برجاء إدخال  عدد المشاهدات " }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
													<Input type='number' placeholder="عدد المشاهدات" />
												</Form.Item> */}
							</Form.Item>
							<div className="divider">
								<h1 className="mb-1 text-lg font-bold text-center text-[#0f6fbd]">
									وسائل التواصل
								</h1>
								<div className="w-full h-[1px] bg-gray-500"></div>
							</div>
							<Form.Item className='mt-4 mb-0'  >
								<Form.Item label="يوتيوب" name="youtube" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="يوتيوب" />
								</Form.Item>
								<Form.Item label="فيسبوك" className="ltr:mr-4 rtl:ml-4 " name="facebook" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="فيسبوك" />
								</Form.Item>
								<Form.Item label="تويتر" name="twitter" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="تويتر" />
								</Form.Item>
							</Form.Item>
							<Form.Item className='mt-4 mb-0'  >
								<Form.Item label="واتساب" name="whatsapp" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="واتساب" />
								</Form.Item>
								<Form.Item label="سناب شات" className="ltr:mr-4 rtl:ml-4 " name="snapchat" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="سناب شات" />
								</Form.Item>
								<Form.Item label="انستجرام" name="instagram" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="انستجرام" />
								</Form.Item>
							</Form.Item>
							<Form.Item style={{ width: "100%", marginBottom: "20px" }} >

								<Form.Item label="رابط الخريطه" name="location_link" className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="رابط الخريطه" />
								</Form.Item>
								<Form.Item label="سعر العروض للظهور في الصفحه الرئيسيه" name="price_for_main_page_offers" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input type='number' placeholder="سعر العروض للظهور في الصفحه الرئيسيه" />
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

export default Settings;
