import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';

export default function ProfileLayout() {
  return (
    <React.Fragment>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='EditProfile' />
      </Stack>
    </React.Fragment>
  )
}
