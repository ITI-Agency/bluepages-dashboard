import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Container, Paper } from "@mui/material";
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Upload } from 'antd';
import LoadingDataLoader from "components/LoadingDataLoader";
import TextArea from "antd/lib/input/TextArea";
import CitiesServices from "Services/CitiesServices";
import { useNavigate, useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";


const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};

function EditCity() {
	const [city, setCity] = useState(null);
	const navigate = useNavigate();
	const {cityId,countryId} = useParams();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getCity();
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

	const getCity = async () => {
		setLoading(true);
		try {
			const response = await CitiesServices.getCityDetails(cityId);
			if (response && response.status == 200) {
				setLoading(false);
				setCity(()=>response.data);
			} else {
				toast.error("sorry something went wrong while getting city!");
				setLoading(false);
			}
		} catch (error) {
			toast.error("sorry something went wrong while getting city!");
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
		return CitiesServices.updateCity(fd,city?.id);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('something went wrong');
			setLoading(false);
		},
		onSuccess: () => {
			toast.success("your city has been edited successfully!");
			setLoading(false);
			navigate(`/countries/${countryId}`);
		},
	});


	if (loading || !city) return <LoadingDataLoader />;
	console.log("city", city);
	const initialValues = {
    		name_ar: city.name_ar || "",
        name_en: city.name_en || "",
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
						<img className="relative top-10 " src={city.image} alt={city.name_en} style={{ width: "6rem", height: "6rem" }} />
						</Form.Item>
            <Form.Item label="Name ar" name="name_ar" rules={[{ required: true, message: 'برجاء إدخال الإسم' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Name en" name="name_en" rules={[{ required: true, message: 'برجاء إدخال الإسم' }]}>
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

export default EditCity;