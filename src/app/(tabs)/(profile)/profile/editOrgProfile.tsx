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
    Text,
    TextInput,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GVArea from "@components/GVArea";
import { PRIMARY_COLOR, SECONDARY_COLOR, BUTTON_COLOR } from "@constants/colors";

export default function EditOrganizationScreen() {
    const [title, setTitle] = useState("Organization Name From Backend");
    const [motto, setMotto] = useState("Motto from backend");
    const [description, setDescription] = useState("Description from backend");
    const [email, setEmail] = useState("org.email@example.com");
    const [phone, setPhone] = useState("555-123-4567");
    const [organizationUrl, setOrganizationUrl] = useState("https://example.org");
    const [address, setAddress] = useState("123 Main St");
    const [city, setCity] = useState("City From Backend");
    const [state, setState] = useState("NY");
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

    const handleSave = () => {
        console.log("Save Organization Changes Pressed");
        console.log({
            title,
            motto,
            description,
            email,
            phone,
            organization_url: organizationUrl,
            address,
            city,
            state,
            profile_picture_url: profilePicUrl,
        });
        // TODO: send data to backend
    };

    const handleEditProfilePic = async () => {
        try {
            // Ask for permissions
            const { status: libStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();

            if (libStatus !== "granted" || camStatus !== "granted") {
                Alert.alert(
                    "Permission Required",
                    "We need access to your camera and photo library to change your organization logo."
                );
                return;
            }

            const actions: AlertButton[] = [];

            // If there is already a profile pic, allow removing it
            if (profilePicUrl) {
                actions.push({
                    text: "Remove logo",
                    style: "destructive",
                    onPress: () => setProfilePicUrl(null),
                });
            }

            // Take Photo option
            actions.push({
                text: "Take Photo",
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
                        console.error("Error using camera:", err);
                        Alert.alert("Error", "Something went wrong while taking a photo.");
                    }
                },
            });

            // Choose from camera roll
            actions.push({
                text: "Choose from Gallery",
                onPress: async () => {
                    try {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ["images"],
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
                        console.error("Error picking image from library:", err);
                        Alert.alert("Error", "Something went wrong while picking an image.");
                    }
                },
            });

            // Cancel option
            actions.push({
                text: "Cancel",
                style: "cancel",
            });

            Alert.alert("Change Organization Logo", "Choose an option", actions);
        } catch (err) {
            console.error("Error in handleEditProfilePic:", err);
            Alert.alert("Error", "Something went wrong while changing your organization logo.");
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
                Organization Settings
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
                    paddingTop: 12,
                    paddingBottom: 32,
                }}
                keyboardShouldPersistTaps="handled"
            >

                <TouchableOpacity
                    onPress={handleEditProfilePic}
                    activeOpacity={0.7}
                    style={{ alignItems: "center", marginBottom: 12 }}
                >
                    <View style={{ position: "relative" }}>
                        <View
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 45,
                                backgroundColor: "#ffffff",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 8,
                                overflow: "hidden",
                            }}
                        >
                            {profilePicUrl ? (
                                <Image
                                    source={{ uri: profilePicUrl }}
                                    style={{ width: "100%", height: "100%" }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="office-building"
                                    size={75}
                                    color={"#aaaaaa"}
                                />
                            )}
                        </View>

                        <View
                            style={{
                                position: "absolute",
                                bottom: 8,
                                right: 8,
                                backgroundColor: PRIMARY_COLOR,
                                width: 24,
                                borderRadius: 14,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingBottom: 2,
                                paddingTop: 2,
                            }}
                        >
                            <MaterialCommunityIcons
                                name={"pencil"}
                                size={20}
                                color={"white"}
                            />
                        </View>
                    </View>
                </TouchableOpacity>

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    Organization Name
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter organization name"
                    value={title}
                    onChangeText={setTitle}
                    style={{ marginBottom: 12 }}
                />

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    Motto
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter organization motto"
                    value={motto}
                    onChangeText={setMotto}
                    style={{ marginBottom: 12 }}
                />

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    Description
                </Text>
                <TextInput
                    mode="outlined"
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Describe your organization"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={10}
                    style={{ marginBottom: 12 }}
                />

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    Email
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter contact email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    style={{ marginBottom: 12 }}
                />

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    Phone Number
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Enter phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={{ marginBottom: 12 }}
                />

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    Website
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="https://your-organization.org"
                    value={organizationUrl}
                    onChangeText={setOrganizationUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    style={{ marginBottom: 12 }}
                />

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    Address
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="Street address"
                    value={address}
                    onChangeText={setAddress}
                    style={{ marginBottom: 12 }}
                />

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    City
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                    style={{ marginBottom: 12 }}
                />

                <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
                    State
                </Text>
                <TextInput
                    mode="outlined"
                    dense
                    activeOutlineColor={SECONDARY_COLOR}
                    placeholder="State"
                    value={state}
                    onChangeText={setState}
                    style={{ marginBottom: 20, maxWidth: 120 }}
                />

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
            </ScrollView>
        </KeyboardAvoidingView>
    );

    return (
        <GVArea>
            <View style={{ flex: 1, position: "relative" }}>
                {Header}
                {Form}
            </View>
        </GVArea>
    );
}
