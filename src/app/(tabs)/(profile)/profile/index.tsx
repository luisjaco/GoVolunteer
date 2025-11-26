import GVArea from '@/src/components/GVArea';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Link} from 'expo-router';
import {PRIMARY_COLOR} from '@/src/constants/colors';

export default function HomeScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.

    return (
        <GVArea>
            <Text>
                This will be a profile screen. It will kind of combine both aspects of the Home and
                Post, since it will allow users to both check their posts (given they're an
                organization), or let users see what they've RSVP'd to. All users can also edit
                their profiles here. So we'll reuse the EventModal and also stacks to perform these
                tasks.
            </Text>
            <Link href={"/profile/editProfile"} asChild>
                <Text>
                    Edit Profile
                </Text>
            </Link>
            <Link href={"/profile/editOrgProfile"} asChild>
                <Text>
                    Edit Org Profile
                </Text>
            </Link>
        </GVArea>
    );
}