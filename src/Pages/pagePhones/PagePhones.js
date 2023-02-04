import { Modal, Skeleton, Table } from 'antd';
import moment from 'moment';
import { useQuery, useQueryClient } from '@tanstack/react-query';


import React, { useEffect, useState  } from 'react'
import { AiFillEdit } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';


import { toast } from 'react-toastify';

import AddPhone from './AddPhone';
import EditPhone from './EditPhone';
import PagePhonesServices from 'Services/PagePhonesServices'
const PagePhones = ({company}) => {
	const queryClient = useQueryClient();

	const [phones,setPhones] = useState(company.phones);
	const [loading, setLoading] = useState(false);

	const [open, setOpen] = useState(false);
	const [id, setId] = useState("");
	const [create,setCreate] = useState(false)
	const [edit,setEdit] = useState(false)
	// useEffect(() => {
	// 	getPhonesData();
	// }, []);
	// const getPhonesData = async()=>{
	// 	setLoading(true)
	// 	try {
	// 		const { status: phonesStatus, data: phonesData } = await PagePhonesServices.getAllPhones([{companyId:company.id}])
	// 		if (phonesStatus == 200) {
	// 			setLoading(false)
	// 				console.log("phones data :>",{phonesData})
	// 				setPhones(phonesData);
	// 			}else{
	// 				toast.error("sorry something went wrong while getting phones!");
	// 				setLoading(false);
	// 			}
	// 	} catch (error) {
	// 		console.log(error)
	// 		toast.error("sorry something went wrong while getting video!");
	// 		setLoading(false);
	// 	}
	// }
	const { data:companyPhones, isLoading} = useQuery(['company-phones'], ()=>PagePhonesServices.getAllPhones([{companyId:company.id}]));

	const showModal = (id) => {
		setId(id);
		setOpen(true);
	};

	const handleOk = async() => {
		try{
			// await axiostoast.success.delete(`/phone/${id}`)
			await PagePhonesServices.removePhone(id)
			toast.success('لقد تم  حذف الهاتف بنجاح');
			handleCancel();
			queryClient.invalidateQueries({ queryKey: ['company-phones'] });

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
			title: "phone",
			dataIndex: `phone`,
			key: 'phone',
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
			<AddPhone  company={company} create={create} setCreate={setCreate} edit={edit} setEdit={setEdit}/>
			:
			edit
			?
			<EditPhone id={id} company={company} create={create} setCreate={setCreate} edit={edit} setEdit={setEdit}/>
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
					confirm
						</button>

					]}>
					<div className="mt-12">
					Are you sure to delete ?
					</div>
				</Modal>
				{
					companyPhones?.length < 2 ?
				<button
					onClick={()=>setCreate(true)}
					className=" px-4 py-2.5 bg-blueLight text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blueDark hover:shadow-lg focus:bg-blueDark focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mb-4 bg-blue-400"
				>
					<IoMdAdd className="mr-2 font-bold text-white" />
					Add Phone
				</button>
				: null
				}
				{
					companyPhones?.length
						?
						<Table columns={columns} dataSource={companyPhones} />
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

export default PagePhones