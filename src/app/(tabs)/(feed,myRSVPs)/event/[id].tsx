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
    const [event, setEvent] = useState()
    const [userType, setUserType] = useState<string>()
    const {id} = useGlobalSearchParams()
    const organization = event?.users?.organizations

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
            console.error(`/event/${id} -- Failed to fetch event info:`, error)
            return
        }
        setEvent(data[0])
        console.log(`/event/${id} -- Got data`, data[0])
    }

    useEffect(() => void fetchEventInfo(), [])

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
                            name={event.name}
                            description={event.description}
                            maxVolunteers={event.max_volunteers}
                            currentVolunteers={event.current_volunteers}
                            timestampz={event.date_time}
                            city={event.city}
                            state={event.state}
                            imageURI={event.image_url}
                            categoryName={event.categories?.name}
                        />
                }
                {organization
                    && <OrganizationCard
                            title={organization.title}
                            phone={organization.phone}
                            email={event.users.email}
                            organizationURL={organization.organization_url}
                            city={organization.city}
                            state={organization.state}
                        />
                }
            </ScrollView>
        </GVArea>
    );
}
