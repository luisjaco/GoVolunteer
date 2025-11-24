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
import { PRIMARY_COLOR, BUTTON_COLOR, SECONDARY_COLOR } from '@constants/colors';
import supabase from '@utils/requests';


export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [supabaseError, setSupabaseError] = useState(false);
    const [passwordObscured, setPasswordObscured] = useState(true);

    // will update emailError 
    const verifyEmail = (): boolean => {
        // verify email not empty and valid: anystring@anystring.anystring
        const regexEmail = /\S+@\S+\.\S+/;
        const emailValid = regexEmail.test(email);
        setEmailError(!emailValid);

        return emailValid;
    }

    const handleSignIn = async (e: any) => {
        console.log('user attempting to sign up with combo: ', email, password);

        // exit is email or password has an error
        if (!verifyEmail()) {
            console.log('validation error: email')
            return;
        }
        
        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        if (error) {
            console.log('supabase error: signing in user:', error);
            setSupabaseError(true);
            return;
        }

        console.log('succussfully signed in user:', data);
        setSnackbarVisible(true);
        setSupabaseError(false);
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
            keyboardDismissMode='interactive'
        >
            <View style={{ marginBottom: 24 }}>
                <Text style={{ marginBottom: 24, fontSize: 20, fontWeight: '700' }}>
                    Sign in to your GoVolunteer acconut!
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
                    error={supabaseError}
                    right={
                        <TextInput.Icon 
                            icon={passwordObscured ? "eye-off" : "eye"}
                            onPress={() => setPasswordObscured((passObs) => !passObs)}
                        />
                    }
                />
            </View>

            <TouchableOpacity
                activeOpacity={.6}
                onPress={handleSignIn}
                style={{
                    backgroundColor: BUTTON_COLOR,
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginBottom: 12,
                    alignItems: "center",
                }}
            >
                <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
                    Sign In
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
                Signed in!
            </Text>
        </Snackbar>
    )

    return (
        <GVArea>
            <View style={{ flex: 1, position: 'relative' }}>
                {Header}
                {Form}
                {SnackBar}
            </View>
        </GVArea>
    );
}