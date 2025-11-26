import { Stack } from "expo-router";
import React from 'react';

export default function MyRSVPsLayout() {
  return (
    <React.Fragment>
      <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name='index' />
          <Stack.Screen name='(organization)/ViewOrganizationProfile' />
          <Stack.Screen name='(organization)/EditOrganizationProfile' />
          <Stack.Screen name='(volunteer)/ViewVolunteerProfile' />
          <Stack.Screen name='(volunteer)/EditVolunteerProfile' />
      </Stack>
    </React.Fragment>
  )
}
