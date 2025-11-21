import GVArea from '@/src/components/GVArea';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text } from 'react-native-paper';

export default function HomeScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.

    return (
        <GVArea>
            <Text>
                The second screen in question ;).
            </Text>
        </GVArea>
    );
}