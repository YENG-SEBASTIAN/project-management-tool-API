import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrganizationById } from '../../../actions/organizationActions';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';

const OrganizationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { organizations, loading, error } = useSelector(state => state.organizations);
  
  useEffect(() => {
    dispatch(getOrganizationById(id));
  }, [dispatch, id]);

  // Handle loading state
  if (loading) {
    return <Spinner />;
  }

  // Handle error state or organization not found
  if (error || !organizations || organizations.length === 0) {
    return <Alert message={error || "Organization not found"} type="error" />;
  }

  // Assuming you want to display details of the first organization in the array
  const organization = organizations[0];

  // Render organization details once loaded
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Org. Name: {organization.name}</h1>
      <p className="text-lg">Description: {organization.description}</p>
      <p className="mt-4">Owner: {organization.owner.username}</p>
     <h2 className="mt-4 text-xl font-bold">Members</h2>
      {/* <ul className="mt-2">
        {organization.members_emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default OrganizationDetail;
