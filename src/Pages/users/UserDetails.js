import React, { useState, useEffect } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import LoadingDataLoader from "components/LoadingDataLoader";

import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import { useParams } from "react-router-dom";
import useFetch from "Hooks/useFetch";
import UserServices from "Services/UserServices";
import Moment from "react-moment";

function UserDetails() {
  const { id: userId } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getUserDetails();
  }, []);
  const getUserDetails = async () => {
    setLoading(true);
    try {
      const response = await UserServices.getUserDetails(userId);
      if (response && response.status == 200) {
        setLoading(false);
        setUserDetails(response.data);
      } else {
        toast.error("sorry something went wrong while getting user details!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting user details!");
      setLoading(false);
    }
  };
  if (loading) return <LoadingDataLoader />;
  const created = <Moment fromNow>{userDetails.createdAt}</Moment>;
  const updated = <Moment fromNow>{userDetails.updatedAt}</Moment>;
  return (
    <DashboardLayout>
      <ProfileInfoCard
        title="User details:"
        description=""
        info={{
          id: userDetails.id,
          name: userDetails.name,
          email: userDetails.email,
          role: userDetails.role,
          createdAt: created,
          updatedAt: updated,
        }}
        // social={[]}
        action={{ route: `/users/edit/${userDetails.id}`, tooltip: "Edit User Detials" }}
        shadow={false}
      />
    </DashboardLayout>
  );
}

export default UserDetails;
