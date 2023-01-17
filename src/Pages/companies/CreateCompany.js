// components
import React, { useState, useEffect } from "react";
import CompanyFormAntd from "components/PostForms/CompanyFormAntd";
import CompanyForm from "components/PostForms/CompanyForm";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";

// hooks
import useLoading from "Hooks/useLoading";

// services & utlities
import CompaniesServices from "../../Services/CompaniesServices";
import CountriesServices from "../../Services/CountriesServices";
import UserServices from "../../Services/UserServices";
import CategoriesServices from "../../Services/CategoriesServices";

import { useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { Button, Form, Select, Switch } from 'antd';
import { Input, Space, Upload } from 'antd';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
const { Option } = Select;
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import ImgCrop from "antd-img-crop";
import SubscriptionPlanPackagesServices from "Services/SubscriptionPlanPackagesServices";
import { toast } from "react-toastify";
import Util from "../../Utils";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { abs } from "stylis";
const plans = Util.plans;
const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 0 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 24 },
	},
};
const formItemLayoutWithOutLabel = {
	wrapperCol: {
		xs: { span: 24, offset: 0 },
		sm: { span: 24 },
	},
};
const getSrcFromFile = (file) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(file.originFileObj);
		reader.onload = () => resolve(reader.result);
	});
};
function CreateCompany() {

	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [dataLoaded, setDataLoaded] = useState(false);
	const [bannerFile, setBannerFile] = useState([]);
	const [logoFile, setLogoFile] = useState([]);
	const [images, setImages] = useState([]);
	const [countries, setCountries] = useState([]);
	const [cities, setCities] = useState([]);
	const [categories, setCategories] = useState([]);
	const [users, setUsers] = useState([]);
	const [subscriptionPlanPackages, setSubscriptionPlanPackages] = useState([]);
	const [descriptionar, setDescriptionar] = useState("");
	const [descriptionen, setDescriptionen] = useState("");

	const [verified, setVerified] = useState(false);
	const [stay, setStay] = useState(false);
	const postCompany = async (companyData) => {
		setLoading(true);
		const res = await CompaniesServices.createCompany(companyData);
		console.log("thsi is the response of posting company:>", res);
		if (res.status == 201) {
			setLoading(false);
			navigate(`/companies/${res.data?.id ? res.data.id : ""}`);
		} else {
			setLoading(false);
			console.log("there is an error:>", res);
		}
	};

	useEffect(() => {
		getFieldsData();
	}, []);
	const getCountryCities = async (id) => {
		const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(id);
		if (citiesStatus == 200) {
			setCities(citiesData);
		}
	};
	const getPlanPackages = async (id) => {
		if (id !== 1) {

			const { status: subscriptionPlanPackageStatus, data: subscriptionPlanPackagesData } = await SubscriptionPlanPackagesServices.getAllSubscriptionPlanPackages([{ planId: id }]);

			if (subscriptionPlanPackageStatus == 200) {
				setSubscriptionPlanPackages(subscriptionPlanPackagesData);
			}
		}
	};
	const getFieldsData = async () => {
		const { status: countriesStatus, data: countriesData } =
			await CountriesServices.getAllCountries([{ city: true }]);
		// const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(1);
		const { status: usersStatus, data: usersData } = await UserServices.getAllUsers();
		const { status: categoriesStatus, data: categoriesData } =
			await CategoriesServices.getAllCategories();

		console.log("this is data:>", {
			countriesData,
			// citiesData,
			usersData,
			categoriesData,
		});
		if (
			countriesStatus == 200 &&
			// citiesStatus == 200 &&
			usersStatus == 200 &&
			categoriesStatus == 200
		) {
			setCountries(countriesData);
			// setCities(citiesData);
			setUsers(usersData);
			setCategories(categoriesData);
			setDataLoaded(true);
			return;
		}
	};
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};
	const onPreview = async (file) => {
		const src = file.url || (await getSrcFromFile(file));
		const imgWindow = window.open(src);

		if (imgWindow) {
			const image = new Image();
			image.src = src;
			imgWindow.document.write(image.outerHTML);
		} else {
			window.location.href = src;
		}
	};
	const onPreviewLogo = async (file) => {
		const src = file.url || (await getSrcFromFile(file));
		const imgWindow = window.open(src);

		if (imgWindow) {
			const image = new Image();
			image.src = src;
			imgWindow.document.write(image.outerHTML);
		} else {
			window.location.href = src;
		}
	};
	// const [cities, setCities] = useState([]);

	// const { data: countries = [], isLoading: isLoadingCountries } = useQuery(['countries'], CountriesServices.getAllCountries);
	// const { data: categoriesList = [], isLoading: isLoadingCategories } = useQuery(['categories'], CategoriesServices.getAllCategories);
	const mutation = useMutation(data => {
		console.log({ data });
		if (!countries.find(co => co.id == data.countryId)?.cities?.map(c => c.id)?.includes(data.cityId)) {
			toast.error('الرجاء إختيار مدينه تابعه للدوله');
			return;
		}
		if (data?.subscriptionPlanPackageId) {
			if (subscriptionPlanPackages.find(co => co.id == data.subscriptionPlanPackageId)?.subscriptionPlanId !== data.subscriptionPlanId) {
				toast.error('الرجاء إختيار باقه تابعه لخطه الإشتراك');
				return;
			}
		}
		console.log({ companyDataSUbmit: data });
		// data.categories = [data.categories]
		let formData = new FormData();
		// upload categories
		data.categories.forEach(cat => {
			formData.append("categories[]", cat);
		});
		// phones 
		data?.phones?.forEach(ph => {
			formData.append("phones[]", ph);
		});
		// videos 
		data?.videos?.forEach(vid => {
			formData.append("videos[]", vid);
		});
		// branches 
		data?.branches?.forEach((br, i) => {
			formData.append(`branches[${i}][name_ar]`, br?.name_ar);
			formData.append(`branches[${i}][name_en]`, br?.name_en);
			formData.append(`branches[${i}][address_ar]`, br?.address_ar);
			formData.append(`branches[${i}][address_en]`, br?.address_en);
			formData.append(`branches[${i}][description_en]`, br?.description_en || "");
			formData.append(`branches[${i}][description_ar]`, br?.description_ar || "");
			formData.append(`branches[${i}][phone]`, br?.phone || "");
			formData.append(`branches[${i}][link]`, br?.link || "");
		});
		delete data.categories;
		delete data.phones;
		delete data.videos;
		delete data.branches;

		for (const [key, value] of Object.entries(data)) {
			if (key === 'verified') {
				formData.append(key, value ? "true" : "false");
			} else {
				formData.append(key, value && value !=
					"undefined" ? value : "");
			}
		}
		formData.append("description_en", descriptionen);
		formData.append("description_ar", descriptionar);


		if (logoFile?.length) {
			formData.append("logoFile", logoFile[0].originFileObj);
		}
		if (bannerFile?.length) {
			formData.append("bannerFile", bannerFile[0].originFileObj);
		}
		// upload images
		if (images?.fileList && images?.fileList?.length) {
			images.fileList.forEach(el => {
				formData.append("images[]", el.originFileObj
				);
			});
		}
		console.log({ stay });
		if (!stay) {
			setLoading(true);
		}
		return CompaniesServices.createCompany(formData);

	}, {
		onError: (error) => {
			console.log({ error });
			setLoading(false);
			toast.error("لقد حدث خطأ ما");

			console.log("there is an error:>", error);
			setStay(false);

			// notify('لقد حدث خطأ ما برجاء التأكد من بياناتك', 'error');
		},
		onSuccess: (res) => {
			console.log("success response", res);
			if (res) {
				toast.success('لقد تم إضافه الصفحه بنجاح');
			}
			setLoading(false);
			setStay(false);
			if (!stay) {
				navigate(`/companies`);
			}
			// Boom baby!
			// if (!res) return;
			// notify('لقد تم إنشاء الصفحه بنجاح', 'success');
			// queryClient.invalidateQueries({ queryKey: ['user-companies'] });
			// handleGoBack();
			// Router.push('/login')
		},
	});
	const submitAndStay = () => {
		form.validateFields()
			.then((values) => {
				setStay(true);
				setTimeout(() => {
					mutation.mutate(values);
				}, 500);
				// Submit values
				// submitValues(values);
			})
			.catch((errorInfo) => {
				setStay(false);

			});
	};
	const handleCountryChange = async (value) => {
		// form.setFieldsValue({ countryId: value });
		const filteredCities = await getCities(value);
		setCities(() => filteredCities);
	};

	if (!dataLoaded) return <LoadingDataLoader />;

	return (
		<DashboardLayout>
			<h1>إنشاء صفحه</h1>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
					<Form layout='vertical' {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
						<Form.Item style={{ marginBottom: 0 }} >
							<Form.Item label='إسم المستخدم' name="userId" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار إسم المستخدم' }]}>
								<Select
									showSearch
									optionFilterProp="children"
									filterOption={(input, option) =>
										(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
									}
									options={users?.sort(function (a, b) {
										if (a.role < b.role) {
											return -1;
										}
										if (a.role > b.role) {
											return 1;
										}
										return 0;
									})?.map((co) => ({ label: co.name, value: co.id }))}
									placeholder='برجاء إختيار إسم المستخدم'
									allowClear
								/>
							</Form.Item>

							<Form.Item label='خطه الإشتراك للصفحات' name="subscriptionPlanId" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار خطه الإشتراك' }]}>
								<Select
									placeholder='برجاء إختيار خطه الإشتراك'
									allowClear
									onChange={getPlanPackages}

								>
									{plans?.map((p) => (<Option key={p.package_id} value={p.package_id}>{p[`name_ar`]}</Option>))}
								</Select>
							</Form.Item>
							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) => prevValues.subscriptionPlanId !== currentValues.subscriptionPlanId}
								onChange={() => setStay(false)}

							>
								{({ getFieldValue }) =>
									getFieldValue('subscriptionPlanId') !== 1 && !!getFieldValue('subscriptionPlanId') ? (
										<>
											<Form.Item label="باقه الخطه" name="subscriptionPlanPackageId" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}
												rules={[{ required: true, message: 'برجاء إختيار باقه الإشتراك' }]}
											>
												<Select
													placeholder='برجاء إختيار الباقه '
													allowClear
												>
													{subscriptionPlanPackages?.map((p) => (<Option key={p.id} value={p.id}>{p.title_ar}</Option>))}
												</Select>
											</Form.Item>
										</>
									) : null
								}
							</Form.Item>

						</Form.Item>
						<Form.Item style={{ marginBottom: 0 }} >
							<Form.Item label='الإسم باللغه العربيه' name="name_ar" rules={[{ required: true, message: 'الإسم باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder='الإسم باللغه العربيه' />
							</Form.Item>
							<Form.Item label='الإسم باللغه الإنجليزيه' className="ltr:mr-4 rtl:ml-4" name="name_en" rules={[{ required: true, message: 'الإسم باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder='الإسم باللغه الإنجليزيه' />
							</Form.Item>
							<Form.Item label='البريد الإلكتروني' name="email" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} >
								<Input placeholder='البريد الإلكتروني' />
							</Form.Item>
						</Form.Item>
						<Form.Item style={{ marginBottom: 0 }} >
							<Form.Item label='الموقع الإلكتروني' name="website" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} >
								<Input placeholder='الموقع الإلكتروني' />
							</Form.Item>
							<Form.Item label='الدوله' name="countryId" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار دوله' }]}>
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
							<Form.Item label='الغرفه التجاريه' name="cityId" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار غرفه تجاريه' }]}>
								<Select
									placeholder='برجاء إختيار غرفه تجاريه'
									allowClear
								>
									{cities?.map((ci) => (<Option key={ci.id} value={ci.id}>{ci[`name_ar`]}</Option>))}
								</Select>
							</Form.Item>
						</Form.Item>
						<Form.Item style={{ marginBottom: 0 }} >

							<Form.Item label='الأنشطه' style={{ display: 'inline-block', width: 'calc(66% - 8px)' }} name="categories" className="ltr:mr-4 rtl:ml-4 " rules={[{ required: true, message: 'برجاء إختيار الأنشطه' }]}>
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
									options={categories.map((cat) => ({ label: cat[`name_ar`], value: cat.id }))}
								/>
							</Form.Item>
							<Form.Item label="الدرجه" name="degree" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="الدرجه" />
							</Form.Item>
						</Form.Item>
						<Form.Item   >
							<Form.Item label="رقم السجل" name="commercial_reg" className=" ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="رقم السجل" />
							</Form.Item>

							<Form.Item label="رابط الخريطه" name="location_link" className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="رابط الخريطه" />
							</Form.Item>
							<Form.Item label="موثق" name="verified" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Switch defaultChecked={verified} className={`${verified ? "bg-blue-500" : "bg-gray-200"} shadow-lg `} onChange={() => setVerified(!verified)} />
							</Form.Item>
							{/* <Form.Item name="post_code" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
							<Input placeholder="الرمز البريدي" />
						</Form.Item> */}
						</Form.Item>
						<Form.Item style={{ marginBottom: 0 }} >
							<Form.Item label='الوصف باللغه العربيه' className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
								<Form.Item >
									<ReactQuill rows={5} theme="snow" value={descriptionar} onChange={setDescriptionar} />

									{/* <TextArea placeholder='الوصف باللغه العربيه' rows={4} /> */}
								</Form.Item>
							</Form.Item>
							<Form.Item label='الوصف باللغه الإنجليزيه' className="" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
								<Form.Item >
									{/* <TextArea placeholder='الوصف باللغه الإنجليزيه' rows={4} /> */}
									<ReactQuill rows={5} theme="snow" value={descriptionen} onChange={setDescriptionen} />
								</Form.Item>
							</Form.Item>

						</Form.Item>
						<div className="divider">
							<h1 className="mb-1 text-lg font-bold text-center text-[#0f6fbd]">
								استوديو الصور والفيديو
							</h1>
							<div className="w-full h-[1px] bg-gray-500"></div>
						</div>
						<Form.Item className='mt-4 mb-0' >
							<Form.Item label="اللوجو " style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="banner">
								<ImgCrop grid aspect={1.2} rotate>
									<Upload onChange={({ fileList: newFileList }) => { setLogoFile(newFileList); }}
										// beforeUpload={() => false}
										listType="picture-card"
										fileList={logoFile}
										onPreview={onPreviewLogo}

									>
										{logoFile.length < 1 &&
											<div className='block' >

												<PlusOutlined />
												<div style={{ marginTop: 8 }}>Upload</div>
											</div>
										}

									</Upload>
								</ImgCrop>
							</Form.Item>
							{/* <Form.Item label="عرض لوجو الشركه" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} >
								{logoFile?.length ? <img alt="" src={logoFile[0]?.thumbUrl} className="rounded-full aspect-square object-contain	p-2 w-[7.5rem] h-[7.5rem] inline-block" /> : ""}
							</Form.Item> */}
							<Form.Item label="بنر الشركه" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="logo">
								<ImgCrop grid aspect={4.47} rotate>
									<Upload
										// beforeUpload={() => false}
										// action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
										onChange={({ fileList }) => {
											setBannerFile(fileList);
										}}
										fileList={bannerFile}
										listType="picture-card"
										onPreview={onPreview}
									>
										{bannerFile.length < 1 &&
											<div className='block' >
												<PlusOutlined />
												<div style={{ marginTop: 8 }}>Upload</div>
											</div>
										}
									</Upload>
								</ImgCrop>
							</Form.Item>
						</Form.Item>
						<Form.Item className='mt-4 mb-0' >
							<Form.Item label="صور الشركه" valuePropName="images" style={{ marginBottom: 0 }}>
								<Upload multiple={true} onChange={({ fileList }) => { setImages({ fileList }); }}
									beforeUpload={() => false} action="/upload.do" listType="picture-card">
									<div className='block' >
										<PlusOutlined />
										<div style={{ marginTop: 8 }}>Upload</div>
									</div>
								</Upload>
							</Form.Item>
							<Form.Item className="mt-8" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>

								<Form.List
									name="videos"
									style={{ width: '100%' }}

								// rules={[
								//   {
								//     validator: async (_, names) => {
								//       if (!names || names.length < 2) {
								//         return Promise.reject(new Error('At least 2 passengers'));
								//       }
								//     },
								//   },
								// ]}
								>
									{(fields, { add, remove }, { errors }) => (
										<>
											{fields?.map((field, index) => (
												<Form.Item
													{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
													// label={index === 0 ? 'Passengers' : ''}
													required={false}
													key={field.key}
												// style={{ width: '80%' }}
												>
													<Form.Item
														{...field}
														validateTrigger={['onChange', 'onBlur']}
														rules={[
															{
																required: true,
																whitespace: true,
																message: "برجاء أضف اللينك أو قم بإلغاء هذا الحقل",
															},
														]}
														noStyle
													>
														<Input placeholder="أضف لينك يوتيوب" style={{ width: '80%' }} />
													</Form.Item>
													{/* {fields.length > 1 ? ( */}
													<MinusCircleOutlined
														className="dynamic-delete-button ltr:ml-1 rtl:mr-1"
														onClick={() => remove(field.name)}
													/>
													{/* ) : null} */}
												</Form.Item>
											))}
											<Form.Item>
												<Button
													type="dashed"
													onClick={() => add()}
													style={{ width: "100%" }}
													icon={<PlusOutlined />}
												>
													أضف لينكات اليوتيوب
												</Button>
												{/* <Button
                type="dashed"
                onClick={() => {
                  add('The head item', 0);
                }}
                style={{ width: '60%', marginTop: '20px' }}
                icon={<PlusOutlined />}
              >
                Add field at head
              </Button> */}
												<Form.ErrorList errors={errors} />
											</Form.Item>
										</>
									)}
								</Form.List>
							</Form.Item>
							{/* <Form.Item label="عرض بانر الشركه" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} >
								{bannerFile?.length ? <img alt="" src={bannerFile[0]?.thumbUrl} className="rounded-full aspect-square object-contain	p-2 w-[7.5rem] h-[7.5rem] inline-block" /> : ""}
							</Form.Item> */}
						</Form.Item>

						<div className="divider">
							<h1 className="mb-1 text-lg font-bold text-center text-[#0f6fbd]">
								العنوان
							</h1>
							<div className="w-full h-[1px] bg-gray-500"></div>
						</div>
						<Form.Item className='mt-4 mb-0'  >
							<Form.Item label='المنطقه باللغه العربيه' name="district_ar" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder='المنطقه باللغه العربيه' />
							</Form.Item>
							<Form.Item label='المنطقه باللغه الإنجليزيه' className="ltr:mr-4 rtl:ml-4 " name="district_en" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder='المنطقه باللغه الإنجليزيه' />
							</Form.Item>
							<Form.Item label='الشارع باللغه العربيه' name="street_ar" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder='الشارع باللغه العربيه' />
							</Form.Item>
						</Form.Item>
						<Form.Item className='mb-0'  >
							<Form.Item label='الشارع باللغه الإنجليزيه' className="ltr:mr-4 rtl:ml-4 " name="street_en" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder='الشارع باللغه الإنجليزيه' />
							</Form.Item>
							<Form.Item label="رقم المبني" name="building_no" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="رقم المبني" />
							</Form.Item>

							<Form.Item label="الرمز البريدي" name="post_code" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="الرمز البريدي" />
							</Form.Item>

						</Form.Item>
		

						<div className="divider">
							<h1 className="mb-1 text-lg font-bold text-center text-[#0f6fbd]">
								وسائل التواصل
							</h1>
							<div className="w-full h-[1px] bg-gray-500"></div>
						</div>
						<Form.Item className='mt-4 mb-0'  >

							<Form.Item label="فيسبوك" className="ltr:mr-4 rtl:ml-4 " name="facebook" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="فيسبوك" />
							</Form.Item>
							<Form.Item label="تويتر"  className="ltr:mr-4 rtl:ml-4 " name="twitter" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="تويتر" />
							</Form.Item>
							<Form.Item label="انستجرام" name="instagram" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="انستجرام" />
							</Form.Item>
						</Form.Item>
						<Form.Item className='mt-4 mb-0'  >
							<Form.Item label="واتساب" name="whatsapp" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="واتساب" />
							</Form.Item>
							<Form.Item label="سناب شات" className="ltr:mr-4 rtl:ml-4 " name="snapchat" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="سناب شات" />
							</Form.Item>

						</Form.Item>
						<Form.Item   >
							<Form.Item  label='رقم الهاتف الرئيسي' className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} name="standard_phone">
								<Input placeholder='رقم الهاتف الرئيسي' />
							</Form.Item>
							<Form.Item label="الرقم الموحد" className="ltr:mr-4 rtl:ml-4 " name="hotline" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="الرقم الموحد" />
							</Form.Item>
							<Form.Item className="mt-8" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Form.List
									name="phones"
									style={{ width: '100%' }}
								// rules={[
								//   {
								//     validator: async (_, names) => {
								//       if (!names || names.length < 2) {
								//         return Promise.reject(new Error('At least 2 passengers'));
								//       }
								//     },
								//   },
								// ]}
								>
									{(fields, { add, remove }, { errors }) => (
										<>
											{fields?.map((field, index) => (
												<Form.Item
													{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
													// label={index === 0 ? 'Passengers' : ''}
													required={false}
													key={field.key}
												>
													<Form.Item
														{...field}
														validateTrigger={['onChange', 'onBlur']}
														rules={[
															{
																required: true,
																whitespace: true,
																message: "برجاء أضف رقم الهاتف أو قم بإلغاء هذا الحقل",
															},
														]}
														noStyle
													>
														<Input placeholder="أضف رقم هاتف" style={{ width: '80%' }} />
													</Form.Item>
													{/* {fields.length > 1 ? ( */}
													<MinusCircleOutlined
														className="dynamic-delete-button ltr:ml-1 rtl:mr-1"
														onClick={() => remove(field.name)}
													/>
													{/* ) : null} */}
												</Form.Item>
											))}
											<Form.Item>
												<Button
													type="dashed"
													onClick={() => add()}
													icon={<PlusOutlined />}
													style={{ width: "100%" }}

												>
													أضف أرقام هواتف أخري
												</Button>
												{/* <Button
                type="dashed"
                onClick={() => {
                  add('The head item', 0);
                }}
                style={{ width: '60%', marginTop: '20px' }}
                icon={<PlusOutlined />}
              >
                Add field at head
              </Button> */}
												<Form.ErrorList errors={errors} />
											</Form.Item>
										</>
									)}
								</Form.List>

							</Form.Item>

							{/* <Form.Item name="post_code" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
							<Input placeholder="الرمز البريدي" />
						</Form.Item> */}
						</Form.Item>
						<div className="my-4 divider">
							<h1 className="mb-4 text-lg font-bold text-center text-[#0f6fbd] ">
								الفروع
							</h1>
							<div className="w-full h-[1px] bg-gray-500"></div>
						</div>


						<Form.Item style={{ width: "100%" }} >


							<Form.List name="branches">
								{(fields, { add, remove }) => (
									<>
										{fields?.map(({ key, name, ...restField }) => (
											<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
												<Form.Item
													{...restField}
													name={[name, 'name_ar']}
													rules={[{ required: true, message: 'الإسم مطلوب' }]}
												>
													<Input placeholder="الإسم باللغه العربيه" />
												</Form.Item>
												<Form.Item
													{...restField}
													name={[name, 'name_en']}
													rules={[{ required: true, message: 'الإسم مطلوب' }]}
												>
													<Input placeholder="الإسم باللغه الإنجليزيه" />
												</Form.Item>
												<Form.Item
													{...restField}
													name={[name, 'address_ar']}
													rules={[{ required: true, message: "العنوان مطلوب" }]}
												>
													<Input placeholder="العنوان بالعربيه" />
												</Form.Item>
												<Form.Item
													{...restField}
													name={[name, 'address_en']}
													rules={[{ required: true, message: "العنوان مطلوب" }]}
												>
													<Input placeholder="العنوان بالإنجليزيه" />
												</Form.Item>
												<Form.Item
													{...restField}
													name={[name, 'phone']}
												// rules={[{ required: true, message: "رقم الهاتف" }]}
												>
													<Input placeholder="رقم الهاتف" />
												</Form.Item>
												<Form.Item
													{...restField}
													name={[name, 'link']}
												// rules={[{ required: true, message: "الرابط" }]}
												>
													<Input placeholder="الرابط" />
												</Form.Item>
												<MinusCircleOutlined onClick={() => remove(name)} />
											</Space>
										))}
										<Form.Item>
											<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
												أضف فروع للشركه
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>
						</Form.Item>
						<Form.Item {...tailLayout}>
							<Button type="primary" htmlType="submit" className='mx-2 bg-blue-500 rtl:pt-2'>
								submit
							</Button>
							<Button type="success" onClick={submitAndStay} className='mx-2 text-white bg-green-500 rtl:pt-2' loading={stay}>
								submit and stay
							</Button>
							<Button htmlType="button" onClick={onReset} className='mx-2 rtl:pt-2 '>
								reset
							</Button>

						</Form.Item>
					</Form>
					{/* <CompanyForm
            onSubmit={postCompany}
            users={users}
            cities={cities}
            countries={countries}
            categories={categories}
            onCountryChange={getCountryCities}
          /> */}
				</Paper>
			</Container>
		</DashboardLayout >
	);
}

export default CreateCompany;
