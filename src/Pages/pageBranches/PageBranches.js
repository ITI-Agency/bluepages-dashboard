import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal, Skeleton, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
import BranchesServices from 'Services/BranchesServices';

import CreatePage from '../pages/CreatePage';
import EditPage from '../pages/EditPage';
import AddBranch from './AddBranch';
import EditBranch from './EditBranch';
const PageBranches = ({company}) => {
	const queryClient = useQueryClient();

	const [open, setOpen] = useState(false);
	// const [branches,setBranches] = useState(null)
	// const [loading, setLoading] = useState(false);

	const [id, setId] = useState("");
	const [create,setCreate] = useState(false)
	const [edit,setEdit] = useState(false);
	// useEffect(() => {
	// 	getBranchesData();
	// }, []);
	// const getBranchesData = async()=>{
	// 	setLoading(true)
	// 	try {
	// 		const { status: branchesStatus, data: branchesData } = await BranchesServices.getAllBranches([{companyId:company.id}])
	// 		if (branchesStatus == 200) {
	// 			setLoading(false)
	// 				console.log("branches data :>",{branchesData})
	// 				setBranches(branchesData);
	// 			}else{
	// 				toast.error("sorry something went wrong while getting branch!");
	// 				setLoading(false);
	// 			}
	// 	} catch (error) {
	// 		console.log(error)
	// 		toast.error("sorry something went wrong while getting branch!");
	// 		setLoading(false);
	// 	}
	// }
	const { data:companyBranches, isLoading} = useQuery(['company-branches'], ()=>BranchesServices.getAllBranches([{companyId:company.id}]));

	const showModal = (id) => {
		setId(id);
		setOpen(true);
	};

	const handleOk = async() => {
		try{
			await BranchesServices.removeBranch(id)
			toast.success('لقد تم  حذف الفرع بنجاح', 'success');
			queryClient.invalidateQueries({ queryKey: ['company-branches'] });

			handleCancel();
		}catch(err){
			console.log({err})
			toast.error('لقد  حدث خطأ ما', 'error');

		}

	};
	const handleEdit= (id)=>{
		setId(()=>id)
		setTimeout(()=>setEdit(true),800)
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
			title: "name",
			dataIndex: `name_ar`,
			key: 'name',
			render: (text, record) => <p className='text-gray-500 '>{text}</p>,
		},
		{
			title: "address",
			dataIndex: `address_ar`,
			key: 'name',
			render: (text, record) => <p className='text-gray-500 '>{text}</p>,
		},
		{
			title: "phone",
			key: 'phone',
			render: (text, record) =>  <p className='text-gray-500 '>{record.phone?record.phone:""}</p>,
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
			<AddBranch company={company}  create={create} setCreate={setCreate} edit={edit} setEdit={setEdit}/>
			:
			edit
			?
			<EditBranch company={company} id={id}  create={create} setCreate={setCreate} edit={edit} setEdit={setEdit}/>
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
						I Want To Delete This Record !
					</div>
				</Modal>
				<button
					onClick={()=>setCreate(true)}
					className=" px-4 py-2.5 bg-blueLight text-white bg-blue-400 font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blueDark hover:shadow-lg focus:bg-blueDark focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mb-4"
				>
					<IoMdAdd className="mr-2 font-bold text-white" />
					Add Page
				</button>
				{
					companyBranches?.length
						?
						<Table columns={columns} dataSource={companyBranches} />
						:
						<div className="flex justify-center">
							<p >No Data Found</p>
						</div>
				}
				</div>
		}
			</div>

		
		</>
	);
}

export default PageBranches