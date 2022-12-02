import { useQuery } from '@tanstack/react-query';
import { Skeleton, Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import React from 'react';
import { BsBackspaceFill } from 'react-icons/bs';
import OffersServices from 'Services/OffersServices';
import OfferVideos from '../offerVideos/OfferVideos';
import EditOfferForm from './EditOfferForm';
import { useParams } from 'react-router-dom';
import { Paper, Container } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const EditOffer = ({ setCreate, setEdit }) => {
	const { id: offerId } = useParams();

	const handleGoBack = () => {
		setCreate(false);
		setEdit(false);
	};
	const { data: offer = {}, isLoading: isLoadingOffer } = useQuery(['single-offer', offerId], () => OffersServices.getOfferDetails(offerId));
	console.log("current offer", { offer });
	if (isLoadingOffer) {
		return (
			<DashboardLayout>
				<h1>Update Offer</h1>
				<Container sx={{ mb: 4 }}>
					<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
						<div className="p-8 m-40 mx-auto mt-8 bg-white rounded-md shadow-md md:w-9/12">
							<Skeleton active />
						</div>
					</Paper>
				</Container>
			</DashboardLayout>

		);
	}
	return (
		<DashboardLayout>
			<h1>Update Offer</h1>
			<Container sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}>
					<div className="mx-8">

						<Tabs>
							<TabPane tab="offerInformation" key="offer_information">
								<EditOfferForm offer={offer} id={offerId} />
							</TabPane>
							<TabPane tab="offer videos" key="offer_videos">
								<OfferVideos offer={offer} />
							</TabPane>
						</Tabs>
					</div>
				</Paper>
			</Container>
		</DashboardLayout>
	);
};

export default EditOffer;