import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function HomeLayout(){
    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <Stack/>
        </React.Fragment>
    )
}