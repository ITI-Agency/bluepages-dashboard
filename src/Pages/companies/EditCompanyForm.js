import { Button, Form, Select, Switch } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import { Input, Skeleton, Space, Tabs, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";
import CompaniesServices from "../../Services/CompaniesServices";
import CountriesServices from "../../Services/CountriesServices";
import UserServices from "../../Services/UserServices";
import CategoriesServices from "../../Services/CategoriesServices";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import SubscriptionPlanPackagesServices from "Services/SubscriptionPlanPackagesServices";
import { toast } from "react-toastify";
import Util from "../../Utils";
import CitiesServices from 'Services/CitiesServices';
const plans = Util.plans;
const { Option } = Select;
import useLoading from "Hooks/useLoading";
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImgCrop from "antd-img-crop";

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
const formImagesLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 16 },
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
const EditCompanyForm = ({ company, id }) => {
	console.log({ company });
	const navigate = useNavigate();
	const [bannerFile, setBannerFile] = useState([]);
	const [logoFile, setLogoFile] = useState([]);
	const [images, setImages] = useState([]);
	const { setLoading } = useLoading();
	const [dataLoaded, setDataLoaded] = useState(false);
	const [countries, setCountries] = useState([]);
	const [cities, setCities] = useState([]);
	const [categories, setCategories] = useState([]);
	const [users, setUsers] = useState(null);
	const [subscriptionPlanPackages, setSubscriptionPlanPackages] = useState(null);
	// const [verified, setVerified] = useState(company?.verified);
	const [descriptionar, setDescriptionar] = useState(company?.description_ar);
	const [descriptionen, setDescriptionen] = useState(company?.description_en);
	const [form] = Form.useForm();
	const [imagesForm] = Form.useForm();

	const onReset = () => {
		form.resetFields();
	};
	useEffect(() => {
		getFieldsData();
		if (company?.banner) {
			
			setBannerFile([{
				uid: '-1',
				url: company?.banner,
			}])
		}
		if (company?.logo) {
			setLogoFile([{
				uid: '-1',
				url: company?.logo,
			}])
		}

	}, []);
	const getCountryCities = async (id) => {
		const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(id);
		if (citiesStatus == 200) {
			setCities(citiesData);
		}
	};
	const getPlanPackages = async (id) => {
		const { status: subscriptionPlanPackageStatus, data: subscriptionPlanPackagesData } = await SubscriptionPlanPackagesServices.getAllSubscriptionPlanPackages([{ planId: id }]);

		if (subscriptionPlanPackageStatus == 200) {
			setSubscriptionPlanPackages(subscriptionPlanPackagesData);
		}
	};
	const getFieldsData = async () => {
		const { status: countriesStatus, data: countriesData } =
			await CountriesServices.getAllCountries([{ city: true }]);
		// const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(1);
		const { status: usersStatus, data: usersData } = await UserServices.getAllUsers();
		const { status: categoriesStatus, data: categoriesData } =
			await CategoriesServices.getAllCategories();
		// const { status: citiesStatus, data: citiesData } = await CitiesServices.getAllCities();
		const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(company.countryId);
		const { status: subscriptionPlanPackageStatus, data: subscriptionPlanPackagesData } = await SubscriptionPlanPackagesServices.getAllSubscriptionPlanPackages([{ planId: company.subscriptionPlanId }]);

		console.log("this is data:>", {
			// citiesData,
			countriesData,
			citiesData,
			usersData,
			categoriesData,
		});
		if (
			countriesStatus == 200 &&
			citiesStatus == 200 &&
			usersStatus == 200 &&
			categoriesStatus == 200 &&
			subscriptionPlanPackageStatus == 200
		) {
			setCountries(countriesData);
			setCities(citiesData);
			setUsers(usersData);
			setCategories(categoriesData);
			setSubscriptionPlanPackages(subscriptionPlanPackagesData);
			setDataLoaded(true);
			
			return;
		}
	};
	const mutation = useMutation(data => {
		console.log({ data });

		console.log({ countrySelected: countries.find(co => co.id == data.countryId)?.cities?.map(c => c.id) });
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
		// data.categories = [data.categories]
		let formData = new FormData();
		// upload categories
		data.categories.forEach(cat => {
			formData.append("categories[]", cat);
		});

		delete data.categories;
		for (const [key, value] of Object.entries(data)) {
			formData.append(key, value);
		}
		// upload images
		formData.append("description_en", descriptionen);
		formData.append("description_ar", descriptionar);

		console.log('logo',logoFile)
		console.log(bannerFile)
		if (logoFile?.length) {
			formData.append("logoFile", logoFile[0].originFileObj);
		}
		if (bannerFile?.length) {
			formData.append("bannerFile", bannerFile[0].originFileObj);
		}
		setLoading(true);
		return CompaniesServices.updateCompany(formData, company.id);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
			setLoading(false);

		},
		onSuccess: () => {
			// Boom baby!
			toast.success('لقد تم تعديل الصفحه بنجاح');
			setLoading(false);
			navigate(`/companies`);
		},
	});
	const addImages = useMutation(() => {
		// data.categories = [data.categories]
		let formData = new FormData();
		// upload images
		if (images?.fileList && images?.fileList?.length) {
			images.fileList.forEach(el => {
				formData.append("images[]", el.originFileObj
				);
			});
		} else {
			toast.error("برجاء إضافه صور أولا");
		}
		return CompaniesServices.addCompanyImages(company.id, formData);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
		},
		onSuccess: () => {
			// Boom baby!
			toast.success('لقد تم إضافه الصور بنجاح  ');
			navigate(`/companies`);
			// Router.push('/login')
		},
	});
	const removeImages = useMutation((imageId) => {
		console.log({ imageId });
		// data.categories = [data.categories]
		const payload = [imageId];
		const data = {
			data: {
				imageIds: payload
			}
		};
		return CompaniesServices.removeCompanyImages(company.id, data);
	}, {
		onError: (error) => {
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
		},
		onSuccess: () => {
			toast.success('لقد تم الحذف بنجاح');
			window.location.reload(false);
			// Boom baby!
			// notify('لقد تم إضافه الصور بنجاح  ', 'success');
			// queryClient.invalidateQueries({ queryKey: ['single-company'] });
			// handleGoBack();
			// Router.push('/login')
		},
	});

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

	if (!dataLoaded || !countries || !categories || !users || !cities || !subscriptionPlanPackages) return <div className="p-8 m-40 mx-auto mt-8 bg-white rounded-md shadow-md md:w-9/12">
		<Skeleton active />
	</div>;
	console.log({ subscriptionPlanPackages });
	const initialValues = {
		name_ar: company.name_ar || "",
		name_en: company.name_en || "",
		email: company.email || "",
		website: company.website || "",
		countryId: company?.countryId || null,
		userId: company?.userId,
		subscriptionPlanId: company?.subscriptionPlanId || null,
		subscriptionPlanPackageId: company?.subscriptionPlanPackageId || null,
		cityId: company?.cityId || null,
		standard_phone: company.standard_phone || "",
		categories: company?.categories?.map(it => it.id) || [],
		// description_ar: company.description_ar || "",
		// description_en: company.description_en || "",
		district_ar: company.district_ar || "",
		district_en: company.district_en || "",
		street_ar: company.street_ar || "",
		street_en: company.street_en || "",
		building_no: company.building_no || "",
		post_code: company.post_code || "",
		hotline: company.hotline || "",
		commercial_reg: company.commercial_reg || "",
		degree: company.degree || "",
		facebook: company.facebook || "",
		twitter: company.twitter || "",
		whatsapp: company.whatsapp || "",
		snapchat: company.snapchat || "",
		instagram: company.instagram || "",
		// longitude: company.longitude || "",
		// latitude: company.latitude || "",
		location_link: company.location_link || "",

	};
	return (
		<div>
			<Form layout="vertical" {...layout} form={form} initialValues={initialValues} name="control-hooks" onFinish={mutation.mutate}>
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
					>
						{({ getFieldValue }) =>
							getFieldValue('subscriptionPlanId') !== 1 && !!getFieldValue('subscriptionPlanId') ? (
								<>
									<Form.Item label="باقه الخطه" name="subscriptionPlanPackageId" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار باقه الإشتراك' }]}>
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
					<Form.Item label='البريد الإلكتروني' name="email" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ type: 'email', required: true, message: 'برجاء إدخال بريد إلكتروني صالح' }]}>
						<Input placeholder='البريد الإلكتروني' />
					</Form.Item>
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }} >
					<Form.Item label='الرابط' name="website" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'الرابط مطلوب' }]}>
						<Input placeholder='الرابط' />
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
						// defaultValue={[company?.countryId]}
						// defaultValue={company?.countryId}
						/>

					</Form.Item>
					<Form.Item label='الغرفه التجاريه' name="cityId" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار غرفه تجاريه' }]}>
						<Select
							placeholder='برجاء إختيار غرفه تجاريه'
							allowClear
						// defaultValue={[company?.cityId]}
						>
							{cities?.map((ci) => (<Option key={ci?.id} value={ci?.id}>{ci[`name_ar`]}</Option>))}
						</Select>
					</Form.Item>
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }} >
					<Form.Item label='رقم الهاتف الرئيسي' className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} name="standard_phone" rules={[{ required: true, message: 'رقم الهاتف مطلوب' }]}>
						<Input placeholder='رقم الهاتف الرئيسي' />
					</Form.Item>

					<Form.Item label='الأنشطه' style={{ display: 'inline-block', width: 'calc(66% - 8px)' }} name="categories" rules={[{ required: true, message: 'برجاء إختيار الأنشطه' }]}>
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
							// defaultValue={company?.categories?.map(it => it.id)}
							// onChange={handleChange}
							options={categories.map((cat) => ({ label: cat[`name_ar`], value: cat.id }))}
						/>
					</Form.Item>
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }} >
					<Form.Item label='الوصف باللغه العربيه'  className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
						<Form.Item l>
							{/* <TextArea defaultValue={company?.description_ar} placeholder='الوصف باللغه العربيه' rows={4} /> */}
							<ReactQuill rows={5} theme="snow" value={descriptionar} onChange={setDescriptionar} />

						</Form.Item>
					</Form.Item>
					<Form.Item label='الوصف باللغه الإنجليزيه' className=""  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
						<Form.Item l>
							{/* <TextArea defaultValue={company?.description_en} placeholder='الوصف باللغه الإنجليزيه' rows={4} /> */}
							<ReactQuill rows={5} theme="snow" value={descriptionen} onChange={setDescriptionen} />

						</Form.Item>
					</Form.Item>

				</Form.Item>
				<div className="divider">
					<h1 className="mb-1 text-lg font-bold text-center text-[#0f6fbd]">
						Images
					</h1>
					<div className="w-full h-[1px] bg-gray-500"></div>
				</div>
				<Form.Item className='mt-4 mb-0' >
					{/* <Form.Item label="اللوجو " style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="banner">
						<Upload onChange={({ fileList }) => { setLogoFile({ fileList }); }}
							beforeUpload={() => false}>
							<Button icon={<UploadOutlined />}>إضغط لإضافه لوجو</Button>
						</Upload>

					
					</Form.Item> */}
					<Form.Item label="اللوجو " style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="banner">
						{/* <ImgCrop rotate> */}
						<Upload onChange={({ fileList: newFileList }) => { setLogoFile(newFileList); }}
							beforeUpload={() => false}
							fileList={logoFile}
							listType="picture-card">
							{logoFile.length < 1 &&
								<div className='block' >

									<PlusOutlined />
									<div style={{ marginTop: 8 }}>Upload</div>
								</div>
							}

						</Upload>
						{/* </ImgCrop> */}
					</Form.Item>
					<Form.Item label="بنر الشركه" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="logo">
						<ImgCrop grid aspect={4.47} rotate>
						<Upload
										// beforeUpload={() => false}
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
						{/* </ImgCrop> */}
						{/* {bannerFile?.length ? <img alt="" src={bannerFile[0]?.thumbUrl} className="rounded-full aspect-square object-contain	p-2 w-[7.5rem] h-[7.5rem] inline-block" /> : ""} */}
						{/* {
							company?.banner &&
							<img
								width={200}
								height={30}
								src={company?.banner}
								alt=""
							/>
						} */}
					</Form.Item>
				</Form.Item>
				{/* <Form.Item label="صور الشركه" valuePropName="images" style={{ marginBottom: 0 }}>
						<Upload multiple={true} onChange={({ fileList }) => { setImages({ fileList }); }}
							beforeUpload={() => false} action="/upload.do" listType="picture-card">
							<div className='block' >
								<PlusOutlined />
								<div style={{ marginTop: 8 }}>Upload</div>
							</div>
						</Upload>
					</Form.Item> */}
				<div className="divider">
					<h1 className="mb-1 text-lg font-bold text-center text-[#0f6fbd]">
						address
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
					<Form.Item label='الحي باللغه العربيه' name="street_ar" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder='الحي باللغه العربيه' />
					</Form.Item>

				</Form.Item>
				<Form.Item className='mb-0'  >
					<Form.Item label='الحي باللغه الإنجليزيه' className="ltr:mr-4 rtl:ml-4 " name="street_en" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder='الحي باللغه الإنجليزيه' />
					</Form.Item>
					<Form.Item label="رقم المبني" name="building_no" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder="رقم المبني" />
					</Form.Item>

					<Form.Item label="الرمز البريدي" name="post_code" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder="الرمز البريدي" />
					</Form.Item>

				</Form.Item>
				<Form.Item   >
					<Form.Item label="الخط الساخن" className="ltr:mr-4 rtl:ml-4 " name="hotline" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder="الخط الساخن" />
					</Form.Item>
					<Form.Item label="رقم السجل" name="commercial_reg" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder="رقم السجل" />
					</Form.Item>

					{/* <Form.Item name="post_code" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
							<Input placeholder="الرمز البريدي" />
						</Form.Item> */}

				</Form.Item>
				<div className="divider">
					<h1 className="mb-1 text-lg font-bold text-center text-[#0f6fbd]">
						social_media
					</h1>
					<div className="w-full h-[1px] bg-gray-500"></div>
				</div>
				<Form.Item className='mt-4 mb-0'  >
					<Form.Item label="الدرجه" name="degree" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder="الدرجه" />
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
				<div className="my-4 divider">
					<h1 className="mb-4 text-lg font-bold text-center text-[#0f6fbd] ">
						extra
					</h1>
					<div className="w-full h-[1px] bg-gray-500"></div>
				</div>
				<Form.Item style={{ width: "100%", marginBottom: "20px" }} >
					{/* <Form.Item label="موثق" name="verified" className=" ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Switch defaultChecked={verified} className={`${verified ? "bg-blue-500" : "bg-gray-200"} shadow-lg `} onChange={() => setVerified(!verified)} />
					</Form.Item> */}
					<Form.Item label="رابط الخريطه" name="location_link" className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder="رابط الخريطه" />
					</Form.Item>
					{/* <Form.Item label="خط العرض Latitude" name="latitude" className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder="خط العرض Latitude" />
					</Form.Item>
					<Form.Item label="خط الطول Longitude" name="longitude" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
						<Input placeholder="خط الطول Longitude" />
					</Form.Item> */}

				</Form.Item>


				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit" className='mx-2 bg-blue-500 rtl:pt-2'>
						submit
					</Button>
					<Button htmlType="button" onClick={onReset} className='mx-2 rtl:pt-2 '>
						reset
					</Button>

				</Form.Item>
			</Form>
			<div className="my-4 divider ">
				<h1 className="text-2xl font-bold text-center text-blueLight">
					Edit Company Images
				</h1>
				<div className="w-full h-[1px] bg-gray-400"></div>
			</div>
			<Form {...formImagesLayout} form={imagesForm} name="form-images" onFinish={addImages.mutate} >
				<Form.Item label="إضافه صور الشركه" valuePropName="images" style={{ distplay: "inline-block", marginBottom: 0 }}>
					<Upload multiple={true} onChange={({ fileList }) => { setImages({ fileList }); }}
						beforeUpload={() => false} action="/upload.do" listType="picture-card">
						<div className='block' >
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</div>
					</Upload>
				</Form.Item>
				<Form.Item style={{ distplay: "inline-block", marginBottom: 0 }}>
					<Button type="primary" htmlType="submit" className='mx-2 bg-blue-500 rtl:pt-2'>
						إضافه صور
					</Button>
				</Form.Item>
			</Form>
			<section className="overflow-hidden text-gray-700 ">
				<div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
					<div className="flex flex-wrap -m-1 md:-m-2">
						{company.images.map((img, i) => (
							<div key={i} className="flex flex-wrap w-1/3">
								<div className="flex flex-col w-full p-1 mx-4 md:p-2">
									<img width={150} height={150} alt="gallery" className="block object-cover object-center w-full h-full rounded-lg "
										src={img.image}></img>
									<div onClick={() => removeImages.mutate(img.id)} className="mt-2 text-center text-white bg-red-500 cursor-pointer hover:bg-red-400 btn"> <p className="text-center">حذف</p></div>


								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default EditCompanyForm;