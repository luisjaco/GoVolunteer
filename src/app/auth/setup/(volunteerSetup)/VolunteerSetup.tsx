import GVArea from '@/src/components/GVArea';
import { PRIMARY_COLOR, SECONDARY_COLOR, BUTTON_COLOR } from '@/src/constants/colors';
import React, { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, HelperText, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function OrganizationSetup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
    // will hold the path from the users device.
    const [profilePicture, setProfilePicture] = useState<ImagePickerAsset | null>(null);
    // for required values, ensure correct/filled
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [ageError, setAgeError] = useState(false);

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

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        router.push({
            pathname: '/auth/setup/VolunteerConfirmation',
            params: {
                firstName: firstName,
                lastName: lastName,
                age: ( age ? Number(age) : undefined),
                phone: ( phone ? phone : undefined),
                gender: gender,
                profilePictureURI: (profilePicture !== null ? profilePicture.uri : undefined),
                profilePictureFileName: (profilePicture !== null ? profilePicture.fileName : undefined),
            }
        });
    }

    const handleRadioPress = (button: string) => {
        switch (button) {
            case 'male':
                gender === 'male' ? setGender(null) : setGender('male');
                break;
            case 'female':
                gender === 'female' ? setGender(null) : setGender('female');
                break;
            case 'other':
                gender === 'other' ? setGender(null) : setGender('other');
                break;
            default:
                setGender(null);
                break;
        }
    };

    const pickImage = async () => {
        console.log('user initiated local image upload');
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
            console.log('user canceled image upload');
        } else {
            setProfilePicture(result.assets[0]);
            console.log("image uploaded local: ", result);
        }
    };

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

    const nextButton = (
        <View style={{
            flex: 1,

            alignContent: 'center',
            alignItems: 'center'
        }}>

            <TouchableOpacity
                activeOpacity={.4}
                style={{
                    backgroundColor: BUTTON_COLOR,
                    marginTop: '3%',
                    marginBottom: '10%',
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: 'center',
                    height: 45,
                    width: '40%',
                }}
                onPress={handleSubmit}
            >
                <Text style={{ fontWeight: "600", fontSize: 16, color: "white" }}>
                    Review
                </Text>
            </TouchableOpacity>
        </View>
    );

    const form = (
        <ScrollView
            contentContainerStyle={{
                paddingHorizontal: 24,
            }}
            keyboardDismissMode="interactive"
        >
            <Text
                style={{
                    paddingVertical: 15,
                    fontWeight: "800",
                    fontSize: 30,
                    textAlign: "center",
                }}
            >
                Tell us more about you!
            </Text >
            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                First Name <Text style={{color: (firstNameError ? 'red' : 'black')}}>*</Text>
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={(value) => setFirstName(value)}
                error={firstNameError}
            />
            <HelperText type="error" visible={firstNameError}>
                This is a required field.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Last Name <Text style={{color: (lastNameError ? 'red' : 'black')}}>*</Text>
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={(value) => setLastName(value)}
                error={lastNameError}
            />
            <HelperText type="error" visible={lastNameError}>
                This is a required field.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Phone Number
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder={"###-###-####"}
                value={phone}
                onChangeText={(value) => setPhone(value)}
                error={phoneError}
                keyboardType='numbers-and-punctuation'
            />
            <HelperText type="error" visible={phoneError}>
                There is an error with the format of the phone number.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Age
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder={"Enter your age"}
                value={age}
                onChangeText={(value) => setAge(value)}
                error={ageError}
                inputMode='numeric'
            />
            <HelperText type="error" visible={ageError}>
                This is not a valid age!
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Gender
            </Text>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'space-around'
                }}

            >
                <TouchableOpacity
                    activeOpacity={.6}
                    onPress={() => handleRadioPress('male')}
                    style={{
                        backgroundColor: (gender === 'male' ? PRIMARY_COLOR : SECONDARY_COLOR),
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        marginBottom: 12,
                        alignItems: "center",
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
                        Male
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={.6}
                    onPress={() => handleRadioPress('female')}
                    style={{
                        backgroundColor: (gender === 'female' ? PRIMARY_COLOR : SECONDARY_COLOR),
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        marginBottom: 12,
                        alignItems: "center",
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
                        Female
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={.6}
                    onPress={() => handleRadioPress('other')}
                    style={{
                        backgroundColor: (gender === 'other' ? PRIMARY_COLOR : SECONDARY_COLOR),
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        marginBottom: 12,
                        alignItems: "center",
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
                        Other
                    </Text>
                </TouchableOpacity>
            </View>
            <HelperText type="error" visible={false}>
                wont show, for padding.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Profile Picture
            </Text>

            <View
                style={{
                    marginLeft: 25,
                    height: 100,
                    width: 100
                }}
            >
                <Avatar.Image
                    size={100}
                    source={(profilePicture !== null ?
                        { uri: profilePicture.uri } :
                        require('@/assets/icons/default-volunteer.png'))} />
                <TouchableOpacity
                    onPress={(profilePicture !== null ? () => setProfilePicture(null) : pickImage)}
                >
                    <Ionicons
                        name={(profilePicture !== null ? 'close-outline' : 'pencil-outline')}
                        size={24}
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
            <HelperText type="error" visible={false}>
                does nothing, for padding.
            </HelperText>

            {nextButton}
        </ScrollView>
    );

    return (
        <GVArea>
            {header}
            {form}
        </GVArea>
    );
}