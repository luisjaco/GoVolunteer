import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style='auto' />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name='index' />
        <Stack.Screen name='auth/SignUp' />
        <Stack.Screen name='auth/SignIn' />
        <Stack.Screen name='auth/setup/index' />
        <Stack.Screen name='auth/setup/(organizationSetup)/OrganizationSetup' />
        <Stack.Screen name='auth/setup/(volunteerSetup)/VolunteerSetup' />
        <Stack.Screen name='auth/setup/(volunteerSetup)/VolunteerConfirmation' />
        <Stack.Screen name='(tabs)'/>
        <Stack.Screen name='Splash'/>
      </Stack>
    </React.Fragment>
  )
}
