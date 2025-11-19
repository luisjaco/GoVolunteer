// this will be a wrapper to put your components inside. what is does is create a SafeAreaView with
// the statusbar being the same color as PRIMARY_COLOR, with the inner section (VIEW) being white.
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { PRIMARY_COLOR } from '../constants/colors';

type SafeAreaStatusBarProps = {
    children?: React.ReactNode
};

export default function SafeAreaStatusBar(props: SafeAreaStatusBarProps) {
    return (
        <SafeAreaView style={{
            flex: 1, 
            backgroundColor: PRIMARY_COLOR
        }}
        edges={['top', 'left', 'right']}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                {props.children}
            </View>
        </SafeAreaView>
    )
}