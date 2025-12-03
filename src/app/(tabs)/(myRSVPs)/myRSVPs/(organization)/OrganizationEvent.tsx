import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import GVArea from '@/src/components/GVArea';
import EventCard from '@/src/components/EventCard';

import { useState, useEffect } from 'react';
import { Link } from 'expo-router'
import { Event } from '@/src/utils/requests';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import supabase from '@/src/utils/requests';
import { storage } from '@/src/utils/storage';

type EventExtended = Event & {
    organization_title: string,
    organization_profile_url: string,
    category_name: string
}

export default function MyRSVPsScreen() {

    const [events, setEvents] = useState<EventExtended[]>();
    const [uid, setUID] = useState('');

    const fetchEvents = async (NewUID?: string) => {

        const id = uid ? uid : NewUID;
        console.log('[Feed] grabbing information from organizations table');

        const { data, error } = await supabase
            .from('events')
            .select(`
        id,
        name,
        created_at,
        organization_id,
        description,
        state,
        city,
        max_volunteers,
        current_volunteers,
        image_url,
        date_time,
        category_id,
        categories (
          id,
          name
        ),
        users!events_organization_id_fkey (
          id,
          organizations (
            user_id,
            title,
            profile_picture_url
            )
        )
        `).order('created_at', { ascending: true })
            .eq('organization_id', id);


        if (error || data.length === 0) {
            console.log('[Feed] error: grabbing from organizations table', error);
            return;
        }
        else {
            const events: EventExtended[] = data.map((e) => ({
                id: e.id as number,
                name: e.name as string,
                organization_id: e.organization_id as string,
                category_id: e.category_id as number,
                category_name: (e.categories as any).name as string,
                description: e.description as string,
                state: e.state as string,
                city: e.city as string,
                max_volunteers: e.max_volunteers as number,
                current_volunteers: e.current_volunteers as number,
                image_url: e.image_url as string,
                date_time: e.date_time as Date,
                organization_title: (e.users as any).organizations.title as string || '',
                organization_profile_url: (e.users as any).organizations.profile_picture_url as string || '',
            }));

            setEvents(events);


        }
    }

    const init = async () => {
        const uid = await storage.get('userUID') || "ERROR";
        setUID(uid);
        fetchEvents(uid);
    }
    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        // update events on frontend when it is updated.
        const insertChannel = supabase.channel('organizationEvents-insert');
        insertChannel.on('postgres_changes',
            {
                event: "INSERT",
                schema: 'public',
                table: 'events'
            },
            () => {
                fetchEvents();
            }
        ).subscribe((status) => {
            console.log('[OrganizationEvent]', status, 'to live event changes')
        });

        const updateChannel = supabase.channel('organizationEvents-update');
        updateChannel.on('postgres_changes',
            {
                event: "UPDATE",
                schema: 'public',
                table: 'events'
            },
            () => {
                fetchEvents();
            }
        ).subscribe((status) => {
            console.log('[OrganizationEvent]', status, 'to live event changes')
        });
        
        const deleteChannel = supabase.channel('organizationEvents-delete');
        deleteChannel.on('postgres_changes', 
            {
                event: "DELETE", 
                schema: 'public', 
                table: 'events'
            }, 
            () => {
                fetchEvents();
            }
        ).subscribe((status) => {
            console.log('[OrganizationEvent]', status, 'to live event deletes')
        });
    }, []);


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

  const feed = (
    <ScrollView>
      {events?.map((event, key) => (
        <EventCard
          key={key}
          event_id={event.id}
          name={event.name}
          organization_id={event.organization_id}
          categoryName={event.category_name}
          description={event.description}
          state={event.state}
          city={event.city}
          maxVolunteers={event.max_volunteers}
          currentVolunteers={event.current_volunteers}
          imageURI={event.image_url}
          timestampz={event.date_time.toString()}
          organization_profile_picture_url={event.organization_profile_url}
          organization_title={event.organization_title}
        />
      ))}
    </ScrollView>
  )
    return (
        <GVArea>
            {header}
            {feed}
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