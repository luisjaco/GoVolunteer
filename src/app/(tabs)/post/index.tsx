import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRIMARY_COLOR } from '@constants/colors';
import GVArea from '@/src/components/GVArea';

export default function HomeScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.

    return (
        <GVArea>
            <Text>
                This will be a posting screen. We can probably use a stack to bring someone through
                the different screens of this.
            </Text>
            <Link href='/post/secondPostScreen' push asChild>
                <Button>
                    Push second screen onto stack.
                </Button>
            </Link>
        </GVArea>
    );
}