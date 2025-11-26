import React from 'react';
import { Redirect } from 'expo-router';

// this file will just look at the user and redirect depending on if they're a user or organization.

export default function ProfileRedirect() {
    return (
        <Redirect href='/profile/ViewVolunteerProfile' />
    )
}