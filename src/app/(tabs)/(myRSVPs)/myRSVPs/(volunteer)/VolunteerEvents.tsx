import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import GVArea from '@/src/components/GVArea';
import EventCard from '@/src/components/EventCard';
import {PRIMARY_COLOR} from '@/src/constants/colors';
import {storage} from '@/src/utils/storage';
import supabase from '@/src/utils/requests';

export default function MyRSVPsScreen() {
    const [events, setEvents] = useState<Object[] | null>(null)
    const fetchRSVPEvents = async () => {
        const uid = await storage.get('userUID')
        if (!uid) {
            console.error('[VolunteerEvents] User ID not in storage!')
            return
        }

        const {data, error} = await supabase.from('rsvps')
            .select(`
                events(
                    *,
                    categories(*), 
                    users!events_organization_id_fkey(
                        *, 
                        organizations(*)
                        )
                    ), 
                users(*)
                `)
            .eq('volunteer_id', uid)
            .order('created_at', {ascending: false, referencedTable:'events'})
        if (error != null) {
            console.error('[VolunteerEvents] Failed to fetch RSVPs:', error)
            return
        }
        setEvents(data);
        console.log('[VolunteerEvents] fetched event data.')
    }

    useEffect(() => void fetchRSVPEvents(), [])

    useEffect( () => {
        // update events on frontend when it is updated.
        const deleteChannel = supabase.channel('volunteerEvents-delete');
        deleteChannel.on('postgres_changes', 
            {
                event: "DELETE", 
                schema: 'public', 
                table: 'rsvps'
            }, 
            () => {
                fetchRSVPEvents();
            }
        ).subscribe((status) => {
            console.log('[VolunteerEvents]', status, 'to live rsvp deletes')
        });

        const insertChannel = supabase.channel('volunteerEvents-insert');
        insertChannel.on('postgres_changes', 
            {
                event: "INSERT", 
                schema: 'public', 
                table: 'rsvps'
            }, 
            () => {
                fetchRSVPEvents();
            }
        ).subscribe((status) => {
            console.log('[VolunteerEvents]', status, 'to live rsvp inserts')
        });
    }, []);

    const header = (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>
                    My RSVPs
                </Text>
                <Text style={styles.headerSubtitle}>
                    View events you've RSVPed to
                </Text>
            </View>

        </View>
    );

    const body = (
        <ScrollView style={styles.scrollContainer}>
            {(events && events.length > 0)? 
                (events as any[]).map((e) => (
                    <EventCard
                        name={e.events.name}
                        event_id={e.events.id}
                        organization_id={e.events.users.organizations.organization_id}
                        categoryName={e.events.categories.name}
                        state={e.events.state}
                        city={e.events.city}
                        maxVolunteers={e.events.max_volunteers}
                        currentVolunteers={e.events.current_volunteers}
                        timestampz={e.events.date_time}
                        organization_title={e.events.users.organizations.title}
                        organization_profile_picture_url={e.events.users.organizations.profile_picture_url}
                        key={e.events.id}
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
    },
});
