import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
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
            {userType === 'volunteer' && (<Redirect href='/profile/ViewVolunteerProfile' />)}
            {userType === 'organization' && (<Redirect href='/profile/ViewOrganizationProfile' />)}
        </React.Fragment>
    )
}