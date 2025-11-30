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
    const [title, setTitle] = useState('');
    const [motto, setMotto] = useState('');
    const [phone, setPhone] = useState('');
    const [organizationURL, setOrganizationURL] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [profilePicture, setProfilePicture] = useState<ImagePickerAsset | null>(null);
    
    // for required values, ensure correct/filled
    const [titleError, setTitleError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [organizationURLError, setOrganizationURLError] = useState(false);
    const [stateError, setStateError] = useState(false);
    const [cityError, setCityError] = useState(false);

    // will return true if all fields are valid.
    const validateForm = (): boolean => {
        // error is false if valid.. true if invalid.

        const titleValid = Boolean(title);
        setTitleError(!titleValid);
    

        const phoneRegEx = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
        const phoneValid = phoneRegEx.test(phone);
        setPhoneError(!phoneValid);

        let urlRegEx = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
        const organizationURLValid = urlRegEx.test(organizationURL);
        setOrganizationURLError(!organizationURLValid);

        const stateRegEx = /^[A-Z]{2}$/;
        const stateValid = stateRegEx.test(state);
        setStateError(!stateValid);

        const cityRegEx = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
        const cityValid = cityRegEx.test(city);
        setCityError(!cityValid);

        return (titleValid && phoneValid && organizationURLValid && stateValid && cityValid);
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        router.push({
            pathname: '/auth/setup/OrganizationConfirmation',
            params: {
                title: title,
                motto: ( motto ? motto : undefined),
                phone: ( phone ? phone : undefined),
                organizationURL: organizationURL,
                state: state,
                city: city,
                address: (address ? address : undefined),
                description: (description ? description : undefined),
                profilePictureURI: (profilePicture !== null ? profilePicture.uri : undefined),
                profilePictureFileName: (profilePicture !== null ? profilePicture.fileName : undefined),
            }
        });
    }

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

    const reviewButton = (
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
                Tell us more about your organization!
            </Text >

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Title <Text style={{color: (titleError ? 'red' : 'black')}}>*</Text>
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder="Enter your organization title."
                value={title}
                onChangeText={(value) => setTitle(value)}
                error={titleError}
            />
            <HelperText type="error" visible={titleError}>
                This is a required field.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Motto
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder={"\"Striving to spread love & peace.\""}
                value={motto}
                onChangeText={(value) => setMotto(value)}
            />
            <HelperText type="error" visible={false}>
                will do nothing, for padding
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Phone Number <Text style={{color: (phoneError ? 'red' : 'black')}}>*</Text>
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
                Phone must be formatted ###-###-####.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Website <Text style={{color: (organizationURLError ? 'red' : 'black')}}>*</Text>
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder={"Website/social media page"}
                value={organizationURL}
                onChangeText={(value) => setOrganizationURL(value)}
                error={organizationURLError}
                inputMode='url'
                autoCapitalize='none'
                autoCorrect={false}
            />
            <HelperText type="error" visible={organizationURLError}>
                This is a required field.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                State <Text style={{color: (stateError ? 'red' : 'black')}}>*</Text>
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder={"NY"}
                value={state}
                onChangeText={(value) => setState(value)}
                error={stateError}
            />
            <HelperText type="error" visible={stateError}>
                This is a required field.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                City <Text style={{color: (cityError ? 'red' : 'black')}}>*</Text>
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder={"Old Westbury"}
                value={city}
                onChangeText={(value) => setCity(value)}
                error={cityError}
            />
            <HelperText type="error" visible={cityError}>
                This is a required field.
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Address
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder={"Northern Boulevard"}
                value={address}
                onChangeText={(value) => setAddress(value)}
            />
            <HelperText type="error" visible={false}>
                does nothing, for padding
            </HelperText>

            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                Description
            </Text>
            <TextInput
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                placeholder={"Describe your organization!"}
                value={description}
                onChangeText={(value) => setDescription(value)}
            />
            <HelperText type="error" visible={false}>
                does nothing, for padding
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
                        require('@/assets/icons/default-organization.png'))} />
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
            {reviewButton}
        </ScrollView>
    );

    return (
        <GVArea>
            {header}
            {form}
        </GVArea>
    );
}