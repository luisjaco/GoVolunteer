import React, { useState } from "react";
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import type { AlertButton } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
    Avatar,
    HelperText,
    Text,
    TextInput,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import GVArea from "@components/GVArea";
import { PRIMARY_COLOR, SECONDARY_COLOR, BUTTON_COLOR } from "@constants/colors";
import BackButton from '@components/BackButton'
import { useLocalSearchParams, useRouter } from "expo-router";
import { ImagePickerAsset } from "expo-image-picker";
import supabase from "@/src/utils/requests";

export default function EditOrganizationScreen() {
    const router = useRouter();
    const {
        id,
        title,
        motto,
        phone,
        organization_url: organizationURL,
        state,
        city,
        address,
        description,
        profile_picture_url: publicURL
    } = useLocalSearchParams();
    const [newTitle, setNewTitle] = useState(title as string);
    const [newMotto, setNewMotto] = useState(motto as string);
    const [newPhone, setNewPhone] = useState(phone as string);
    const [newOrganizationURL, setNewOrganizationURL] = useState(organizationURL as string);
    const [newState, setNewState] = useState(state as string);
    const [newCity, setNewCity] = useState(city as string);
    const [newAddress, setNewAddress] = useState(address as string);
    const [newDescription, setNewDescription] = useState(description as string);
    const [newProfilePicture, setNewProfilePicture] = useState<ImagePickerAsset | string | null>(
        publicURL ? publicURL as string : null);

    // for required values, ensure correct/filled
    const [titleError, setTitleError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [organizationURLError, setOrganizationURLError] = useState(false);
    const [stateError, setStateError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [supabaseError, setSupabaseError] = useState(false);

    const validateForm = (): boolean => {
        // error is false if valid.. true if invalid.

        const titleValid = Boolean(newTitle);
        setTitleError(!titleValid);

        const phoneRegEx = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
        const phoneValid = phoneRegEx.test(newPhone);
        setPhoneError(!phoneValid);

        let urlRegEx = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\w*)*$/;
        const organizationURLValid = urlRegEx.test(newOrganizationURL);
        setOrganizationURLError(!organizationURLValid);

        const stateRegEx = /^[A-Z]{2}$/;
        const stateValid = stateRegEx.test(newState);
        setStateError(!stateValid);

        const cityRegEx = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
        const cityValid = cityRegEx.test(newCity);
        setCityError(!cityValid);

        return (titleValid && phoneValid && organizationURLValid && stateValid && cityValid);
    };

    const uploadImage = async (): Promise<string | null> => {
        if (newProfilePicture !== null && typeof newProfilePicture !== 'string') {
            const res = await fetch(newProfilePicture.uri as string);
            const arrayBuffer = await res.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const [fileName, extension] = (newProfilePicture.fileName as string).split('.') || '';
            const filePath = `${id}/${fileName}_${Date.now()}.${extension}`;
            const contentType = `image/${extension}`;

            console.log('[EditOrganizationProfile] attempting to upload image to\
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
                console.log('[EditOrganizationProfile] error: uploading user profile image:', error)
                setSupabaseError(true);
                return null;
            }


            const { data } = await supabase
                .storage
                .from('organization_profile_images')
                .getPublicUrl(filePath);
            console.log('[EditOrganizationProfile] image upload success:', data.publicUrl);
            return data.publicUrl;
        }

        return null;
    };

    const updateOrganization = async (publicImageURL: string | null): Promise<Boolean> => {

        console.log('[OrganizationConfirmation] attempting to insert into organizations table');
        const { error } = await supabase.from('organizations').update({
            user_id: id,
            title: newTitle,
            motto: newMotto,
            phone: newPhone,
            organization_url: newOrganizationURL,
            state: newState,
            city: newCity,
            address: newAddress,
            description: newDescription,
            profile_picture_url: publicImageURL
        }).eq('user_id', id);

        if (error) {
            console.log('[OrganizationConfirmation] error: unsuccessful organizations table update',
                error);
            setSupabaseError(true);
            return false;
        }

        console.log('[OrganizationConfirmation] update into organizations table successful')
        return true;
    }

    const handleSave = async () => {
        if (!validateForm()) {
            return false;
        }

        let filePath = null;
        if (typeof newProfilePicture === 'string') {
            filePath = newProfilePicture;
        } else if ( newProfilePicture !== null) {
            filePath = await uploadImage();
        }

        if (!supabaseError && await updateOrganization(filePath)) {
            setSupabaseError(false);
            router.back();
        }
    };

    const pickImage = async () => {
        console.log('[EditOrganizationProfile] user initiated local image upload');
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
            console.log('[EditOrganizationProfile] user canceled image upload');
        } else {
            setNewProfilePicture(result.assets[0]);
            console.log("[EditOrganizationProfile] image uploaded locally: ", result);
        }
    };
    
    const Header = (
        <View
            style={{
                backgroundColor: PRIMARY_COLOR,
                paddingTop: 20,
                paddingBottom: 16,
                paddingHorizontal: 24,
                alignItems: "center",
            }}
        >
            <Text
                variant="headlineMedium"
                style={{ color: "white", fontWeight: "600" }}
            >
                Edit Organization
            </Text>
        </View>
    );

    const Form = (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 24,
                    paddingTop: '5%',
                    paddingBottom: '10%'
                }}
                keyboardShouldPersistTaps="handled"
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
                                    require('@/assets/icons/default-organization.png')
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

                {/* ================== INFO SECTION ================== */}
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginBottom: 8,
                    }}
                >
                    Organization Info
                </Text>
                <View
                    style={{
                        backgroundColor: "#fafafa",
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 20,
                        borderWidth: 1,
                        borderColor: "#e0e0e0",
                    }}
                >
                    <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                        Title <Text style={{ color: (titleError ? 'red' : 'black') }}>*</Text>
                    </Text>
                    <TextInput
                        mode="outlined"
                        dense
                        activeOutlineColor={SECONDARY_COLOR}
                        placeholder="Enter your organization title"
                        value={newTitle}
                        onChangeText={(value) => setNewTitle(value)}
                        error={titleError}
                    />
                    <HelperText type="error" visible={titleError}>
                        This is a required field.
                    </HelperText>

                    <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                        Website <Text style={{ color: (organizationURLError ? 'red' : 'black') }}>*</Text>
                    </Text>
                    <TextInput
                        mode="outlined"
                        dense
                        activeOutlineColor={SECONDARY_COLOR}
                        placeholder="Website/social media page"
                        value={newOrganizationURL}
                        onChangeText={(value) => setNewOrganizationURL(value)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                        error={organizationURLError}
                    />
                    <HelperText type="error" visible={organizationURLError}>
                        This is a required field.
                    </HelperText>

                    <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                        Motto
                    </Text>
                    <TextInput
                        mode="outlined"
                        dense
                        activeOutlineColor={SECONDARY_COLOR}
                        placeholder={"\"Striving to spread love & peace.\""}
                        value={newMotto}
                        onChangeText={(value) => setNewMotto(value)}
                    />
                    <HelperText type="error" visible={false}>
                        does nothing, for padding
                    </HelperText>

                    <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                        Description
                    </Text>
                    <TextInput
                        mode="outlined"
                        activeOutlineColor={SECONDARY_COLOR}
                        placeholder="Describe your organization"
                        value={newDescription}
                        onChangeText={(value) => setNewDescription(value)}
                        multiline
                        numberOfLines={10}
                        style={{
                            marginBottom: 4,
                            textAlignVertical: "top",
                        }}
                    />
                </View>

                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginBottom: 8,
                    }}
                >
                    Contact
                </Text>

                <View
                    style={{
                        backgroundColor: "#fafafa",
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: "#e0e0e0",
                    }}
                >
                    <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                        Phone Number <Text style={{ color: (phoneError ? 'red' : 'black') }}>*</Text>
                    </Text>
                    <TextInput
                        mode="outlined"
                        dense
                        activeOutlineColor={SECONDARY_COLOR}
                        placeholder="###-###-####"
                        value={newPhone}
                        onChangeText={(value) => setNewPhone(value)}
                        keyboardType="phone-pad"
                        error={phoneError}
                    />
                    <HelperText type="error" visible={phoneError}>
                        Phone must be formatted ###-###-####.
                    </HelperText>

                    <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                        Address
                    </Text>
                    <TextInput
                        mode="outlined"
                        dense
                        activeOutlineColor={SECONDARY_COLOR}
                        placeholder="Street address"
                        value={newAddress}
                        onChangeText={(value) => setNewAddress(value)}
                    />
                    <HelperText type="error" visible={false}>
                        does nothing, for padding
                    </HelperText>

                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                                City <Text style={{ color: (cityError ? 'red' : 'black') }}>*</Text>
                            </Text>
                            <TextInput
                                mode="outlined"
                                dense
                                activeOutlineColor={SECONDARY_COLOR}
                                placeholder="City"
                                value={newCity}
                                onChangeText={(value) => setNewCity(value)}
                                style={{ marginBottom: 12 }}
                                error={cityError}
                            />
                        </View>


                        <View style={{ width: 90 }}>
                            <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                                State <Text style={{ color: (stateError ? 'red' : 'black') }}>*</Text>
                            </Text>
                            <TextInput
                                mode="outlined"
                                dense
                                activeOutlineColor={SECONDARY_COLOR}
                                placeholder="State"
                                value={newState}
                                onChangeText={(value) => setNewState(value)}
                                style={{ marginBottom: 12 }}
                                error={stateError}
                            />
                        </View>

                    </View>
                </View>

                {/* Save button */}
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={handleSave}
                    style={{
                        backgroundColor: BUTTON_COLOR,
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "600",
                            fontSize: 16,
                            color: "white",
                        }}
                    >
                        Save Changes
                    </Text>
                </TouchableOpacity>
                <HelperText type="error" visible={supabaseError}>
                        Something went wrong, please try again.
                </HelperText>
            </ScrollView>
        </KeyboardAvoidingView>
    );

    return (
        <GVArea>
            <View style={{ flex: 1, position: "relative" }}>
                <BackButton />
                {Header}
                {Form}
            </View>
        </GVArea>
    );
}
