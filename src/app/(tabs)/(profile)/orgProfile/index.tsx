import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import GVArea from '@/src/components/GVArea';

export default function OrgProfileScreen() {
    const router = useRouter(); // method used to push a new screen onto a stack.
    
        const handleEditAccount = () => {
            console.log('Edit Account pressed');
            //  navigate to edit profile screen
        };
    
        const handleLogOut = () => {
            console.log('Log Out pressed');
            //  add logout logic
        };
    
        return (
            <GVArea>
                {/*  header section with pfp and user info */}
                <View style={styles.headerSection}>
                    {/* pfp */}
                    <View style={styles.pfpContainer}>
                        <View style={styles.pfp}>
                            <Text style={styles.pfpText}>JD</Text>
                        </View>
                    </View>
    
                    {/* User info */}
                    <Text style={styles.organizationName}>John Doe</Text>
                    <Text style={styles.website}>johndoe@nyit.edu</Text>
                </View>
    
                {/*  section with buttons */}
                <View style={styles.contentSection}>
                    {/* Edit Account button */}
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
            marginBottom: 4,
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