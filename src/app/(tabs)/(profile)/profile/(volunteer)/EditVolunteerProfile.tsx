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

    const fetchEmail = async () => {
        const { data, error } = await supabase.from('users').select('*');

        console.log('[EditVolunteerProfile] grabbing information from users table');

        if (error || data.length ===0) {
            console.log('[EditVolunteerProfile] error: grabbing from users table', error);
            return;
        } else {
            setEmail(data[0].email ?? '');
        }
    };

    const handleSave = () => {
        console.log('Save Changes Pressed');
        console.log({
            firstName,
            lastName,
            email,
            phone,
            age,
            gender,
            profilePicUrl,
        });
        // TODO: send data to backend
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
        const uid = await storage.get('userUID') || 'ERROR';
        await fetchVolunteerInfo(uid);
        await fetchEmail();
        setLoading(false);
    }
    useEffect(() => {
        gatherVolunteerInfo();
    }, []);

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
