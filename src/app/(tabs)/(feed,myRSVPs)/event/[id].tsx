import EventInfo from "@/src/components/EventInfo";
import GVArea from "@/src/components/GVArea";
import NavigationBar from "@/src/components/NavigationBar";
import OrganizationCard from "@/src/components/OrganizationCard";
import supabase from "@/src/utils/requests";
import {storage} from "@/src/utils/storage";
import {useGlobalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {ScrollView, Text} from "react-native";

export default function EventInfoPage() {
    const [event, setEvent] = useState<any>()
    const [userType, setUserType] = useState<string>()
    const {id} = useGlobalSearchParams()
    const [organization, setOrganization] = useState<any>();

    const getUserType = async () => {
        const userType = await storage.get('userType');
        setUserType(userType ?? '')
    }
    
    useEffect(() => void getUserType, [userType])

    const fetchEventInfo = async () => {
        const {data, error} = await supabase.from('events')
            .select('*, categories (*), users!events_organization_id_fkey (email, organizations (*))')
            .eq('id', id)
        if (error != null || data.length < 1) {
            console.log(`[/event/${id}] -- Failed to fetch event info:`, error)
            return
        }
        setEvent(data[0]);
        setOrganization(data[0].users.organizations);
        console.log(`[/event/${id}] successfully fetched event info`)
    }

    useEffect(() => void fetchEventInfo(), [])
    
    useEffect(() => {
        // update events on frontend when it is updated.
        const deleteChannel = supabase.channel('events/[id]-delete');
        deleteChannel.on('postgres_changes', 
            {
                event: "DELETE", 
                schema: 'public', 
                table: 'rsvps'
            }, 
            () => {
                fetchEventInfo();
            }
        ).subscribe((status) => {
            console.log(`[events/${id}]' ${status} 'to live rsvp deletes`)
        });

        const insertChannel = supabase.channel('events/[id]-insert');
        insertChannel.on('postgres_changes', 
            {
                event: "INSERT", 
                schema: 'public', 
                table: 'rsvps'
            }, 
            () => {
                fetchEventInfo();
            }
        ).subscribe((status) => {
            console.log(`[events/${id}] ${status} to live rsvp inserts`)
        });
    }, []);

    return (
        <GVArea>
            <NavigationBar/>
            {/* Scrollable Content */}
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{paddingTop: 30}}
            >
                {event
                    && <EventInfo 
                            id={Number(id)}
                            name={event.name as string}
                            description={event.description}
                            maxVolunteers={event.max_volunteers}
                            currentVolunteers={event.current_volunteers}
                            timestampz={event.date_time}
                            city={event.city}
                            state={event.state}
                            imageURI={event.image_url}
                            categoryName={event.categories?.name}
                            organization_id={event.organization_id}
                        />
                }
                {organization
                    && <OrganizationCard
                            id={organization.user_id}
                            title={organization.title}
                            phone={organization.phone}
                            email={event.users.email}
                            organizationURL={organization.organization_url}
                            profilePictureURI={organization.profile_picture_url}
                            city={organization.city}
                            state={organization.state}
                            motto={organization.motto}
                        />
                }
            </ScrollView>
        </GVArea>
    );
}
