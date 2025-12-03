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
            id,
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

            console.log('[ConfirmEdit] attempting to upload image to\
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
                console.log('[ConfirmEdit] error: uploading user profile image:', error)
                setSupabaseError(true);
                return null;
            }


            const { data } = await supabase
                .storage
                .from('event_images')
                .getPublicUrl(filePath);
            console.log('[ConfirmEdit] image upload success:', data.publicUrl);
            return data.publicUrl;
        }

        return null;
    };

    const updateEvent = async (publicURL: string | null) => {
        console.log('[ConfirmEdit] attempting to insert into events table');

        const dateTimeStamp = new Date(timestampz as string);
        const { error } = await supabase.from('events').update({
            name: name,
            description: description,
            category_id: categoryID,
            image_url: publicURL,
            date_time: dateTimeStamp
        }).eq('id', id);

        if (error) {
            console.log('[ConfirmEdit] error: unsuccessful events table insert',
                error);
            setSupabaseError(true);
            return;
        }

        console.log('[ConfirmEdit] update to events table successful')
        return;
    }

    const handleEditEvent = async () => {
        const uid = await storage.get('userUID');
        
        if (!uid) return;

        let publicURL = imageURI as string || null;
        // if imageFileName is not null it means we are uploading a new image (old image already has
        // a link.)
        if (imageFileName) {
            publicURL = await uploadImage(uid);
        }
            
        if (!supabaseError) {
            updateEvent(publicURL);
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
                id={-1}
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
                    onPress={handleEditEvent}
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
                        Submit Edit
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