import React, {useState, useEffect} from "react";
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import type {AlertButton} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {
    Avatar, HelperText,
    Text,
    TextInput,
} from "react-native-paper";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import GVArea from "@components/GVArea";
import {PRIMARY_COLOR, SECONDARY_COLOR, BUTTON_COLOR} from "@constants/colors";
import supabase, {Volunteer} from "@utils/requests";
import { useRouter} from "expo-router";
import {storage} from "@utils/storage";

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
async function uploadImage(uri: string, uid: string): Promise<string | null> {
    try {
        const response = await  fetch(uri);
        const arrayBuffer = await response.arrayBuffer();
        const fileBytes = new Uint8Array(arrayBuffer);

        const extMatch = /\.(\w+)$/.exec(uri);
        const ext = extMatch?.[1]?.toLowerCase() ?? 'jpg';

        const filePath = `${uid}/profile-${Date.now()}.${ext}`;

        const {error: uploadError} = await supabase.storage.from(BUCKET_NAME).upload(filePath, fileBytes, {
            upsert: true,
            contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        });

        if (uploadError) {
            console.log('[EditVolunteerProfile] error uploading image:', uploadError);
            Alert.alert('Error', 'Something went wrong while uploading your profile picture.');
            return null;
        }

        const {data: publicData} = await supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        return publicData.publicUrl;
    } catch (err) {
        console.log('[EditVolunteerProfile] error uploading image:', err);
        Alert.alert('Error', 'Something went wrong while uploading your profile picture.');
        return null;
    }
}

export default function EditProfileScreen() {
    const router = useRouter();
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<Gender>(null);
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


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
        setProfilePicUrl(v.profile_picture_url ?? null);
    };

    const fetchEmail = async (uid: string) => {
        const { data, error } = await supabase.from('users').select('email').eq('id', uid).single();

        console.log('[EditVolunteerProfile] grabbing information from users table');

        if (error || !data) {
            console.log('[EditVolunteerProfile] error: grabbing from users table', error);
            return;
        } else {
            setEmail(data.email ?? '');
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const uid = await storage.get('userUID');

            if (!uid) {
                Alert.alert('Error', 'Something went wrong while saving your changes. Please try logging in again.');
                setLoading(false);
                return;
            }

            const ageNum = age.trim().length > 0 ? parseInt(age.trim(), 10) : null;
            if (ageNum !== null && isNaN(ageNum)) {
                Alert.alert('Invalid Age', 'Please enter a valid number for age.');
                setLoading(false);
                return;
            }

            let finalProfilePicUrl = profilePicUrl;

            if (profilePicUrl && profilePicUrl.startsWith('file://')) {
                const uploadedUrl = await uploadImage(profilePicUrl, uid);

                if (!uploadedUrl) {
                    setLoading(false);
                    return;
                }
                finalProfilePicUrl = uploadedUrl;
                setProfilePicUrl(uploadedUrl);
            }

            const {error: volunteerError} = await supabase.from('volunteers').update({
                first_name: firstName || null,
                last_name: lastName || null,
                phone: phone || null,
                age: ageNum,
                gender: gender ?? null,
                profile_picture_url: finalProfilePicUrl || null,
            }).eq('user_id', uid);

            if (volunteerError) {
                console.log('[EditVolunteerProfile] error: updating volunteers table', volunteerError);
                Alert.alert('Error', 'Something went wrong while saving your changes.');
                setLoading(false);
                return;
            }

            const {error: userError} = await supabase.from('users').update({
                email: email || null,
            }).eq('id', uid);

            if (userError) {
                console.log('[EditVolunteerProfile] error: updating users table', userError);
                Alert.alert('Error', 'Something went wrong while saving your changes.');
                setLoading(false);
                return;
            }

            await fetchVolunteerInfo(uid);
            await fetchEmail(uid);
            setLoading(false);

            Alert.alert('Success', 'Your changes have been saved.',[
                {text: 'OK', onPress: () => router.back()},
            ]);

        } catch (err) {
            console.error('[EditVolunteerProfile] Error in handleSave:', err);
            Alert.alert('Error', 'Something went wrong while saving your changes.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfilePic = async () => {
        try {
            // Ask for permissions
            const { status: libStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();

            if (libStatus !== 'granted' || camStatus !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'We need access to your camera and photo library to change your profile picture.'
                );
                return;
            }

            const actions: AlertButton[] = [];

            // If there is already a profile pic, allow removing it
            if (profilePicUrl) {
                actions.push({
                    text: 'Remove photo',
                    style: 'destructive',
                    onPress: () => setProfilePicUrl(null),
                });
            }

            // Take Photo option
            actions.push({
                text: 'Take Photo',
                onPress: async () => {
                    try {
                        const result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            aspect: [1, 1], // square crop
                            quality: 0.8,
                        });

                        if (!result.canceled) {
                            const uri = result.assets[0]?.uri;
                            if (uri) {
                                setProfilePicUrl(uri);
                            }
                        }
                    } catch (err) {
                        console.error('Error using camera:', err);
                        Alert.alert('Error', 'Something went wrong while taking a photo.');
                    }
                },
            });

            // Choose from camera roll
            actions.push({
                text: 'Choose from Gallery',
                onPress: async () => {
                    try {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                        });

                        if (!result.canceled) {
                            const uri = result.assets[0]?.uri;
                            if (uri) {
                                setProfilePicUrl(uri);
                            }
                        }
                    } catch (err) {
                        console.error('Error picking image from library:', err);
                        Alert.alert('Error', 'Something went wrong while picking an image.');
                    }
                },
            });

            // Cancel option
            actions.push({
                text: 'Cancel',
                style: 'cancel',
            });

            Alert.alert('Change Profile Picture', 'Choose an option', actions);
        } catch (err) {
            console.error('Error in handleEditProfilePic:', err);
            Alert.alert('Error', 'Something went wrong while changing your profile picture.');
        }
    };

    const gatherVolunteerInfo = async () => {
        setLoading(true);
        const uid = await storage.get('userUID');
        if (!uid) {
            Alert.alert('Error', 'Something went wrong while loading your profile. Please try logging in again.');
            setLoading(false);
            return;
        }

        await fetchVolunteerInfo(uid);
        await fetchEmail(uid);
        setLoading(false);
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
                style={{color: 'white', fontWeight: '600'}}
            >
                Account Settings
            </Text>
        </View>
    );

    const Form = (
        <KeyboardAvoidingView
            style={{flex: 1}}
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
                <TouchableOpacity
                    onPress={handleEditProfilePic}
                    activeOpacity={0.7}
                    style={{alignItems: 'center', marginBottom: 12}}
                >
                    <View style={{position: 'relative'}}>
                        <View
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 45,
                                backgroundColor: '#ffffff',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                                overflow: 'hidden',
                            }}
                        >
                            {profilePicUrl ? (
                                <Image
                                    source={{uri: profilePicUrl}}
                                    style={{width: '100%', height: '100%'}}
                                    resizeMode={'cover'}
                                />
                            ) : (
                                <MaterialCommunityIcons name="account-circle" size={90} color={'#aaaaaa'}/>
                            )}
                        </View>

                        <View
                            style={{
                                position: 'absolute',
                                bottom:8,
                                right:8,
                                backgroundColor: PRIMARY_COLOR,
                                width:24,
                                borderRadius:14,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingBottom: 2,
                                paddingTop:2,
                            }}
                        >
                            <MaterialCommunityIcons name={"pencil"} size={20} color={'white'}/>
                        </View>
                    </View>
                </TouchableOpacity>

                <Text style={{marginBottom: 6, fontSize: 16, fontWeight: '500'}}>
                    First Name
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your first name"
                    value={firstName}
                    onChangeText={setFirstName}
                    style={{marginBottom: 12}}
                />

                <Text style={{marginBottom: 6, fontSize: 16, fontWeight: '500'}}>
                    Last Name
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your last name"
                    value={lastName}
                    onChangeText={setLastName}
                    style={{marginBottom: 12}}
                />

                <Text style={{marginBottom: 6, fontSize: 16, fontWeight: '500'}}>
                    Email Address
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    spellCheck={false}
                    style={{marginBottom: 12}}
                />

                <Text style={{marginBottom: 6, fontSize: 16, fontWeight: '500'}}>
                    Phone Number
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType={'phone-pad'}
                    style={{marginBottom: 12}}
                />

                <Text style={{marginBottom: 6, fontSize: 16, fontWeight: '500'}}>
                    Age
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter your age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType={'number-pad'}
                    style={{marginBottom: 12, maxWidth: 120}}
                />

                <Text style={{marginBottom: 6, fontSize: 16, fontWeight: '500'}}>
                    Gender
                </Text>
                <View style={{ flexDirection: 'row', marginBottom:20}}>
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

                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 48}}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: '#ffffff',
                            borderColor: BUTTON_COLOR,
                            borderWidth: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            borderRadius:10,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight:'600',
                                fontSize: 16,
                                color:'black',
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
                            borderRadius:10,
                            marginLeft: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight:'600',
                                fontSize: 16,
                                color:'white',
                            }}
                        >
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

    if (loading) {
        return (
            <GVArea>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={require('@/assets/icons/earthLogo.png')}
                        style={{
                            width: 50,
                            height: 50,
                        }}
                    />
                    <Text>Loading...</Text>
                </View>
            </GVArea>
        );
    }

    return (
        <GVArea>
            <View style={{flex: 1, position: 'relative'}}>
                {Header}
                {Form}
            </View>
        </GVArea>
    );
}
