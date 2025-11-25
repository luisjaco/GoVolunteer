import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import GVArea from '@/src/components/GVArea';
import EventCard from '@/src/components/EventCard';

//Temp import

import {Link} from 'expo-router'

import { PRIMARY_COLOR } from '@/src/constants/colors';

export default function MyRSVPsScreen() {
    // Handler for Cancel RSVP button
    const handleCancelRSVP = (eventId: string) => {
        console.log('Cancel RSVP for event:', eventId);
        // TODO: Add actual cancel RSVP logic here
    };

    return (
        <GVArea>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>
                        My RSVPs
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        View your upcoming volunteer events
                    </Text>
                </View>
            </View>

            {/* ScrollView with event cards */}
            <ScrollView style={styles.scrollContainer}>
                {/* Event 1 */}
                <EventCard 
                    showCancelButton={true}
                    onCancelRSVP={() => handleCancelRSVP('1')}
                />

                {/* Event 2 */}
                <EventCard 
                    showCancelButton={true}
                    onCancelRSVP={() => handleCancelRSVP('2')}
                />

                {/* Event 3 */}
                <EventCard 
                    showCancelButton={true}
                    onCancelRSVP={() => handleCancelRSVP('3')}
                />
            </ScrollView>
        </GVArea>
    );

    <View>
        
        <Link href="/">To postEvent Page</Link>
    </View>

}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: PRIMARY_COLOR,
    },
    headerContent: {
        marginRight: 20,
        marginLeft: 20,
    },
    headerTitle: {
        color: 'white',
        paddingTop: 35,
        fontWeight: '500',
        paddingBottom: 10,
        fontSize: 24,
    },
    headerSubtitle: {
        color: 'white',
        fontSize: 14,
        paddingBottom: 20,
        opacity: 0.9,
    },

    // Scroll container
    scrollContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
});