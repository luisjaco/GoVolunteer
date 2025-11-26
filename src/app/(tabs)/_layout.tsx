import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <React.Fragment>
      <StatusBar style='auto'/>
      <Tabs screenOptions={ {
        tabBarActiveTintColor: PRIMARY_COLOR,
        headerShown: false,
        tabBarShowLabel: false
      }}>
        <Tabs.Screen name='feed' options={{
          // title: "Home Feed",
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name='home-outline'
              size={size}
              color={color}
            />
          )
        }} />
        <Tabs.Screen name='myRSVPs' options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name='calendar-outline'
              size={size}
              color={color}
            />
          )
        }} />
        <Tabs.Screen name='profile' options={{
          // title: "Profile",
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name='person-outline'
              size={size}
              color={color}
            />
          )
        }} />
      </Tabs>
    </React.Fragment>
  )
}
