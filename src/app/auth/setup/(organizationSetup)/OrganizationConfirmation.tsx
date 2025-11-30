import { View, Image, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import supabase from '@utils/requests';
import GVArea from '@/src/components/GVArea';
import { PRIMARY_COLOR, BUTTON_COLOR, BUTTON_DISABLED } from '@constants/colors';
import { useLocalSearchParams } from 'expo-router';
import { HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OrganizationCard from '@/src/components/OrganizationCard';
import { storage } from '@utils/storage';

export default function VolunteerConfirmation() {
    const [supabaseError, setSupabaseError] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [creatingProfile, setCreatingProfile] = useState(false);
    const [email, setEmail] = useState('ERROR');
    const [uid, setUID] = useState('');
    const router = useRouter();

    // here grab the previously defined parameters from VolunteerSetup.
    // console.log('params: ', useLocalSearchParams());
    const {
        title,
        motto,
        phone,
        organizationURL,
        state,
        city,
        address,
        description,
        profilePictureFileName,
        profilePictureURI
    } = useLocalSearchParams();

    const fetchSession = async () => {
        console.log('[OrganizationConfirmation] fetching user session');
        const session = await supabase.auth.getSession();
        setSession(session);
        // console.log(session.data);
        setEmail(session.data.session?.user.email || 'ERROR');
        setUID(session.data.session?.user.id || '');
    }

    const uploadImage = async (): Promise<string | null> => {
        const res = await fetch(profilePictureURI as string);
        const arrayBuffer = await res.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const [fileName, extension] = (profilePictureFileName as string).split('.') || '';
        const filePath = `${uid}/${fileName}_${Date.now()}.${extension}`;
        const contentType = `image/${extension}`;

        console.log('[OrganizationConfirmation] attempting to upload image to\
 organization_profile_images:', filePath)
        const { error } = await supabase.storage
            .from('organization_profile_images')
            .upload(
                filePath,
                uint8Array,
                {
                    contentType: contentType,
                    upsert: true,
                }
            );

        if (error) {
            console.log('[OrganizationConfirmation] error: uploading user profile image:', error)
            setSupabaseError(true);
            return null;
        }


        const { data } = await supabase.storage.from('organization_profile_images').getPublicUrl(filePath);
        console.log('[OrganizationConfirmation] image upload success:', data.publicUrl);
        return data.publicUrl
    };

    const insertToUsers = async (): Promise<boolean | null> => {

        console.log('[OrganizationConfirmation] attemping to insert into users table. ');
        const { error } = await supabase.from('users').insert({
            id: uid,
            email: email,
            is_organization: true
        }).single();

        if (error) {
            console.log('[OrganizationConfirmation] error: unsuccessful users table insert', error)
            setSupabaseError(true);
            return false;
        }

        console.log('[OrganizationConfirmation] insert into users table successful.')
        return true;
    }

    const insertToOrganizations = async (publicImageURL?: string) => {

        console.log('[OrganizationConfirmation] attempting to insert into organizations table');
        const { error } = await supabase.from('organizations').insert({
            user_id: uid,
            title: title,
            motto: motto,
            phone: phone,
            organization_url: organizationURL,
            state: state,
            city: city,
            address: address,
            description: description,
            profile_picture_url: publicImageURL
        }).single();

        if (error) {
            console.log('[OrganizationConfirmation] error: unsuccessful organizations table insert',
                error);
            setSupabaseError(true);
            return;
        }

        console.log('[OrganizationConfirmation] insert into organizations table successful')
        return;
    }

    const handleSubmit = async () => {
        /* we will create inserts on the following tables:
            user_profile_images: upload profile image (if applicable)
            users : email & pass
            volunteers : standard volunteer info
        */

        setCreatingProfile(true);

        let publicImageURL: string | null = null;
        if (profilePictureURI && profilePictureFileName) {
            publicImageURL = await uploadImage();
        }


        const insertToUserSuccess = await insertToUsers();

        if (insertToUserSuccess && !supabaseError) {
            await insertToOrganizations(publicImageURL ? publicImageURL : undefined);
            setSupabaseError(false);
        }

        setCreatingProfile(false);
        console.log(`[OrganizationConfirmation] setting uid:${uid} & userType with \
is_organization:true`);
        await storage.set('userUID', uid);
        await storage.set('userType', 'organization');
        router.dismissAll();
        router.replace('/(tabs)/(feed)');
    };

    useEffect(() => {
        fetchSession();
    }, []);

    const header = (

        <View
            style={{
                paddingVertical: 20,
                backgroundColor: PRIMARY_COLOR,
                flex: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View style={{
                width: 250,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Image
                    source={require('@/assets/icons/earthLogo.png')}
                    style={{
                        width: 50,
                        height: 50,
                        marginRight: 10
                    }}
                />
                <Text
                    style={{
                        fontWeight: "800",
                        fontSize: 32,
                        textAlign: "center",
                        color: 'white'
                    }}
                >
                    GoVolunteer
                </Text>
            </View>

        </View>
    );

    const submitButton = (
        <TouchableOpacity
            activeOpacity={.4}
            style={{
                backgroundColor: (creatingProfile ? BUTTON_DISABLED : BUTTON_COLOR),
                borderRadius: 10,
                alignItems: "center",
                justifyContent: 'center',
                height: 45,
                width: '50%',
            }}
            onPress={handleSubmit}
            disabled={creatingProfile}
        >
            <Text style={{ fontWeight: "600", fontSize: 16, color: "white" }}>
                Create Organization!
            </Text>
        </TouchableOpacity>
    );

    const body = (
        <View
            style={{
                width: '100%',
                height: '80%',
                display: 'flex',
                justifyContent: 'space-around',
                alignContent: 'center',
                alignItems: 'center'
            }}>

            <OrganizationCard
                title={title as string}
                motto={(motto) ? motto as string : undefined}
                phone={phone as string}
                email={email}
                organizationURL={organizationURL as string}
                state={state as string}
                city={city as string}
                address={(address) ? address as string : undefined}
                description={(description) ? description as string : undefined}
                profilePictureURI={(profilePictureURI !== null) ?
                    profilePictureURI as string : undefined}
            />

            <View
                style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                {submitButton}
                <HelperText type="error" visible={supabaseError}>
                    There was an error creating your account, please try again.
                </HelperText>
                <HelperText type='info' style={{ fontSize: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>All</Text> volunteers & fellow organizations
                    can view this information.
                </HelperText>
            </View>
        </View>
    )


    return (
        <GVArea>
            {header}
            {body}
        </GVArea>
    )
}