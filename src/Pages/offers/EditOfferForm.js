import { DatePicker, Input, Skeleton, Space, Switch, Tabs, Upload } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import { BsBackspaceFill } from 'react-icons/bs';
import { Button, Form, Select } from 'antd';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";

import useLoading from "Hooks/useLoading";

import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import TabPane from 'antd/lib/tabs/TabPane';
import { Content } from 'antd/lib/layout/layout';
import OffersServices from 'Services/OffersServices';
import CountriesServices from "../../Services/CountriesServices";
import UserServices from "../../Services/UserServices";
import CategoriesServices from "../../Services/CategoriesServices";
import CitiesServices from 'Services/CitiesServices';
import { useNavigate } from 'react-router-dom';
import CompaniesServices from 'Services/CompaniesServices';
import { useSearchParams } from 'react-router-dom'

const { Option } = Select;
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import Util from "../../Utils";

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
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
const { formats, modules } = Util;
const EditOfferForm = ({ offer, id, }) => {
	const queryClient = useQueryClient();
	const [dataLoaded, setDataLoaded] = useState(false);
	const [countries, setCountries] = useState([]);
	const [cities, setCities] = useState([]);
	const [categories, setCategories] = useState([]);
	const { setLoading } = useLoading();
	const [descriptionar, setDescriptionar] = useState(offer?.description_ar);
	const [descriptionen, setDescriptionen] = useState(offer?.description_en);
	const [users, setUsers] = useState(null);
	// const [companies, setCompanies] = useState([]);
	const [logoFile, setLogoFile] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [endDate,setEndDate] = useState(offer?.endAt);


	const navigate = useNavigate();
	const discount = {
		percentage: "نسبه %",
		amount: "كميه ثابته"
	};

	const [images, setImages] = useState([]);
	const handleGoBack = () => {
		setCreate(false);
		setEdit(false);
	};

	useEffect(() => {
		getFieldsData();
		if (offer?.logo) {
			setLogoFile([{
				uid: '-1',
				url: offer?.logo,
			}]);
		}
	}, []);

	const getFieldsData = async () => {
		const { status: countriesStatus, data: countriesData } =
			await CountriesServices.getAllCountries([{ city: true }]);
		const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(offer.countryId);
		const { status: usersStatus, data: usersData } = await UserServices.getAllUsers();
		const { status: categoriesStatus, data: categoriesData } =
			await CategoriesServices.getAllCategories([{offer:true}]);
		// const { status: companiesStatus, data: companiesData } =
		// 	await CompaniesServices.getAllCompanies();

		if (
			countriesStatus == 200 &&
			citiesStatus == 200 &&
			usersStatus == 200 &&
			categoriesStatus == 200
			// companiesStatus == 200
		) {
			setCountries(countriesData);
			setCities(citiesData);
			setUsers(usersData);
			setCategories(categoriesData);
			// setCompanies(companiesData);
			setDataLoaded(true);
			return;
		}
	};

	const mutation = useMutation(data => {
		console.log({ data });
		data.on_sale = data.on_sale ? "true" : "false";
		console.log('countryCity:', countries.find(co => co.id == data.countryId));
		if (!countries.find(co => co.id == data.countryId)?.cities?.map(c => c.id)?.includes(data.cityId)) {
			toast.error('الرجاء إختيار مدينه تابعه للدوله');
			return;
		}
		// data.categories = [data.categories];
		let formData = new FormData();
		// upload categories
		if(endDate){
			formData.append("endAt", endDate);
		}
		data.categories.forEach(cat => {
			formData.append("categories[]", cat);
		});
		if (logoFile?.length && !logoFile[0]?.url) {
			formData.append("logoFile", logoFile[0].originFileObj);
		}
		delete data.categories;
		for (const [key, value] of Object.entries(data)) {
			if(key==="on_sale" || key==="paid" || key==='main_page_paid'){
        formData.append(key,  (value===true || value==="true") ? "true" : "false");
        }else if(key==='sale_amount'){
					formData.append(key,  (value && value != "undefined") ? value : "0");
				}
				else{
          formData.append(key,  value && value !=
            "undefined" ? value : "");
        }
		}
		// upload images
		formData.append("description_en", descriptionen);
		formData.append("description_ar", descriptionar);
		// upload images
		setLoading(true);

		console.log("images", images?.fileList);
		if (images?.fileList?.length) {
			let formDataImages = new FormData();
			images?.fileList?.forEach(el => {
				formDataImages.append("images[]", el.originFileObj
				);
			});
			return OffersServices.addOfferImage(offer.id, formDataImages);
		} 
		return OffersServices.updateOffer(formData, offer.id);
	}, {
		onError: (error) => {
			console.log({ error });
			if(error){
				toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
			}
			setLoading(false);

		},
		onSuccess: (res) => {
			// Boom baby!
			if (res) {
				toast.success('لقد تم تعديل العرض بنجاح');
				navigate(searchParams.get('referrer'));
			}
			setLoading(false);
			// Router.push('/login')
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
		return OffersServices.addOfferImage(offer.id, formData);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
		},
		onSuccess: () => {
			// Boom baby!
			toast.success('لقد تم إضافه الصور بنجاح  ');

			window.location.reload(false);
			// Router.push('/login')
		},
	});
	const removeImages = useMutation((imageId) => {
		// data.categories = [data.categories]
		const payload = [imageId];
		const data = {
			data: {
				imageIds: payload
			}
		};
		return OffersServices.removeOfferImage(offer.id, data);

	}, {
		onError: (error) => {
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
		},
		onSuccess: () => {
			// Boom baby!
			toast.success('لقد تم إضافه الصور بنجاح  ');
			window.location.reload(false);
			// handleGoBack();
			// Router.push('/login')
		},
	});

	const [form] = Form.useForm();
	const [imagesForm] = Form.useForm();

	const onReset = () => {
		form.resetFields();
	};
	const onChangeMainPagePaid = () => {
		setMainPagePaid(!mainPagePaid);
	};
	const onChangePaid = () => {
		setPaid(!paid);
	};
	const onChangeDate = (date, dateString) => {
		console.log("dateString", dateString)
		setEndDate(dateString);
	};
	const disabledDate = (current) => {
		// Can not select days before today and today
		return current && current < dayjs().endOf('day');
	};
	const getUserCompanies = async (id) => {
		const { status: companiesStatus, data: companiesData } =
			await CompaniesServices.getAllCompanies([{ userId: id }]);
		if (companiesStatus == 200) {
			setCompanies(companiesData);
		}
	};
	const getCountryCities = async (id) => {
		const { status: citiesStatus, data: citiesData } = await CountriesServices.getAllCities(id);
		if (citiesStatus == 200) {
			setCities(citiesData);
		}
	};
	/* eslint-disable no-template-curly-in-string */
	const validateMessages = {
		required: '${label} مطلوب!',
		types: {
			email: '${label} يجب أن يكون صالحا!',
		},
		// number: {
		//   range: '${label} must be between ${min} and ${max}',
		// },
	};

	const [saleChecked, setSaleChecked] = useState(offer?.on_sale);
	const [mainPagePaid, setMainPagePaid] = useState(offer?.main_page_paid);
	const [paid, setPaid] = useState(offer?.paid);

	const onChangeSale = (checked) => {
		setSaleChecked(checked);
		console.log(`switch sale to ${checked}`);
	};

	if (!dataLoaded || !countries || !categories || !users || !cities) {
		return (
			<div className="p-8 m-40 mx-auto mt-8 bg-white rounded-md shadow-md md:w-9/12">
				<Skeleton active />
			</div>

		);
	}
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
	const initialValues = {
		name_ar: offer.name_ar || "",
		name_en: offer.name_en || "",
		// description_ar: offer.description_ar || "",
		// description_en: offer.description_en || "",
		address_ar: offer.address_ar || "",
		address_en: offer.address_en || "",
		companyId: offer?.companyId || null,
		countryId: offer?.countryId || null,
		cityId: offer?.cityId || null,
		userId: offer?.userId,
		categories: offer?.categories?.map(it => it.id) || [],
		on_sale: offer?.on_sale,
		sale_type: offer?.sale_type,
		sale_amount: offer?.sale_amount ? Number(offer?.sale_amount) : 0,
		location_link: offer?.location_link || "",
		code: offer?.code || "",
		website: offer?.website || "",
		whatsapp: offer?.whatsapp || "",
		standard_phone: offer?.standard_phone || "",
		mobile_number: offer?.mobile_number || "",
		// price: offer?.price || "",
	};
	return (
		<div className='mx-4'>
			{/* <div className="my-4 divider ">
				<h1 className="text-2xl font-bold text-center text-blueLight">
					Edit Offer
				</h1>
				<div className="w-full h-[1px] bg-gray-400"></div>
			</div> */}
			<div>
				<Form layout="vertical" {...layout} form={form} initialValues={initialValues} name="control-hooks" onFinish={mutation.mutate} validateMessages={validateMessages}>
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
								onChange={getUserCompanies}
							/>
						</Form.Item>

						<Form.Item label="الدوله" className="ltr:mr-4 rtl:ml-4 " name="countryId" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار دوله' }]}>
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
						{/* <Form.Item label="الشركه" name="companyId" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار شركه' }]}>
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
						<Form.Item label="الأنشطه" style={{ display: 'inline-block', width: 'calc(67% - 8px)' }} name="categories" rules={[{ required: true, message: 'برجاء إختيار الأنشطه' }]} className="ltr:mr-4 rtl:ml-4 ">
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
						<Form.Item label='الموقع الإلكتروني' name="website"  style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} >
									<Input placeholder='الموقع الإلكتروني' />
								</Form.Item>
					</Form.Item>
					<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="واتساب" name="whatsapp" className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder="واتساب" />
								</Form.Item>
								<Form.Item  label='رقم الهاتف ' className="ltr:mr-4 rtl:ml-4 " style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} name="standard_phone">
								<Input placeholder='رقم الهاتف ' />
							</Form.Item>
							<Form.Item label="رقم الجوال"  name="mobile_number" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
								<Input placeholder="رقم الجوال" />
							</Form.Item>
							</Form.Item>
					<Form.Item style={{ marginBottom: 0 }} >
						{/* <Form.Item className="ltr:mr-4 rtl:ml-4 " label="السعر" name="price" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} >
							<Input type="number" placeholder="السعر" />
						</Form.Item> */}
						<Form.Item className="ltr:mr-4 rtl:ml-4 " label="الكود" name="code" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
							<Input placeholder="الكود" />
						</Form.Item>
						<Form.Item label="رابط الخريطه" name="location_link" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
							<Input placeholder="رابط الخريطه" />
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
					<div className="divider">
						<h1 className="mb-1 text-lg font-bold text-center text-[#0f6fbd]">
							Images
						</h1>
						<div className="w-full h-[1px] bg-gray-500"></div>
					</div>
					<Form.Item className='mt-4 mb-0' >
						<Form.Item label="صوره الغلاف " style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} valuePropName="banner">
							{/* <ImgCrop rotate> */}
							<Upload onChange={({ fileList }) => { setLogoFile(fileList); }}
								listType="picture-card"
								// beforeUpload={() => false}
								onPreview={onPreviewLogo}
								fileList={logoFile}

							>
								{logoFile.length < 1 &&
									<div className='block' >

										<PlusOutlined />
										<div style={{ marginTop: 8 }}>Upload</div>
									</div>
								}
							</Upload>
							{/* </ImgCrop> */}


						</Form.Item>

					</Form.Item>
					<Form.Item className='mt-4 mb-4' >
						<Form.Item label="إضافه صور جديده" valuePropName="images" style={{ distplay: "inline-block", marginBottom: 0 }}>
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
						<Form.Item label="الوصف بالعربيه"  className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
							{/* <TextArea placeholder='الوصف باللغه العربيه' rows={4} /> */}
							<ReactQuill formats={formats} modules={modules}  rows={5} theme="snow" value={descriptionar} onChange={setDescriptionar} />

						</Form.Item>
						<Form.Item label="الوصف بالإنجليزيه" className=""  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
							{/* <TextArea placeholder='الوصف باللغه الإنجليزيه' rows={4} /> */}
							<ReactQuill formats={formats} modules={modules}  rows={5} theme="snow" value={descriptionen} onChange={setDescriptionen} />

						</Form.Item>
					</Form.Item>
					<Form.Item style={{ marginBottom: 0 }} >
						<Form.Item label="إظهار في الصفحه الرئيسيه" name="main_page_paid" className=" ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} valuePropName="checked">
							<Switch defaultChecked={mainPagePaid} className={`${mainPagePaid ? "bg-blue-500" : "bg-gray-200"} shadow-lg `} onChange={onChangeMainPagePaid} />
						</Form.Item>
						<Form.Item label="مدفوع" name="paid" className=" ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} valuePropName="checked">
							<Switch defaultChecked={paid} className={`${paid ? "bg-blue-500" : "bg-gray-200"} shadow-lg `} onChange={onChangePaid} />
						</Form.Item>
						<Form.Item label="موعد إنتهاء العرض"   style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} >
									<DatePicker  disabledDate={disabledDate} defaultValue={dayjs(endDate, 'YYYY-MM-DD HH:mm:ss')}  format={'YYYY-MM-DD HH:mm:ss'}      showTime  onChange={onChangeDate} />
								</Form.Item>
						{/* <Form.Item label="رابط الخريطه" name="location_link" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
							<Input placeholder="رابط الخريطه" />
						</Form.Item> */}
					</Form.Item>
					<Form.Item style={{ marginBottom: 0 }} >
						<Form.Item label="إستعمال خصم" name="on_sale" className=" ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(30% - 8px)' }}>
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
					<Form.Item {...tailLayout}>
						<Button type="primary" htmlType="submit" className='mx-2 bg-blue-500 rtl:pt-2'>
							submit
						</Button>
						<Button type="warning"  onClick={()=>navigate(`/offers/create?referrer=${searchParams.get('referrer')}&offerId=${offer.id}`)} className='mx-2 text-white bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-450 hover:text-white rtl:pt-2' >
								نسخ - copy
					</Button>
						<Button htmlType="button" onClick={onReset} className='mx-2 rtl:pt-2 '>
							reset
						</Button>

					</Form.Item>
				</Form>
			</div>
			<div className="my-8 divider ">
				<h1 className="text-2xl font-bold text-center text-blueLight">
					Edit Offer Images
				</h1>
				<div className="w-full h-[1px] bg-gray-400"></div>
			</div>
			{/* <Form {...formImagesLayout} form={imagesForm} name="form-images" onFinish={addImages.mutate} >
				<Form.Item label="إضافه صور العرض" valuePropName="images" style={{ distplay: "inline-block", marginBottom: 0 }}>
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
						Upload New Images
					</Button>
				</Form.Item>
			</Form> */}
			<section className="overflow-hidden text-gray-700 ">
				<div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
					<div className="flex flex-wrap -m-1 md:-m-2">
						{offer?.images?.sort((a,b)=>a.id-b.id)?.map((img, i) => (
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

export default EditOfferForm;