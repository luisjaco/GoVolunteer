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
        <Stack.Screen name='index' options={{
          headerShown: false,
          title: 'GoVolunteer'
        }} />
        <Stack.Screen name='auth' options={{
          headerShown: false,
          title: 'Auth'
        }} />
        <Stack.Screen name='(tabs)' options={{
          headerShown: false,
          title: 'Home'
        }} />
      </Stack>
    </React.Fragment>
  )
}
