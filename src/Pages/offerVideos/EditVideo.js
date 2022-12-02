import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Skeleton } from 'antd';
import React from 'react';
import { BsBackspaceFill } from 'react-icons/bs';

import TextArea from 'antd/lib/input/TextArea';
import { toast } from 'react-toastify';
import OfferVideosServices from 'Services/OfferVideosServices';

const layout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 20 },
};
const EditVideo = ({ offer, setCreate, setEdit,id }) => {
	const queryClient = useQueryClient();


	const { data:singleVideo, isLoading} = useQuery(['single-offer-video',id], ()=>OfferVideosServices.getVideoDetails(id));
	const handleGoBack = () => {
		setCreate(false);
		setEdit(false);
	};
	const [form] = Form.useForm();
	const onReset = () => {
		form.resetFields();
	};



	const mutation = useMutation(data => {


		return OfferVideosServices.updateVideo(data,id);
	}, {
		onError: (error) => {
			console.log({ error });
			toast.error('لقد حدث خطأ ما برجاء التأكد من بياناتك');

		},
		onSuccess: () => {
			// Boom baby!
			toast.success('لقد تم تعديل الفيديو بنجاح');

			queryClient.invalidateQueries({ queryKey: ['offer-videos'] });
			queryClient.invalidateQueries({ queryKey: ['single-offer-video',id] });
			handleGoBack();
			// Router.push('/login')
		},
	});

	if(isLoading){
		return (
			<div className="p-8 mx-auto mt-8 bg-white rounded-md shadow-md md:w-9/12">
				<Skeleton active />
			</div>

		)
	}
	const initialValues = {
		video: singleVideo.video || "",
	};
	return (
		<div className='mx-8'>
			<button
				onClick={handleGoBack}
				className=" px-4 py-2.5 bg-purple-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-400 hover:shadow-lg focus:bg-purple-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mb-4"
			>
				<BsBackspaceFill className="mr-2 font-bold text-white" />
				Go Back
			</button>
			<div className="mt-4">
				<Form layout="vertical" initialValues={initialValues} {...layout} form={form} name="control-hooks" onFinish={mutation.mutate} >
				<Form.Item style={{ marginBottom: 0 }} >
						<Form.Item label="الفيديو" name="video" rules={[{ required: true, message: "الفيديو  مطلوب" }]} className="ltr:mr-4 rtl:ml-4" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
							<Input placeholder="الفيديو" />
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
		</div>
	);
};

export default EditVideo;