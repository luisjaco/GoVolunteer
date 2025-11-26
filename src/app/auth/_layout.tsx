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
                    title: 'Sign In'
                }} />
                <Stack.Screen name='SignUp' options={{
                    headerShown: false,
                    title: 'Sign Up'
                }} />
                <Stack.Screen name='setup' options={{
                    headerShown: false,
                    title: 'Create your account'
                }} />
            </Stack>
        </React.Fragment>
    )
};
