import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import GVArea from '@/src/components/GVArea';
import NavigationBar from '@/src/components/NavigationBar';
import OrganizationCard from '@/src/components/OrganizationCard';
import EventInfo from '@/src/components/EventInfo';
import {router} from "expo-router";
import {storage} from "@utils/storage";
import BackButton from "@components/BackButton";

export default function Event() {
    const [isOrg, setIsOrg] = useState(false);

    useEffect(() => {
        const loadUserType = async () => {
            const userType = await storage.get('userType');
            setIsOrg(userType === 'organization');
        }
        loadUserType();
    }, []);

    const handleRSVP = async (eventId: string) => {
        console.log('RSVP for', eventId);
    }


    return (
        <GVArea>
            <NavigationBar/>
            {/* Scrollable Content */}
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{paddingTop: 30}}
            >
                <EventInfo
                    name={'event name'}
                    description={'event description'}
                    categoryName={'category name'}
                    maxVolunteers={100}
                    currentVolunteers={50}
                    timestampz={''}
                    city={'city'}
                    state={'state'}
                    imageURI={'https://picsum.photos/200'}
                    disabled={false}
                    userType={isOrg ? 'organization' : 'volunteer'}
                    onEdit={() => router.push({pathname: '/myRSVPs/EditEvent', params: {id: 'event id'}})}
                    onRSVP={() => handleRSVP('event id')}
                />
                <OrganizationCard title={''} phone={''} email={''} organizationURL={''} state={''} city={''}/>
            </ScrollView>
        </GVArea>
    );
}