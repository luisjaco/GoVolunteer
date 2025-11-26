import { Stack } from "expo-router";
import React from 'react';

export default function MyRSVPsLayout() {
  return (
    <React.Fragment>
      <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name='profile' />
      </Stack>
    </React.Fragment>
  )
}
