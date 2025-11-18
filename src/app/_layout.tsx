import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style='auto' />
      <Stack>
        <Stack.Screen name='index' options={{
          headerShown: true,
          title: 'GoVolunteer'
        }} />
        <Stack.Screen name='(tabs)' options={{
          headerShown: false,
          title: 'Test'
        }} />
      </Stack>
    </React.Fragment>
  )
}
