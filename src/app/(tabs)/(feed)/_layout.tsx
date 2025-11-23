import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';

export default function FeedLayout() {
  return (
    <React.Fragment>
      <Stack screenOptions={{headerShown: false}} />
    </React.Fragment>
  )
}
