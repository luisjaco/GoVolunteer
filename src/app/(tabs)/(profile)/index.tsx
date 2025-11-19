import SafeAreaStatusBar from '@/src/components/SafeAreaStatusBar';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.

    return (
        <SafeAreaStatusBar>
            <Text>
                This will be a profile screen. It will kind of combine both aspects of the Home and
                Post, since it will allow users to both check their posts (given they're an 
                organization), or let users see what they've RSVP'd to. All users can also edit
                their profiles here. So we'll reuse the EventModal and also stacks to perform these
                tasks.
            </Text>
        </SafeAreaStatusBar>
    );
}