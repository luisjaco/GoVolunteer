import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function HomeLayout(){
    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <Stack>
                <Stack.Screen name='index' options={{
                    title: "home feed"
                }}/>
                <Stack.Screen name="viewEventInfo" options={{
                    title: "event details"
                }} />
            </Stack>
        </React.Fragment>
    )
}