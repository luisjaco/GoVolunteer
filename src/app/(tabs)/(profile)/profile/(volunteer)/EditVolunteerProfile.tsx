import React, { useState, useEffect } from "react";
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import type { AlertButton } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {
    Avatar, HelperText,
    Text,
    TextInput,
} from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import GVArea from "@components/GVArea";
import { PRIMARY_COLOR, SECONDARY_COLOR, BUTTON_COLOR } from "@constants/colors";
import supabase, { Volunteer } from "@utils/requests";
import { useRouter } from "expo-router";
import { storage } from "@utils/storage";
import BackButton from '../../../../../components/BackButton'
import { ImagePickerAsset } from "expo-image-picker";


type Gender = 'male' | 'female' | 'other' | null;
type GenderOptionValue = Exclude<Gender, null>;
type GenderOption = {
    value: GenderOptionValue;
    label: string;
};

const GENDER_OPTIONS: GenderOption[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

const BUCKET_NAME = 'user_profile_images';



export default function EditProfileScreen() {
    const router = useRouter();
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<Gender>(null);
    // const [loading, setLoading] = useState(true);
    const [newProfilePicture, setNewProfilePicture] = useState<ImagePickerAsset | string | null>(null);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [ageError, setAgeError] = useState(false);
    const [supabaseError, setSupabaseError] = useState(false);

    // will return true if all fields are valid.
    const validateForm = (): boolean => {
        // error is false if valid.. true if invalid.
        const firstNameValid = Boolean(firstName);
        setFirstNameError(!firstNameValid);

        const lastNameValid = Boolean(lastName);
        setLastNameError(!lastNameValid);

        let phoneValid = true;
        const phoneRegEx = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
        if (phone) {
            phoneValid = phoneRegEx.test(phone);
        }
        setPhoneError(!phoneValid);

        // input is numeric so it should be impossible to input anything but a number
        let ageValid = true;
        if (age) {
            const ageNum = Number(age);
            ageValid = (ageNum > 0) && (ageNum < 120); // we don't want any 120 year olds in here.
        }
        setAgeError(!ageValid);

        return (firstNameValid && lastNameValid && phoneValid && ageValid);
    };

    const fetchVolunteerInfo = async (uid: string) => {
        const { data, error } = await supabase.from('volunteers').select('*').eq('user_id', uid)

        console.log('[EditVolunteerProfile] grabbing info from volunteers table');

        if (error || !data || data.length === 0) {
            console.log('[EditVolunteerProfile] error: grabbing from volunteers table', error);
            return;
        }

        const v = data[0] as Volunteer;
        setVolunteer(v);

        setFirstName(v.first_name ?? '');
        setLastName(v.last_name ?? '');
        setPhone(v.phone ?? '');
        setAge(v.age != null ? String(v.age) : '');
        setGender(v.gender ?? null);
        setNewProfilePicture(v.profile_picture_url ?? null);
    };

    // const fetchEmail = async (uid: string) => {
    //     const { data, error } = await supabase.from('users').select('email').eq('id', uid).single();

    //     console.log('[EditVolunteerProfile] grabbing information from users table');

    //     if (error || !data) {
    //         console.log('[EditVolunteerProfile] error: grabbing from users table', error);
    //         return;
    //     } else {
    //         setEmail(data.email ?? '');
    //     }
    // };

    const handleSave = async () => {
        try {
            //setLoading(true);
            if (!validateForm()) {
                return;
            }
            const uid = await storage.get('userUID');

            if (!uid) {
                // Alert.alert('Error', 'Something went wrong while saving your changes. Please try logging in again.');
                // setLoading(false);
                setSupabaseError(true);
                return;
            }


            let filePath = null;
            if (typeof newProfilePicture === 'string') {
                filePath = newProfilePicture;
            } else if (newProfilePicture !== null) {
                filePath = await uploadImage(uid);
            }

            const { error: volunteerError } = await supabase.from('volunteers').update({
                first_name: firstName || null,
                last_name: lastName || null,
                phone: phone || null,
                age: age,
                gender: gender ?? null,
                profile_picture_url: filePath,
            }).eq('user_id', uid);

            if (volunteerError) {
                console.log('[EditVolunteerProfile] error: updating volunteers table', volunteerError);
                Alert.alert('Error', 'Something went wrong while saving your changes.');
                // setLoading(false);
                setSupabaseError(true);
                return;
            }

            // const { error: userError } = await supabase.from('users').update({
            //     email: email || null,
            // }).eq('id', uid);

            // if (userError) {
            //     console.log('[EditVolunteerProfile] error: updating users table', userError);
            //     Alert.alert('Error', 'Something went wrong while saving your changes.');
            //     // setLoading(false);
            //     return;
            // }

            // await fetchVolunteerInfo(uid);
            // await fetchEmail(uid);
            // setLoading(false);

            // Alert.alert('Success', 'Your changes have been saved.',[
            //     {text: 'OK', onPress: () => router.back()},
            // ]);
            setSupabaseError(false);
            router.back();

        } catch (err) {
            console.error('[EditVolunteerProfile] Error in handleSave:', err);
            Alert.alert('Error', 'Something went wrong while saving your changes.');
        } finally {
            // setLoading(false);
        }
    };

    const gatherVolunteerInfo = async () => {
        // setLoading(true);
        const uid = await storage.get('userUID');
        if (!uid) {
            Alert.alert('Error', 'Something went wrong while loading your profile. Please try logging in again.');
            // setLoading(false);
            return;
        }

        await fetchVolunteerInfo(uid);
        // await fetchEmail(uid);
        // setLoading(false);
    };

    useEffect(() => {
        gatherVolunteerInfo();
    }, []);

    const uploadImage = async (uid: string): Promise<string | null> => {
        if (newProfilePicture !== null && typeof newProfilePicture !== 'string') {
            const res = await fetch(newProfilePicture.uri as string);
            const arrayBuffer = await res.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const [fileName, extension] = (newProfilePicture.fileName as string).split('.') || '';
            const filePath = `${uid}/${fileName}_${Date.now()}.${extension}`;
            const contentType = `image/${extension}`;

            console.log('[EditVolunteerProfile] attempting to upload image to\
 user_profile_images:', filePath)
            const { error } = await supabase.storage
                .from('user_profile_images')
                .upload(
                    filePath,
                    uint8Array,
                    {
                        contentType: contentType,
                        upsert: true,
                    }
                );

            if (error) {
                console.log('[EditVolunteerProfile] error: uploading user profile image:', error)
                //setSupabaseError(true);
                return null;
            }


            const { data } = await supabase
                .storage
                .from('user_profile_images')
                .getPublicUrl(filePath);
            console.log('[EditVolunteerProfile] image upload success:', data.publicUrl);
            return data.publicUrl;
        }

        return null;
    };

    const pickImage = async () => {
        console.log('[EditVolunteerProfile] user initiated local image upload');
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        });

        if (result.canceled) {
            console.log('[EditVolunteerProfile] user canceled image upload');
        } else {
            setNewProfilePicture(result.assets[0]);
            console.log("[EditVolunteerProfile] image uploaded locally: ", result);
        }
    };

    const Header = (
        <View
            style={{
                backgroundColor: PRIMARY_COLOR,
                paddingTop: 20,
                paddingBottom: 16,
                paddingHorizontal: 24,
                alignItems: 'center',
            }}
        >
            <Text
                variant="headlineMedium"
                style={{ color: 'white', fontWeight: '600' }}
            >
                Account Settings
            </Text>
        </View>
    );

    const Form = (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 24,
                    paddingTop: 12,
                    paddingBottom: 32,
                }}
                keyboardShouldPersistTaps={'handled'}
            >
                <View style={{ height: 128, width: 128, alignSelf: 'center', marginBottom: '5%' }}>
                    <Avatar.Image
                        size={128}
                        source={(typeof newProfilePicture === "string") ?
                            { uri: newProfilePicture }
                            :
                            (
                                (newProfilePicture !== null) ?
                                    { uri: newProfilePicture.uri } :
                                    require('@/assets/icons/default-volunteer.png')
                            )
                        }
                        style={{ marginRight: 20 }} />

                    <TouchableOpacity
                        onPress={((newProfilePicture !== null) ?
                            () => setNewProfilePicture(null) : pickImage)}
                    >
                        <Ionicons
                            name={(newProfilePicture !== null ? 'close-outline' : 'pencil-outline')}
                            size={30}
                            color='white'
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                padding: 8,
                                borderRadius: '100%',
                                backgroundColor: 'hsla(0, 4%, 83%, 0.50)'
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                    First Name <Text style={{ color: (firstNameError ? 'red' : 'black') }}>*</Text>
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your first name"
                    value={firstName}
                    onChangeText={setFirstName}
                    error={firstNameError}
                />
                <HelperText type="error" visible={firstNameError}>
                    This is a required field.
                </HelperText>

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                    Last Name <Text style={{ color: (lastNameError ? 'red' : 'black') }}>*</Text>
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your last name"
                    value={lastName}
                    onChangeText={setLastName}
                    error={lastNameError}
                />
                <HelperText type="error" visible={lastNameError}>
                    This is a required field.
                </HelperText>

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                    Phone Number <Text style={{ color: (phoneError ? 'red' : 'black') }}>*</Text>
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType={'phone-pad'}
                    style={{ marginBottom: 12 }}
                    error={phoneError}
                />
                <HelperText type="error" visible={phoneError}>
                    There is an error with the format of the phone number.
                </HelperText>

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                    Age <Text style={{ color: (ageError ? 'red' : 'black') }}>*</Text>
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType={'number-pad'}
                    style={{ maxWidth: 120 }}
                    error={ageError}
                />
                <HelperText type="error" visible={ageError}>
                    This is not a valid age!
                </HelperText>

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                    Gender
                </Text>
                <View style={{ flexDirection: 'row'}}>
                    {GENDER_OPTIONS.map(option => {
                        const isSelected = gender === option.value;

                        return (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() =>
                                    setGender(prev =>
                                        prev === option.value ? null : option.value // toggle on/off
                                    )
                                }
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 16,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: isSelected ? PRIMARY_COLOR : '#ccc',
                                    backgroundColor: isSelected ? PRIMARY_COLOR : '#fff',
                                    marginRight: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: isSelected ? '#fff' : '#333',
                                        fontSize: 14,
                                    }}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <HelperText type="error" visible={false}>
                    does nothing, for padding.
                </HelperText>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 48 }}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: '#ffffff',
                            borderColor: BUTTON_COLOR,
                            borderWidth: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            borderRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: '600',
                                fontSize: 16,
                                color: 'black',
                            }}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={handleSave}
                        style={{
                            backgroundColor: BUTTON_COLOR,
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            borderRadius: 10,
                            marginLeft: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: '600',
                                fontSize: 16,
                                color: 'white',
                            }}
                        >
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                </View>
                            <HelperText type="error" visible={supabaseError}>
                                An error occurred when updating your profile.
                </HelperText>
            </ScrollView>
        </KeyboardAvoidingView>
    );

    // if (loading) {
    //     return (
    //         <GVArea>
    //             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //                 <Image
    //                     source={require('@/assets/icons/earthLogo.png')}
    //                     style={{
    //                         width: 50,
    //                         height: 50,
    //                     }}
    //                 />
    //                 <Text>Loading...</Text>
    //             </View>
    //         </GVArea>
    //     );
    // }

    return (
        <GVArea>
            <BackButton />
            <View style={{ flex: 1, position: 'relative' }}>

                {Header}
                {Form}
            </View>
        </GVArea>
    );
}
