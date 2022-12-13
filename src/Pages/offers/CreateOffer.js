// components
import React, { useState, useEffect } from "react";
import OfferForm from "components/PostForms/OfferForm";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, Switch, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
// hooks
import useLoading from "Hooks/useLoading";

// services & utlities
import CompaniesServices from "Services/CompaniesServices";
import CountriesServices from "Services/CountriesServices";
import UserServices from "Services/UserServices";
import CategoriesServices from "Services/CategoriesServices";
import OffersServices from "Services/OffersServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container } from "@mui/system";
import { Paper } from "@mui/material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const discount = {
	percentage: "نسبه %",
	amount: "كميه ثابته"
};
const { Option } = Select;

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 22 },
};
const getSrcFromFile = (file) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(file.originFileObj);
		reader.onload = () => resolve(reader.result);
	});
};
function CreateOffer() {
	const { setLoading } = useLoading();
	const [logoFile, setLogoFile] = useState([]);

	const navigate = useNavigate();
	const [dataLoaded, setDataLoaded] = useState(false);
	// const [companies, setCompanies] = useState([]);
	const [countries, setCountries] = useState([]);
	const [cities, setCities] = useState([]);
	const [users, setUsers] = useState([]);
	const [categories, setCategories] = useState([]);
	const [saleChecked, setSaleChecked] = useState(false);
	const [mainPagePaid, setMainPagePaid] = useState(false);
	const [paid, setPaid] = useState(false);
	const [images, setImages] = useState([]);
	const [descriptionar, setDescriptionar] = useState("");
	const [descriptionen, setDescriptionen] = useState("");
	const postOffer = async (offerData) => {
		setLoading(true);
		const res = await OffersServices.createOffer(offerData);
		console.log("thsi is the response of posting company:>", res);
		if (res.status == 201) {
			setLoading(false);
			navigate("/offers");
		} else {
			setLoading(false);
			console.log("there is an error:>", res);
		}
	};
	const mutation = useMutation(data => {
		if (!data.companyId) delete data.companyId;
		console.log({ OfferData: data });
		// data.categories = [data.categories]
		let formData = new FormData();
		// upload categories
		data.categories.forEach(cat => {
			formData.append("categories[]", cat);
		});
		// videos 
		data?.videos?.forEach(vid => {
			formData.append("videos[]", vid);
		});
		formData.append("description_en", descriptionen);
		formData.append("description_ar", descriptionar);
		delete data.categories;
		delete data.videos;
		data.on_sale = saleChecked;
		for (const [key, value] of Object.entries(data)) {
			formData.append(key, value);
		}
		if (logoFile?.length) {
			formData.append("logoFile", logoFile[0].originFileObj);
		} else {
			toast.error('الرجاء إضافه صور أولا');
			return;
		}
		// upload images
		if (images?.fileList && images?.fileList?.length) {
			images.fileList.forEach(el => {
				formData.append("images[]", el.originFileObj
				);
			});
			setLoading(true);
			return OffersServices.createOffer(formData);
		} else {
			toast.error("برجاء إضافه صور للعرض");

			return;
		}

	}, {
		onError: (error) => {
			setLoading(false);
			console.log("there is an error:>", res);
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
			setLoading(false);
		},
		onSuccess: (res) => {
			if (res) {
				setLoading(false);
				toast.success('لقد تم إنشاء العرض بنجاح');
				navigate("/offers");
			}
			// if (!res) return;
			// // Boom baby!
			// notify('لقد تم إنشاء الصفحه بنجاح', 'success');
			// handleGoBack();
			// // Router.push('/login')
		},
	});

	const getCountryCities = async (id) => {
		const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(id);
		if (citiesStatus == 200) {
			setCities(citiesData);
		}
	};
	const getUserCompanies = async (id) => {
		const { status: companiesStatus, data: companiesData } =
			await CompaniesServices.getAllCompanies([{ userId: id }]);
		if (companiesStatus == 200) {
			setCompanies(companiesData);
		}
	};
	const onChangeSale = (checked) => {
		setSaleChecked(!saleChecked);
		console.log(`switch sale to ${checked}`);
	};
	const onChangeMainPagePaid = () => {
		setMainPagePaid(!mainPagePaid);
	};
	const onChangePaid = () => {
		setPaid(!paid);
	};
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};
	useEffect(() => {
		getFieldsData();
	}, []);

	const getFieldsData = async () => {
		const { status: countriesStatus, data: countriesData } =
			await CountriesServices.getAllCountries([{ city: true }]);
		const { status: usersStatus, data: usersData } = await UserServices.getAllUsers();
		const { status: categoriesStatus, data: categoriesData } =
			await CategoriesServices.getAllCategories();
		// const { status: companiesStatus, data: companiesData } =
		// await CompaniesServices.getAllCompanies();

		if (
			countriesStatus == 200 &&
			usersStatus == 200 &&
			categoriesStatus == 200
			// companiesStatus == 200
		) {
			setCountries(countriesData);
			setUsers(usersData);
			setCategories(categoriesData);
			// setCompanies(companiesData);
			setDataLoaded(true);
			return;
		}
	};
	if (!dataLoaded) return <LoadingDataLoader />;
	return (
		<DashboardLayout>
			<h1>إنشاء عرض</h1>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
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
								<Form.Item label='إسم المستخدم' name="userId" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار إسم المستخدم' }]}>
									<Select
										showSearch
										optionFilterProp="children"
										filterOption={(input, option) =>
											(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										options={users?.map((co) => ({ label: co.name, value: co.id }))}
										placeholder='برجاء إختيار إسم المستخدم'
										allowClear
										onChange={getUserCompanies}
									/>
								</Form.Item>

								<Form.Item label="الدوله" name="countryId" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار دوله' }]}>
									<Select
										showSearch
										optionFilterProp="children"
										filterOption={(input, option) =>
											(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										options={countries?.map((co) => ({ label: co.name_ar, value: co.id }))}
										placeholder='برجاء إختيار دوله'
										allowClear
										onChange={getCountryCities}
									/>
								</Form.Item>
								<Form.Item label="الغرفه التجاريه" name="cityId" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار غرفه تجاريه' }]}>
									<Select
										placeholder='برجاء إختيار غرفه تجاريه'
										allowClear
									>
										{cities?.map((ci) => (<Option key={ci.id} value={ci.id}>{ci[`name_ar`]}</Option>))}
									</Select>
								</Form.Item>

							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
								{/* <Form.Item label="الشركه" name="companyId" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} >
									<Select
										showSearch
										optionFilterProp="children"
										filterOption={(input, option) =>
											(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										options={companies?.map((co) => ({ label: co.name_ar, value: co.id }))}
										placeholder='برجاء إختيار شركه'
										allowClear
									/>
								</Form.Item> */}
								<Form.Item label="الأنشطه" style={{ display: 'inline-block', width: 'calc(66% - 8px)' }} name="categories" rules={[{ required: true, message: 'برجاء إختيار الأنشطه' }]}>
									<Select
										showSearch
										optionFilterProp="children"
										filterOption={(input, option) =>
											(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										mode="multiple"
										allowClear
										style={{ width: '100%' }}
										placeholder="برجاء إختيار الأنشطه"
										// defaultValue={['a10', 'c12']}
										// onChange={handleChange}
										options={categories.map((cat) => ({ label: cat[`name_ar`], value: cat.id }))}
									/>
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
							<Form.Item className='mt-4 mb-0' >
								<Form.Item label="صوره الغلاف " style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="banner">
									<Upload onChange={({ fileList: newFileList }) => {
										console.log({ image: newFileList[0] });
										setLogoFile(newFileList);
									}}
										beforeUpload={() => false} listType="picture-card">
										<div className='block' >
											<PlusOutlined />
											<div style={{ marginTop: 8 }}>Upload</div>
										</div>
									</Upload>

								</Form.Item>
								<Form.Item label="صور العرض" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="images" >
									<Upload multiple={true} onChange={({ fileList }) => { setImages({ fileList }); }}
										beforeUpload={() => false} action="/upload.do" listType="picture-card">
										<div className='block' >
											<PlusOutlined />
											<div style={{ marginTop: 8 }}>Upload</div>
										</div>
									</Upload>
								</Form.Item>
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >

							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="الوصف بالعربيه"  className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
									{/* <TextArea placeholder='الوصف باللغه العربيه' rows={4} /> */}
									<ReactQuill rows={5} theme="snow" value={descriptionar} onChange={setDescriptionar} />

								</Form.Item>
								<Form.Item label="الوصف بالإنجليزيه" className=""  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
									{/* <TextArea placeholder='الوصف باللغه الإنجليزيه' rows={4} /> */}
									<ReactQuill rows={5} theme="snow" value={descriptionen} onChange={setDescriptionen} />

								</Form.Item>
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="إظهار في الصفحه الرئيسيه" name="main_page_paid" className=" ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} valuePropName="checked">
									<Switch defaultChecked={mainPagePaid} className={`${mainPagePaid ? "bg-blue-500" : "bg-gray-200"} shadow-lg `} onChange={onChangeMainPagePaid} />
								</Form.Item>
								<Form.Item label="عرض مدفوع" name="paid" className=" ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} valuePropName="checked">
									<Switch defaultChecked={paid} className={`${paid ? "bg-blue-500" : "bg-gray-200"} shadow-lg `} onChange={onChangePaid} />
								</Form.Item>
								<Form.Item label="رابط الخريطه" name="location_link" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="رابط الخريطه" />
								</Form.Item>
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="إستعمال خصم" name="on_sale" className=" ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} valuePropName="checked">
									<Switch defaultChecked={saleChecked} className={`${saleChecked ? "bg-blue-500" : "bg-gray-200"} shadow-lg `} onChange={onChangeSale} />
								</Form.Item>
								<Form.Item
									noStyle
									shouldUpdate={(prevValues, currentValues) => prevValues.on_sale !== currentValues.on_sale}
								>
									{({ getFieldValue }) =>
										getFieldValue('on_sale') === true ? (
											<>
												<Form.Item label="نوع الخصم" name="sale_type" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار نوع الخصم' }]}>
													<Select
														placeholder='برجاء إختيار نوع الخصم'
														allowClear
													>
														<Option value='PERCENTAGE'>{discount.percentage}</Option>
														<Option value='AMOUNT'>{discount.amount}</Option>
													</Select>
												</Form.Item>
												<Form.Item label="كميه الخصم (نسبه/كميه)" className="" name="sale_amount" rules={[{ required: true, message: "برجاء إدخال كميه الخصم (نسبه/كميه)" }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
													<Input type='number' placeholder="كميه الخصم (نسبه/كميه)" />
												</Form.Item>
											</>
										) : null
									}
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
				</Paper>
			</Container>

		</DashboardLayout>
	);
}

export default CreateOffer;
		//   <OfferForm
		//     onSubmit={postOffer}
		//     users={users}
		//     cities={cities}
		//     countries={countries}
		//     categories={categories}
		//     companies={companies}
		//     getCountryCities={getCountryCities}
		//   />