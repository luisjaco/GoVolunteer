import EventInfo from '@components/EventInfo';
import GVArea from '@components/GVArea';
import { BUTTON_COLOR, PRIMARY_COLOR } from '@constants/colors';
import supabase from '@utils/requests';
import { storage } from '@utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { HelperText } from 'react-native-paper';

export default function ConfirmEvent() {
    const router = useRouter();
    const {
            name,
            description,
            categoryID,
            categoryName,
            maxVolunteers,
            timestampz,
            city,
            state,
            imageFileName,
            imageURI
        } = useLocalSearchParams();

    const [supabaseError, setSupabaseError] = useState(false);

    const uploadImage = async (uid: string): Promise<string | null> => {
        if (imageURI !== null) {
            const res = await fetch(imageURI as string);
            const arrayBuffer = await res.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const [fileName, extension] = (imageFileName as string).split('.') || '';
            const filePath = `${uid}/${fileName}_${Date.now()}.${extension}`;
            const contentType = `image/${extension}`;

            console.log('[ConfirmPost] attempting to upload image to\
 event_images:', filePath)
            const { error } = await supabase.storage
                .from('event_images')
                .upload(
                    filePath,
                    uint8Array,
                    {
                        contentType: contentType,
                        upsert: true,
                    }
                );

            if (error) {
                console.log('[ConfirmPost] error: uploading user profile image:', error)
                setSupabaseError(true);
                return null;
            }


            const { data } = await supabase
                .storage
                .from('event_images')
                .getPublicUrl(filePath);
            console.log('[ConfirmPost] image upload success:', data.publicUrl);
            return data.publicUrl;
        }

        return null;
    };

    const insertToEvents = async (uid: string, publicURL: string | null) => {
        console.log('[ConfirmPost] attempting to insert into events table');

        const dateTimeStamp = new Date(timestampz as string);
        const { error } = await supabase.from('events').insert({
            organization_id: uid,
            name: name,
            description: description,
            category_id: categoryID,
            state: state,
            city: city,
            max_volunteers: maxVolunteers,
            image_url: publicURL,
            date_time: dateTimeStamp
        }).single();

        if (error) {
            console.log('[ConfirmPost] error: unsuccessful events table insert',
                error);
            setSupabaseError(true);
            return;
        }

        console.log('[ConfirmPost] insert into events table successful')
        return;
    }

    const handlePostEvent = async () => {
        const uid = await storage.get('userUID');
        
        if (!uid) return;

        let publicURL = null;
        if (imageURI) {
            publicURL = await uploadImage(uid);
        }
            
        if (!supabaseError) {
            insertToEvents(uid, publicURL);
        };

        setSupabaseError(false);
        router.dismissAll();
    }


    const header = (
        <React.Fragment>
            <View style={{
                backgroundColor: PRIMARY_COLOR,
                height: '15%',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: "center",
                alignContent: "center",
            }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: "500",
                    color: "white",
                    marginTop: 15
                }}>Review your event</Text>
            </View>
        </React.Fragment>
    )

    const body = (
        <ScrollView style ={{
            flex: 1,
            display: 'flex',
        }}>
            <View>
                <EventInfo
                name={name as string}
                description={description as string}
                categoryName={categoryName as string}
                maxVolunteers={Number(String(maxVolunteers))}
                currentVolunteers={0}
                timestampz={timestampz as string}
                city={city as string}
                state={state as string}
                imageURI={imageURI as string}
                disabled={true}
            />
            <HelperText type='info' style={{alignItems: 'center', alignSelf: 'center'}}>
                This is how users will see your event.
            </HelperText>
            </View>
            
            <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={handlePostEvent}
                    style={{
                        backgroundColor: BUTTON_COLOR,
                        width: '60%',
                        paddingVertical: 12,
                        marginVertical: '10%',
                        borderRadius: 10,
                        alignItems: "center",
                        alignSelf: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "600",
                            fontSize: 16,
                            color: "white",
                        }}
                    >
                        Post Event
                    </Text>
                </TouchableOpacity>
        </ScrollView>
    )

    return (
        <GVArea>
            {header}
            {body}
        </GVArea>
    )
}