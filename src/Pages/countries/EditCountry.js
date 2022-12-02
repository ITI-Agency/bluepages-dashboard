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

function EditCountry() {
	const [country, setCountry] = useState(null);
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getCountry();
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

	const getCountry = async () => {
		setLoading(true);
		try {
			const response = await CountriesServices.getCountryDetails(id);
			if (response && response.status == 200) {
				setLoading(false);
				setCountry(()=>response.data);
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
		console.log("submitted data",data)
		const fd = new FormData();
		if (!data.file) delete data.file;
		Object.keys(data).forEach((t) => {
      if (t == "file") {
        fd.append(t, data[t][0].originFileObj);
      } else {
        fd.append(t, data[t]);
      }
    });
		return CountriesServices.updateCountry(fd,country?.id);
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
						<Form.Item  label="flag" style={{width:'calc(30% - 8px)',display: 'inline-block',}}  name="file" getValueFromEvent={getFile} valuePropName="fileList">
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
						<Form.Item style={{width:'calc(50% - 8px)',display: 'inline-block',}}>
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
				</Paper>
			</Container>
		</DashboardLayout>
	);
}

export default EditCountry;