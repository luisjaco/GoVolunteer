import React, { useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import GVArea from '@components/GVArea';
import { Text, HelperText } from 'react-native-paper';
import { BUTTON_COLOR, BUTTON_DISABLED, PRIMARY_COLOR, SECONDARY_COLOR } from '@/src/constants/colors';
import { useRouter } from 'expo-router';

export default function AccountSetupIntroduction() {

    const [userIdentity, setUserIdentity] = useState<'none' | 'user' | 'organization'>('none');
    const router = useRouter();
    // will change the userIdentity to the buttons intended state or none depending on the current
    // state of the user.
    const handleRadioPress = (button: string) => {
        if (button === 'user') {
            (userIdentity !== 'user') ? setUserIdentity('user') : setUserIdentity('none');
        } else {
            (userIdentity !== 'organization') ?
                setUserIdentity('organization') : setUserIdentity('none')
        }
    };

    // will determine if we should push to the user or organization setup page.
    const determinePush = () => {
        // this should not be possbile but nonetheless.
        switch (userIdentity) {
            case 'none':
                return;
            case 'user':
                router.push('/(auth)/AccountSetup/(userSetup)');
                break; 
            case 'organization':
                router.push('/(auth)/AccountSetup/(organizationSetup)');
                break;
        }
    }

    const header = (
        <React.Fragment>
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
            <Text
                style={{
                    marginTop: 60,
                    fontWeight: "800",
                    fontSize: 40,
                    textAlign: "center",
                }}
            >
                Lets get started!
            </Text >
            <Text
                style={{
                    marginTop: 80,
                    fontWeight: "800",
                    fontSize: 32,
                    textAlign: "center",
                }}
            >
                I am a...
            </Text>
        </React.Fragment>
    );

    const form = (
        <View>
            <View
                style={{
                    marginTop: 100,
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: "space-around",
                    alignItems: 'center',
                }}>
                <TouchableOpacity
                    activeOpacity={.6}
                    onPress={() => handleRadioPress('user')}
                    style={{
                        backgroundColor: (userIdentity !== 'user' ? SECONDARY_COLOR : PRIMARY_COLOR),
                        paddingVertical: 12,
                        borderRadius: 10,
                        marginBottom: 12,
                        width: '40%',
                        height: 60,
                        alignItems: "center",
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
                        User
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={.6}
                    onPress={() => handleRadioPress('organization')}
                    style={{
                        backgroundColor: (userIdentity !== 'organization' ? SECONDARY_COLOR :
                            PRIMARY_COLOR),
                        paddingVertical: 12,
                        borderRadius: 10,
                        marginBottom: 12,
                        alignItems: "center",
                        width: '40%',
                        height: 60,
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
                        Organization
                    </Text>
                </TouchableOpacity>
            </View>
            <HelperText type='info' visible={userIdentity !== 'none'}>

                <Text>
                    {(userIdentity === 'none') && '\n\n\n'}
                    {(userIdentity === 'user') && "Users will: \
\n\u2022 Look through many different organization-hosted events. \
\n\u2022 Learn in-depth information about each event & its organization. \
\n\u2022 RSVP to interesting volunteering events with ease!"}
                    {(userIdentity === 'organization') && "Organizations will: \
\n\u2022 Create & edit volunteering event posts. \
\n\u2022 Reach an active set of volunteers in search of events. \
\n\u2022 Track who has RSVP'd to your events!"}
                </Text>
            </HelperText>
        </View>

    );

    const footer = (
        <View style={{
            flex: 1,
            paddingTop: 180,

            alignContent: 'center',
            alignItems: 'center'
        }}>

            <TouchableOpacity
                activeOpacity={.4}
                style={{
                    backgroundColor: (userIdentity !== 'none' ? BUTTON_COLOR : BUTTON_DISABLED),
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginBottom: 12,
                    alignItems: "center",
                    width: '40%',
                }}
                disabled = {userIdentity === 'none'}
                onPress={determinePush}
            >
                <Text style={{ fontWeight: "600", fontSize: 16, color: "white" }}>
                    Next
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <GVArea>
                    {header}
                    {form}
                    {footer}
        </GVArea>
    )
}