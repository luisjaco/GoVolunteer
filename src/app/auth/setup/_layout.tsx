import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';

export default function AuthLayout() {
    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name='index' options={{
                    headerShown: false,
                    title: 'User or organization?'
                }} />
                <Stack.Screen name='(volunteerSetup)/VolunteerSetup' options={{
                    headerShown: false,
                    title: 'User setup'
                }} />
                <Stack.Screen name='(organizationSetup)/OrganizationSetup' options={{
                    headerShown: false,
                    title: 'OrganizationSetup'
                }} />
            </Stack>
        </React.Fragment>
    )
};
