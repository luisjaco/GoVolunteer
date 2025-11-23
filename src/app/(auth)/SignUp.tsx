import React, { useEffect, useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    Keyboard,
    TouchableOpacity,
    Image
} from 'react-native';
import { Text, TextInput, IconButton, Snackbar } from 'react-native-paper';
import GVArea from '@components/GVArea';
import { PRIMARY_COLOR, BUTTON_COLOR, SECONDARY_COLOR } from '@constants/colors';
import supabase from '@utils/requests';


export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
            setKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
        });

        const hideSub = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardVisible(false);
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const handleKeyboardClose = () => {
        setKeyboardVisible(false);
        Keyboard.dismiss;
    }

    // function to run when user taps "Sign In" button
    const handleSignUp = async (e: any) => {
        console.log('user attempting to sign up with combo: ', email, password);

        const {error} = await supabase.auth.signUp({email, password});
        if (error) {
            console.error('error signing up user:', error);
            return;
        }

        console.log('succuss registering user, user must now confirm email before continuing.');
        handleKeyboardClose();
        setSnackbarVisible(true);
    };

    const Header = (
        <View
            style={{
                backgroundColor: PRIMARY_COLOR,
                paddingVertical: 20,
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
                        color: "white",
                        fontWeight: "800",
                        fontSize: 32,
                        textAlign: "center",
                    }}
                >
                    GoVolunteer
                </Text>
            </View>
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
                    paddingTop: 32,
                }}
                keyboardDismissMode="on-drag"
                
            >
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ marginBottom: 24, fontSize: 20, fontWeight: '700' }}>
                        Sign up to start looking for volunteering opportunities!
                    </Text>

                    <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                        Email Address
                    </Text>
                    <TextInput
                        mode="outlined"
                        dense
                        activeOutlineColor={SECONDARY_COLOR}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={{ marginBottom: 10 }}
                    />

                    <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '500' }}>
                        Password
                    </Text>
                    <TextInput
                        mode="outlined"
                        dense
                        activeOutlineColor={SECONDARY_COLOR}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={{ marginBottom: 6 }}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={.6}
                    onPress={handleSignUp}
                    style={{
                        backgroundColor: BUTTON_COLOR,
                        paddingVertical: 12,
                        borderRadius: 10,
                        marginBottom: 12,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );

    const SnackBar = (
        <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={Snackbar.DURATION_SHORT}
            style={{
                backgroundColor: SECONDARY_COLOR,
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                Please confirm your email and then sign in!
            </Text>
        </Snackbar>
    )

    return (
        <GVArea>
            <View style={{ flex: 1, position: 'relative' }}>
                {Header}
                {Form}
                {keyboardVisible && (
                    <IconButton
                        icon="keyboard-close"
                        size={24}
                        mode='contained'
                        iconColor={PRIMARY_COLOR}
                        containerColor={PRIMARY_COLOR}
                        onPress={() => {
                            setKeyboardVisible(false);
                            Keyboard.dismiss();
                        }}
                        style={{
                            position: 'absolute',
                            right: 16,
                            bottom: keyboardHeight + 16,
                            backgroundColor: 'white',
                        }}
                    />
                )}
                {SnackBar}
            </View>
        </GVArea>
    );
}