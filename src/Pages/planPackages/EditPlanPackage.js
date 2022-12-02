import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useNavigate, useParams } from "react-router-dom";
import SubscriptionPlanPackagesServices from "Services/SubscriptionPlanPackagesServices";
import { toast } from "react-toastify";
import { Button, Form, Input, Select } from 'antd';
import Util from "../../Utils";
const plans = Util.plans;
const { Option } = Select;
import { useMutation } from '@tanstack/react-query';
const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
function EditPlanPackages() {
  const { id: packageId } = useParams();
  const navigate = useNavigate();
  const [planPackage, setPlanPackage] = useState(null);

  const [loading, setLoading] = useState(false);

	useEffect(() => {
    getAllSubscriptionPlanPackages();
  }, []);
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};

  const getAllSubscriptionPlanPackages = async () => {
    setLoading(true);
    try {
  		const response = await SubscriptionPlanPackagesServices.getSubscriptionPlanPackageDetails(packageId);
      if (response && response.status == 200) {
        setLoading(false);
        setPlanPackage(response.data);
      } else {
        toast.error("sorry something went wrong while getting packages!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting packages!");
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    const { id, name_en, name_ar } = category;
    const response = await CategoriesServices.updateCategory({ id, name_en, name_ar });
    console.log("this is update repsponse:>", response, response.statusText);
    if (response.statusText == "OK") {
      navigate("/categories");
    }
    console.log("this is the response", response);
    setLoading(false);
  };
	const mutation = useMutation(data => {
		data.id = planPackage.id;
		return SubscriptionPlanPackagesServices.updateSubscriptionPlanPackage(data);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('something went wrong')
		},
		onSuccess: () => {
			toast.success('package edited successfully')
			navigate("/plan-packages");
		},
	});


  if (loading || !planPackage) return <LoadingDataLoader />;
	console.log("package",planPackage)
	const initialValues = {
		title_ar: planPackage.title_ar || "",
		title_en: planPackage.title_en || "",
		duration: planPackage.duration || "",
		price: planPackage.price || "",
		// subscriptionPlanId: planPackage.subscriptionPlanId || "",
	};
  return (
    <DashboardLayout>
      <Container sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
				<div className="mt-4">
						<Form layout="vertical"  initialValues={initialValues} {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
							<Form.Item style={{ marginBottom: 0 }} >
								<Form.Item label="الإسم بالعربيه" name="title_ar" rules={[{ required: true, message: 'الإسم باللغه العربيه مطلوب' }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder='الإسم باللغه العربيه' />
								</Form.Item>
								<Form.Item label="الإسم بالإنجليزيه" className="ltr:mr-4 rtl:ml-4" name="title_en" rules={[{ required: true, message: 'الإسم باللغه الإنجليزيه مطلوب' }]} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
									<Input placeholder='الإسم باللغه الإنجليزيه' />
								</Form.Item>

								{/* <Form.Item label='خطه الإشتراك للصفحات' name="subscriptionPlanId" style={{ display: 'inline-block', width: 'calc(33% - 8px)' }} rules={[{ required: true, message: 'برجاء إختيار خطه الإشتراك' }]}>
									<Select
										placeholder='برجاء إختيار خطه الإشتراك'
										allowClear
									>
										{plans?.map((p) => (<Option key={p.package_id} value={p.package_id}>{p[`name_ar`]}</Option>))}
									</Select>
								</Form.Item> */}
							</Form.Item>
							<Form.Item style={{ marginBottom: 0 }} >
							<Form.Item label="المده (بالأيام)" className="ltr:mr-4 rtl:ml-4"  name="duration" rules={[{ required: true, message: "برجاء إدخال المده (بالأيام)" }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
													<Input type='number' placeholder=" المده (بالأيام)" />
												</Form.Item>
												<Form.Item label="السعر" className="" name="price" rules={[{ required: true, message: "برجاء إدخال  السعر " }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
													<Input type='number' placeholder="السعر" />
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

export default EditPlanPackages;
