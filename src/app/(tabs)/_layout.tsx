import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style='auto' />
      <Tabs screenOptions={ {
        tabBarActiveTintColor: 'green'
      }}>
        <Tabs.Screen name='(home)' options={{
          title: "Home",
        }} />
        <Tabs.Screen name='(post)' options={{
          title: "Post",
        }} />
        <Tabs.Screen name='(profile)' options={{
          title: "Profile",
        }} />
      </Tabs>
    </React.Fragment>
  )
}
