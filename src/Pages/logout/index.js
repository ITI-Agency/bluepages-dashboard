import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
	const navigate = useNavigate();
	console.log('logout');
	useEffect(()=>{
		localStorage.removeItem("AUTH_JWT");
		navigate('/login');
	},[])
	return (
		<div>Logout</div>
	)
}

export default Logout