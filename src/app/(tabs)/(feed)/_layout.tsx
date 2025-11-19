import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function FeedLayout(){
    return (
        <React.Fragment>
            <StatusBar style='auto'/>
            <Stack>
                <Stack.Screen name='index' options={{
                    headerShown: false
                }}/>
                <Stack.Screen name="viewEventInfo" options={{
                    headerShown: false
                }} />
            </Stack>
        </React.Fragment>
    )
}