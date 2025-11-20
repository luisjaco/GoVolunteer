import GVArea from '@/src/components/GVArea';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.

    return (
        <GVArea>
            <Text>
                MYRSVP SCREEN.
            </Text>
        </GVArea>
    );
}