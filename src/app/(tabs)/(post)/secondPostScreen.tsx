import SafeAreaStatusBar from '@/src/components/SafeAreaStatusBar';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text } from 'react-native-paper';

export default function HomeScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.

    return (
        <SafeAreaStatusBar>
            <Text>
                The second screen in question ;).
            </Text>
        </SafeAreaStatusBar>
    );
}