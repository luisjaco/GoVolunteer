import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard
} from 'react-native';
import {Text, TextInput, Button, IconButton} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GVArea from '@components/GVArea';
import {PRIMARY_COLOR, BUTTON_COLOR, SECONDARY_COLOR} from '@constants/colors';
import ConfettiCannon from 'react-native-confetti-cannon';



export default function VolunteerSignInScreen() {
    const [email, setEmail] = useState('');
    const [pw, setPW] = useState('');
    const [kbVisible, setKBVisible] = useState(false);
    const [kbHeight, setKBHeight] = useState(0);
    const [showConf, setShowConf] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardWillShow', (e)=>{
            setKBVisible(true);
            setKBHeight(e.endCoordinates.height);
        });

        const hideSub = Keyboard.addListener('keyboardWillHide', () => {
           setKBVisible(false);
           setKBHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    // function to run when user taps "Sign In" button
    const handleSignIn = () => {
        console.log('Sign In pressed');
        console.log('Email: ', email);
        console.log('Password: ', pw);

        // TODO: add actual auth logic
        // call backend, validate input, nav to tabs if successful
    };

    const handleForgotPW = () => {
        console.log('Forgot password pressed');
        // TODO: navigation to forgot password screen

        setShowConf(true);

        setTimeout(()=> {
            setShowConf(false);
        }, 5000);
    };

    // nav to "sign up" screen
    const handleSignUp = () => {
        console.log('Sign up pressed');
        // TODO: navigation to volunteer sign up screen
    };

    const createConfetti = () => {
        return (
            <ConfettiCannon
                count={200}
                origin={{ x: 200, y: 0 }}
                fadeOut
                explosionSpeed={500}
                fallSpeed={2000}
                colors={[PRIMARY_COLOR, '#588156', SECONDARY_COLOR, BUTTON_COLOR, '#ccc']}
            />
        );
    }
    const Header = (
        <View
            style={{
                backgroundColor: PRIMARY_COLOR,
                paddingTop: 40,
                paddingBottom: 16,
                paddingHorizontal: 24,
                alignItems: 'center',
            }}
        >
            <Text
                variant="headlineMedium"
                style={{color: 'white', fontWeight: '600'}}
            >
                Sign In
            </Text>
        </View>
    );

    const Form = (
      <KeyboardAvoidingView
          style={{flex:1}}
          behavior='padding'
      >
          <ScrollView
              contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: 24,
                  paddingTop: 32,
              }}
              keyboardShouldPersistTaps='handled'
          >
              <Text style={{marginBottom:6, fontSize: 16, fontWeight: '500'}}>
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
                  style={{marginBottom:10}}
              />

              <Text style={{marginBottom:6, fontSize: 16, fontWeight: '500'}}>
                  Password
              </Text>

              <TextInput
                  mode="outlined"
                  dense
                  activeOutlineColor={SECONDARY_COLOR}
                  placeholder="Enter your password"
                  value={pw}
                  onChangeText={setPW}
                  secureTextEntry
                  style={{marginBottom:6}}
              />

              <Text
                  onPress={handleForgotPW}
                  style={{
                      textAlign: 'right',
                      color: PRIMARY_COLOR,
                      marginBottom: 20,
                      fontWeight: '500',
                  }}
              >
                  Forgot Password?
              </Text>

              <Button
                  mode="contained"
                  onPress={handleSignIn}
                  buttonColor={BUTTON_COLOR}
                  textColor='white'
                  style={{borderRadius:50, paddingVertical: 4, marginBottom: 24}}
                  labelStyle={{fontSize:16, fontWeight: '600'}}
              >
                  Sign In
              </Button>

              <View style={{alignItems: 'center'}}>
                  <Text style={{fontSize: 14, color: '#777'}}>
                      Don't have an account? {' '}
                      <Text
                          style={{color: PRIMARY_COLOR, fontWeight:'600'}}
                          onPress={handleSignUp}
                      >
                          Sign up
                      </Text>
                  </Text>
              </View>
          </ScrollView>
      </KeyboardAvoidingView>
    );

    return (
        <GVArea>
            <View style={{flex: 1, position: 'relative'}}>
                {Header}
                {Form}
                {showConf && createConfetti()}
                {kbVisible && (
                    <IconButton
                        icon="keyboard-close"
                        size={24}
                        mode='contained'
                        iconColor={PRIMARY_COLOR}
                        containerColor={PRIMARY_COLOR}
                        onPress={() => {
                            setKBVisible(false);
                            Keyboard.dismiss();
                        }}
                        style={{
                            position: 'absolute',
                            right: 16,
                            bottom: kbHeight + 16,
                            backgroundColor: 'white',
                        }}
                    />
                )}
            </View>
        </GVArea>
    );


}