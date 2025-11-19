import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRIMARY_COLOR } from '@constants/colors';
import SafeAreaStatusBar from '@/src/components/SafeAreaStatusBar';

export default function HomeScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.

    return (
        <SafeAreaStatusBar>
            <Text>
                This will be a posting screen. We can probably use a stack to bring someone through
                the different screens of this.
            </Text>
            <Link href='/secondPostScreen' push asChild>
                <Button>
                    Push second screen onto stack.
                </Button>
            </Link>
        </SafeAreaStatusBar>
    );
}