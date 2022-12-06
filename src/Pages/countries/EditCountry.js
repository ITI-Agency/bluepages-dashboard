import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Container, Paper } from "@mui/material";
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Upload } from 'antd';
import LoadingDataLoader from "components/LoadingDataLoader";
import TextArea from "antd/lib/input/TextArea";
import CountriesServices from "Services/CountriesServices";
import { useNavigate, useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";


const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
const formImagesLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 16 },
};

function EditCountry() {
	const [country, setCountry] = useState(null);
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [images, setImages] = useState([]);

	useEffect(() => {
		getCountry();
	}, []);
	const [form] = Form.useForm();
	const [imagesForm] = Form.useForm();

	const onReset = () => {
		form.resetFields();
	};
	const getFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const getCountry = async () => {
		setLoading(true);
		try {
			const response = await CountriesServices.getCountryDetails(id);
			if (response && response.status == 200) {
				setLoading(false);
				setCountry(() => response.data);
			} else {
				toast.error("sorry something went wrong while getting packages!");
				setLoading(false);
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting packages!");
			setLoading(false);
		}
	};
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
		return CountriesServices.addCountryImages(id, formData);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');
		},
		onSuccess: () => {
			// Boom baby!
			toast.success('لقد تم إضافه الصور بنجاح  ');
			navigate(`/countries`);
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
		return CountriesServices.removeCountryImages(id, data);
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

	const mutation = useMutation(data => {
		console.log("submitted data", data);
		const fd = new FormData();
		if (!data.file) delete data.file;
		Object.keys(data).forEach((t) => {
			if (t == "file") {
				fd.append(t, data[t][0].originFileObj);
			} else {
				fd.append(t, data[t]);
			}
		});
		return CountriesServices.updateCountry(fd, country?.id);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('something went wrong');
			setLoading(false);
		},
		onSuccess: () => {
			toast.success("your countries has been edited successfully!");
			setLoading(false);
			navigate(`/countries`);
		},
	});


	if (loading || !country) return <LoadingDataLoader />;
	console.log("country", country);
	const initialValues = {
		name_ar: country.name_ar || "",
		name_en: country.name_en || "",
		code: country.code || "",
		title_ar: country.title_ar || "",
		title_en: country.title_en || "",
		subtitle_ar: country.subtitle_ar || "",
		subtitle_en: country.subtitle_en || "",
		// views: settings.views || "",
	};

	return (
		<DashboardLayout>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>

					<Form layout="vertical" initialValues={initialValues} {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
						<Form.Item label="flag" style={{ width: 'calc(30% - 8px)', display: 'inline-block', }} name="file" getValueFromEvent={getFile} valuePropName="fileList">
							<Upload beforeUpload={() => false} listType="picture-card">
								<div>
									<PlusOutlined />
									<div
										style={{
											marginTop: 8,
										}}
									>
										Upload
									</div>
								</div>
							</Upload>
						</Form.Item>
						<Form.Item style={{ width: 'calc(50% - 8px)', display: 'inline-block', }}>
							<img className="relative top-10 " src={country.flag} alt={country.name_en} style={{ width: "6rem", height: "6rem" }} />
						</Form.Item>
						<Form.Item label="Name ar" name="name_ar" rules={[{ required: true, message: 'برجاء إختيار المستخدم' }]}>
							<Input />
						</Form.Item>
						<Form.Item label="Name en" name="name_en" rules={[{ required: true, message: 'برجاء إختيار المستخدم' }]}>
							<Input />
						</Form.Item>
						<Form.Item label="Code" name="code" rules={[{ required: true, message: 'برجاء إختيار الكود' }]}>
							<Input />
						</Form.Item>
						<Form.Item label="Title ar" name="title_ar" rules={[{ required: true, message: 'برجاء إختيار العنوان' }]}>
							<Input />
						</Form.Item>
						<Form.Item label="Title en" name="title_en" rules={[{ required: true, message: 'برجاء إختيار العنوان' }]}>
							<Input />
						</Form.Item>
						<Form.Item label="Subtitle ar" name="subtitle_ar" rules={[{ required: true, message: 'برجاء إختيار العنوان الفرعي' }]}>
							<Input />
						</Form.Item>
						<Form.Item label="Subtitle en" name="subtitle_en" rules={[{ required: true, message: 'برجاء إختيار العنوان الفرعي' }]}>
							<Input />
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
					<div className="my-4 divider ">
						<h1 className="text-2xl font-bold text-center text-blueLight">
							تعديل صور الدوله
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
								{country.images.map((img, i) => (
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
				</Paper>
			</Container>
		</DashboardLayout>
	);
}

export default EditCountry;