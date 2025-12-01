import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import GVArea from '@/src/components/GVArea';
import EventCard from '@/src/components/EventCard';

//Temp import

import { Link } from 'expo-router'

import { PRIMARY_COLOR } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function MyRSVPsScreen() {

    const header = (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>
                    My Events
                </Text>
                <Text style={styles.headerSubtitle}>
                    View your posted events
                </Text>
            </View>
            <Link href='/myRSVPs/PostEvent' push asChild>
                <TouchableOpacity activeOpacity={.6}>
                    <Ionicons
                        name='add-circle-outline'
                        style={{ color: 'white' }}
                        size={40}
                    />
                </TouchableOpacity>
            </Link>

        </View>
    );

    const body = (
        <ScrollView style={styles.scrollContainer}>
            <EventCard
                organization_id={''}
                categoryName={'f'}
                description={'f'}
                state={'f'}
                city={'f'}
                max_volunteers={0}
                current_volunteers={0}
                image_url={'f'}
                date={'f'}
                time={'f'}
                organization_title={'SAMPLE'}
            />

        </ScrollView>
    )

    return (
        <GVArea>
            {header}
            {body}
        </GVArea>
    );



}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: PRIMARY_COLOR,
        height: '15%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5%'
    },
    headerContent: {
    },
    headerTitle: {
        color: 'white',
        fontWeight: '500',
        paddingBottom: 5,
        fontSize: 24,
    },
    headerSubtitle: {
        color: 'white',
        fontSize: 14,
        opacity: 0.9,
    },

    // Scroll container
    scrollContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
});