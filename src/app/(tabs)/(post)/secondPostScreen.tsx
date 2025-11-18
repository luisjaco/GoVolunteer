import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function HomeScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.

    return (
        <View>
            <Text>
                The second screen in question ;).
            </Text>
        </View>
    );
}