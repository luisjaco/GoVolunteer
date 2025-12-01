import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import GVArea from '@/src/components/GVArea';
import supabase, { Organization } from '@/src/utils/requests';
import { storage } from '@/src/utils/storage';
import OrganizationCard from '@/src/components/OrganizationCard';
import { Avatar, HelperText } from 'react-native-paper';

export default function ViewOrganizationProfile() {

    // todo , fetch logic, 
    const router = useRouter(); // method used to push a new screen onto a stack.
    const [organization, setOrganization] = useState<Organization>();
    const [email, setEmail] = useState('');
    const [id, setID] = useState('');

    const fetchOrganizationInfo = async (uid: string) => {
        const { data, error } = await supabase.from('organizations').select('*').eq('user_id', uid)

        console.log('[ViewOrganizationProfile] grabbing information from organizations table');
        if (error || data.length === 0) {
            console.log('[ViewOrganizationProfile] error: grabbing from organizations table', error);
            return;
        }
        else {
            setOrganization(data[0]);
        }
    }

    const fetchEmail = async () => {
        const { data, error } = await supabase.from('users').select('*');

        console.log('[ViewOrganizationProfile] grabbing information from users table');
        if (error || data.length === 0) {
            console.log('[ViewOrganizationProfile] error: grabbing from users table', error);
            return;
        }
        else {
            setEmail(data[0].email);
            setID(data[0].id)
        }
    }

    const handleEditAccount = () => {
        router.push({
            pathname: '/profile/EditOrganizationProfile',
            params: {...organization, id: id}
        });
    };

    const handleLogOut = () => {
        console.log('Log Out pressed');
        //  add logout logic
    };

    const gatherOrganizationInfo = async () => {
        const uid = await storage.get('userUID') || 'ERROR';
        await fetchOrganizationInfo(uid);
        await fetchEmail();
    }

    useEffect(() => {
        gatherOrganizationInfo();
    }, []);

    useEffect( () => {
        // update organization on frontend when it is updated.
        const channel = supabase.channel('organization-channel');
        channel.on('postgres_changes', 
            {
                event: "UPDATE", 
                schema: 'public', 
                table: 'organizations'
            }, 
            (payload) => {
                const updateOrganization = payload.new as Organization;
                setOrganization(updateOrganization);
            }
        ).subscribe((status) => {
            console.log('[ViewOrganizationProfile]', status, 'to live profile changes')
        });
    }, []);

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
                source={(organization?.profile_picture_url ? 
                    { uri: organization?.profile_picture_url } :
                    require('@/assets/icons/default-organization.png')
                )}/>

            <Text style={styles.organizationName}>{organization?.title}</Text>
            <Text style={styles.website}>{email}</Text>
        </View>
    );

    const body = (
        <View style={{alignItems: 'center', marginTop: '2%'}}>
            {(organization && email) && (
                <OrganizationCard
                    title={organization.title}
                    motto={organization.motto}
                    phone={organization.phone}
                    email={email}
                    organizationURL={organization.organization_url}
                    state={organization.state}
                    city={organization.city}
                    description={organization.description}
                    profilePictureURL={organization.profile_picture_url}
                />
            )}
            <HelperText type='info' style={{alignItems: 'center'}}>
                This is how volunteers & fellow organizations see you.
            </HelperText>
        </View>
    );

    const buttons = (
        <View 
            style={{
                marginTop: '2%',
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
            <View style={{flex: 1, alignItems:'center'}}>
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
    organizationName: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        marginVertical: 5,
    },
    website: {
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