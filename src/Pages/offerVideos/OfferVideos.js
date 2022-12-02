import { Modal, Skeleton, Table } from 'antd';
import moment from 'moment';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import React, { useEffect, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
import CreatePage from '../pages/CreatePage';
import EditPage from '../pages/EditPage';

import AddVideo from './AddVideo';
import EditVideo from './EditVideo';
import OfferVideosServices from 'Services/OfferVideosServices';
const OfferVideos = ({offer}) => {
	const queryClient = useQueryClient();

	const [videos,setVideos] = useState(offer.videos);
	const [loading, setLoading] = useState(false);

	const [open, setOpen] = useState(false);
	const [id, setId] = useState("");
	const [create,setCreate] = useState(false);
	const [edit,setEdit] = useState(false);
	const { data:offerVideos, isLoading} = useQuery(['offer-videos'], ()=>OfferVideosServices.getAllVideos([{offerId:offer.id}]));
	const showModal = (id) => {
		setId(id);
		setOpen(true);
	};

	const handleOk = async() => {
		try{
			// await axios.delete(`/video/${id}`)
			await OfferVideosServices.removeVideo(id)
			queryClient.invalidateQueries({ queryKey: ['offer-videos'] });

			toast.success('لقد تم  حذف الفيديو بنجاح');
			handleCancel();
		}catch(err){
			console.log({err})
			toast.error('لقد  حدث خطأ ما');

		}

	};
	const handleEdit= (id)=>{
		setId(id)
		setTimeout(()=>setEdit(true),500)

	}
	const handleCancel = () => {
		setOpen(false);
		setId("");
	};

	const columns = [
		{
			title: "#",
			dataIndex: `id`,
			key: 'id',
			render: (text, record) =>  <p className='text-sm font-medium text-gray-900 '>{record.id}</p>,
		},
		{
			title: "video",
			dataIndex: `video`,
			key: 'video',
			render: (text, record) => <p className='text-gray-500 '>{text}</p>,
		},
		{
			title: "created_at",
			key: 'verified',
			render: (_, record) => <p className='text-gray-500'>{moment(record.createdAt).format("MMM DD, YYYY HH:MM").toString()}</p>,
		},

		{
			title: "control",
			key: 'action',
			render: (_, record) => (
				<div className="flex justify-end space-x-2">

					<button
						onClick={()=>handleEdit(record.id)}
						type="button"
						className="inline-block px-3 py-2 text-lg font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-blue-400 rounded shadow-md bg-primary hover:bg-blueDark hover:shadow-lg focus:bg-blueDark focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blueDark active:shadow-lg"
					>
						<AiFillEdit className="text-white" />
					</button>

					<button
						onClick={() => showModal(record.id)}
						type="button"
						className="inline-block px-3 py-2 text-lg font-medium leading-tight text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg"
					>
						<FaTrash className="text-sm text-white" />
					</button>
				</div>
			),
		},
	];

	if(isLoading){
		return (
			<div className="p-8 mx-auto mt-8 bg-white rounded-md shadow-md md:w-9/12">
				<Skeleton active />
			</div>

		)
	}
	return (
		<>
		<div className="w-full my-8">

	
		{create
			?
			<AddVideo offer={offer} create={create} setCreate={setCreate} edit={edit} setEdit={setEdit}/>
			:
			edit
			?
			<EditVideo id={id} offer={offer} create={create} setCreate={setCreate} edit={edit} setEdit={setEdit}/>
			:
		
			<div className="">
				<Modal open={open}
				// title="Title"
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<button key="return" className='px-2 pt-1 mx-2 text-white bg-blue-500 rounded hover:opacity-90' onClick={handleCancel}>
						cancel
					</button>,
					<button key="submit" className='px-2 pt-1 mx-2 text-white bg-red-500 rounded hover:opacity-90' type="primary" onClick={handleOk}>
						"confirm"
					</button>

				]}>
				<div className="mt-12">
					Are you sure to delete ?
				</div>
			</Modal>
			<button
				onClick={()=>setCreate(true)}
				className=" px-4 py-2.5 bg-blueLight text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blueDark hover:shadow-lg focus:bg-blueDark focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mb-4  bg-blue-400"
			>
				<IoMdAdd className="mr-2 font-bold text-white" />
				Add Video
			</button>
			{
				offerVideos?.length
					?
					<Table columns={columns} dataSource={offerVideos} />
					:
					<div className="flex justify-center">
						<p >NO Data Found</p>
					</div>
			}
			</div>
	 }
		</div>

	
	</>
	);
}

export default OfferVideos