import EventInfo from "@/src/components/EventInfo";
import GVArea from "@/src/components/GVArea";
import NavigationBar from "@/src/components/NavigationBar";
import supabase from "@/src/utils/requests";
import {storage} from "@/src/utils/storage";
import {useGlobalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {ScrollView, Text} from "react-native";

export default function EventInfoPage() {
    const [event, setEvent] = useState()
    const [userType, setUserType] = useState<string>()
    const {id} = useGlobalSearchParams()

    const getUserType = async () => {
        const userType = await storage.get('userType');
        setUserType(userType ?? '')
    }
    useEffect(() => void getUserType, [userType])

    const fetchEventInfo = async () => {
        const {data: eventData, error: eventError} = await supabase.from('events')
            .select('*, categories (*)')
            .eq('id', id)
        if (eventError != null || eventData.length < 1) {
            console.error(`/event/${id} -- Failed to fetch event info:`, eventError)
            return
        }
        setEvent(eventData[0])
        console.log(`/event/${id} -- Got data`, eventData[0])
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
            </ScrollView>
        </GVArea>
    );
}
