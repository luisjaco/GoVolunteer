import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import GVArea from '@/src/components/GVArea';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import supabase, { Volunteer } from '@/src/utils/requests';
import { storage } from '@/src/utils/storage';
import VolunteerCard from '@components/VolunteerCard';
import { Avatar, HelperText } from 'react-native-paper';

export default function ProfileScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.
    const [volunteer, setVolunteer] = React.useState<Volunteer | null>(null);
    const [email, setEmail] = React.useState('');

    const fetchVolunteerInfo = async (uid: string) => {
        const { data, error } = await supabase.from('volunteers').select('*').eq('user_id', uid)

        console.log('[ViewVolunteerProfile] grabbing info from volunteers table');
        if (error || data?.length === 0) {
            console.log('[ViewVolunteerProfile] error: grabbing from volunteers table', error);
            return;
        } else {
            setVolunteer(data[0]);
        }
    }

    const fetchEmail = async (uid: string) => {
        const { data, error } = await supabase.from('users').select('email').eq('id', uid).single();

        console.log('[ViewVolunteerProfile] grabbing information from users table');
        if (error || !data) {
            console.log('[ViewVolunteerProfile] error: grabbing from users table', error);
            return;
        }
        else {
            setEmail(data.email ?? '');
        }
    }

    const handleEditAccount = () => {
        router.push({
            pathname: '/profile/EditVolunteerProfile',
            params: { ...volunteer }
        });
        //  navigate to edit profile screen
    };

    const handleLogOut = async () => {
        await storage.removeItem('userUID');
        await storage.removeItem('userType');
        await supabase.auth.signOut();
        console.log('logging out...');
        router.replace('/Splash');
    };

    const gatherVolunteerInfo = async () => {
        const uid = (await storage.get('userUID')) || 'ERROR';
        await fetchVolunteerInfo(uid);
        await fetchEmail(uid);
    };

    useEffect( () => {
        gatherVolunteerInfo();
    }, []);
    
    useEffect( () => {
        // update volunteer on frontend when it is updated.
        const channel = supabase.channel('volunteerView-update');
        channel.on('postgres_changes', 
            {
                event: "UPDATE", 
                schema: 'public', 
                table: 'volunteers'
            }, 
            (payload) => {
                const updateVolunteer = payload.new as Volunteer;
                setVolunteer(updateVolunteer);
            }
        ).subscribe((status) => {
            console.log('[ViewVolunteerProfile]', status, 'to live profile changes')
        });
    }, [])

    const header = (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '35%',
            backgroundColor: PRIMARY_COLOR,
        }}>
            <Avatar.Image
                size={128}
                source={(volunteer?.profile_picture_url ?
                    { uri: volunteer?.profile_picture_url } :
                    require('@/assets/icons/default-volunteer.png')
                )}
            />

            <Text style={styles.volunteerName}>{volunteer?.first_name}</Text>
            <Text style={styles.volunteerEmail}>{email}</Text>
        </View>
    );

    const body = (
        <View style={{ alignItems: 'center', marginTop: '2%', width: '80%' }}>
            {(volunteer && email) && (
                <VolunteerCard
                    firstName={volunteer.first_name}
                    lastName={volunteer.last_name}
                    email={email}
                    age={volunteer.age}
                    gender={volunteer.gender}
                    phone={volunteer.phone}
                    profilePictureURL={volunteer.profile_picture_url}
                />
            )}
            <HelperText type='info' style={{ alignItems: 'center' }}>
                This is how organizations & fellow volunteers see you.
            </HelperText>
        </View>
    );

    const buttons = (
        <View
            style={{
                marginTop: '5%',
                display: 'flex',
                width: '80%',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center'
            }}
        >
            <Pressable style={styles.button} onPress={handleEditAccount}>
                <Ionicons name="settings-outline" size={24} color="#333" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Edit Account</Text>
                <View style={styles.buttonSpacer} />
            </Pressable>

            {/* log Out button */}
            <Pressable style={styles.button} onPress={handleLogOut}>
                <Ionicons name="log-out-outline" size={24} color="#333" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Log Out</Text>
                <View style={styles.buttonSpacer} />
            </Pressable>
        </View>
    );

    return (
        <GVArea>
            <View style={{ flex: 1, alignItems: 'center' }}>
                {header}
                {body}
                {buttons}
            </View>
        </GVArea>
    );
}

const styles = StyleSheet.create({
    headerSection: {
        backgroundColor: PRIMARY_COLOR,
        paddingTop: 20,
        paddingBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pfpContainer: {
        marginBottom: 16,
    },
    pfp: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: PRIMARY_COLOR,
        borderWidth: 4,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pfpText: {
        color: 'white',
        fontSize: 36,
        fontWeight: '600',
    },
    volunteerName: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 4,
    },
    volunteerEmail: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
        opacity: 0.9,
    },
    contentSection: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 16,
    },
    buttonIcon: {
        marginRight: 12,
    },
    buttonText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
    },
    buttonSpacer: {
        width: 24,
        marginLeft: 12,
    },
});