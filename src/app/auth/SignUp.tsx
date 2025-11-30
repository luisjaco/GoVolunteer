import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Text, TextInput, Snackbar, HelperText } from 'react-native-paper';
import GVArea from '@components/GVArea';
import { PRIMARY_COLOR, BUTTON_COLOR, SECONDARY_COLOR, BUTTON_DISABLED } from '@constants/colors';
import supabase from '@utils/requests';
import BackButton from '../../components/BackButton';


export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [supabaseError, setSupabaseError] = useState(false);
    const [passwordObscured, setPasswordObscured] = useState(true);
    const [userSignedUp, setUserSignedUp] = useState(false);

    // will update emailError, passwordError, and return false if either have an error
    const verifyEmailPassword = (): boolean => {
        // verify email not empty and valid: anystring@anystring.anystring
        const regexEmail = /\S+@\S+\.\S+/;
        const emailValid = regexEmail.test(email);
        setEmailError(!emailValid);

        // verify password at least 8 characters long, contains one uppercase letter, one lowercase
        // letter, a number, and has a symbol.
        var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        const passwordValid = regexPassword.test(password);
        setPasswordError(!passwordValid);

        return (emailValid && passwordValid);
    }

    const handleSignUp = async (e: any) => {
        console.log('[SignUp] user attempting to sign up with combo: ', email, password);

        // exit is email or password has an error
        if (!verifyEmailPassword()) {
            console.log('[SignUp] validation error: email or password')
            return;
        }
        
        const {error} = await supabase.auth.signUp({email, password});
        if (error) {
            console.log('[SignUp] error: signing up user:', error);
            setSupabaseError(true);
            return;
        }

        console.log('[SignUp] success registering user, user must now confirm email before continuing.');
        setSnackbarVisible(true);
        setSupabaseError(false);
        setUserSignedUp(true);
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
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                paddingHorizontal: 24,
                paddingTop: 32,
            }}
            keyboardDismissMode="interactive"

        >
            <View style={{ marginBottom: 24 }}>
                <Text style={{ marginBottom: 24, fontSize: 20, fontWeight: '700' }}>
                    Sign up to start using GoVolunteer!
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
                    keyboardType="email-address"
                    autoCorrect={false}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="none"
                    error={emailError || supabaseError}
                    disabled={userSignedUp}
                />
                <HelperText type="error" visible={emailError}>
                    There is an error with the email.
                </HelperText>

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
                    secureTextEntry={passwordObscured}
                    error={passwordError || supabaseError}
                    right={
                        <TextInput.Icon 
                            icon={passwordObscured ? "eye-off" : "eye"}
                            onPress={() => setPasswordObscured((passObs) => !passObs)}
                        />
                    }
                    disabled={userSignedUp}
                />
                <Text style={{ color: 'gray', fontSize: 12, marginTop: 6 }}>
                    The password should:
                    {'\n\u2022'} Be at least 8 characters.
                    {'\n\u2022'} Contain at least one symbol [!@#$%^&*].
                    {'\n\u2022'} Contain at least one number.
                    {'\n\u2022'} Contain at least one uppercase letter.
                    {'\n\u2022'} Contain at least one lowercase letter.
                </Text>
                <HelperText type="error" visible={passwordError}>
                    Make sure the password is valid!
                </HelperText>
            </View>

            <TouchableOpacity
                activeOpacity={.6}
                onPress={handleSignUp}
                style={{
                    backgroundColor: (userSignedUp ? BUTTON_DISABLED : BUTTON_COLOR),
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginBottom: 12,
                    alignItems: "center",
                }}
                disabled={userSignedUp}
            >
                <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
                    Sign Up
                </Text>
            </TouchableOpacity>
            <HelperText type="error" visible={supabaseError}>
                There was an error signing up. Please try again.
            </HelperText>
        </ScrollView>
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
                {/* back button */}
                <BackButton />
                {Header}
                {Form}
                {SnackBar}
            </View>
        </GVArea>
    );
}