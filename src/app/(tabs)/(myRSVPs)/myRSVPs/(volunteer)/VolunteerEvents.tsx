import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import GVArea from '@/src/components/GVArea';
import EventCard from '@/src/components/EventCard';
import {PRIMARY_COLOR} from '@/src/constants/colors';
import {storage} from '@/src/utils/storage';
import supabase from '@/src/utils/requests';

export default function MyRSVPsScreen() {
    const [events, setEvents] = useState<Object | undefined>()
    const fetchRSVPEvents = async () => {
        const uid = await storage.get('userUID')
        if (!uid) {
            console.error('[VolunteerEvents] User ID not in storage!')
            return
        }

        const {data, error} = await supabase.from('rsvps')
            .select('events(*, categories(*), users!events_organization_id_fkey(*, organizations(*))), users(*)')
            .eq('volunteer_id', uid)
        if (error != null) {
            console.error('[VolunteerEvents] Failed to fetch RSVPs:', error)
            return
        }
        setEvents(data)
        console.log('[VolunteerEvents] Got data', JSON.stringify(data))
    }

    useEffect(() => void fetchRSVPEvents(), [])

    const header = (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>
                    My Events
                </Text>
                <Text style={styles.headerSubtitle}>
                    View events you've RSVPed to
                </Text>
            </View>

        </View>
    );

    const body = (
        <ScrollView style={styles.scrollContainer}>
            {events?.length > 0
                ? events.map(event => (
                    <EventCard
                        name={event.events.name}
                        event_id={event.events.id}
                        organization_id={event.events.users.organizations.organization_id}
                        categoryName={event.events.categories.name}
                        state={event.events.state}
                        city={event.events.city}
                        maxVolunteers={event.events.max_volunteers}
                        currentVolunteers={event.events.current_volunteers}
                        timestampz={event.events.date_time}
                        organization_title={event.events.users.organizations.title}
                        organization_profile_picture_url={event.events.users.organizations.profile_picture_url}
                        key={event.events.id}
                    />
                ))
                : <Text style={{
                        color: '#555',
                        textAlign: 'center',
                        marginTop: 20
                    }}>You have not RSVPed to any events!</Text>
            }

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
