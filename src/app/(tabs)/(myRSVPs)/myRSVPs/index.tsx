import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { storage } from '@/src/utils/storage';
// this file will just look at the user and redirect depending on if they're a user or organization.

export default function ProfileRedirect() {
    const [userType, setUserType] = useState('');

    const getUserType = async () => {
        const userType = await storage.get('userType');
        setUserType(userType ? userType : '')
    }

    useEffect(() => {
        getUserType();
    }, []);

    return (
        <React.Fragment>
            {userType === 'volunteer' && (<Redirect href='/myRSVPs/VolunteerEvents' />)}
            {userType === 'organization' && (<Redirect href='/myRSVPs/OrganizationEvent' />)}
        </React.Fragment>
    )
}