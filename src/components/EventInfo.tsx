import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SECONDARY_COLOR, BUTTON_COLOR } from '../constants/colors';
import supabase from '../utils/requests';
import { storage } from '../utils/storage';
import { useRouter } from 'expo-router';

type UserType = 'organization' | 'volunteer' | 'owner';

type EventInfoProps = {
    id: number,
    name?: string,
    description?: string,
    categoryName?: string,
    maxVolunteers?: number,
    currentVolunteers?: number,
    timestampz: string,
    city?: string,
    state?: string,
    imageURI?: string,
    publicImageURL?: string,
    disabled?: boolean,
    organization_id?: string,
}

export default function EventInfo(props: EventInfoProps) {
    const [formattedDate, setFomattedDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
    const [isRSVPed, setIsRSVPed] = useState<boolean>(false);
    const [userType, setUserType] = useState<UserType>();
    const router = useRouter();

    const warnBeforeCancelRSVP = (): Promise<boolean> => {
        return new Promise((resolve) => {
            Alert.alert(
                'Cancel RSVP?',
                'Are you sure you want to cancel the RSVP to this event?',
                [
                    {
                        text: 'Go back',
                        style: 'cancel',
                        onPress: () => resolve(false),
                    },
                    {
                        text: 'Cancel RSVP',
                        style: 'destructive',
                        onPress: () => resolve(true),
                    },
                ]
            );
        });
    };

    const cancelRSVP = async () => {
        if (userType !== 'volunteer' || props.disabled && props.id == undefined)
            return

        const proceed = await warnBeforeCancelRSVP();

        if (!proceed) {
            return
        }

        console.log(`[EventInfo] attempting to cancel RSVP for event`)
        const uid = await storage.get('userUID')
        const { error } = await supabase.from('rsvps')
            .delete()
            .eq('volunteer_id', uid)
            .eq('event_id', props.id)
        if (error != null) {
            console.log('[EventInfo] Error canceling RSVP for user,', error);
            return;
        }
        setIsRSVPed(false)
        console.log('[EventInfo] Cancel successful')

        router.back();
    }

    const registerRSVP = async () => {
        if (userType !== 'volunteer' || props.disabled && props.id == undefined)
            return
        const uid = await storage.get('userUID')
        console.log(`[EventInfo] attempting to RSVP for event`)
        const { error } = await supabase.from('rsvps')
            .insert({ event_id: props.id, volunteer_id: uid })
        if (error != null) {
            console.log('[EventInfo] Error RSVPing user,', error);
            return;
        }
        setIsRSVPed(true)
        console.log('[EventInfo] RSVP successful')
    }

    const handleEditEvent = () => {
        router.push({
            pathname: '/editEvent/EditEvent',
            params: {
                id: props.id,
                name: props.name,
                description: props.description,
                categoryName: props.categoryName,
                timestampz: props.timestampz,
                publicImageURL: props.publicImageURL || props.imageURI,
                city: props.city,
                state: props.state,
                maxVolunteers: props.maxVolunteers,
            }
        });
    }

    const formatDate = (d: Date) => {
        const formattedDate = d.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        setFomattedDate(formattedDate);
    }

    const formatTime = (date: Date | null) => {
        if (!date) return "";
        const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        setFormattedTime(formattedTime);
    }

    const getIsRSVPed = async (userType: UserType) => {
        if (userType !== 'volunteer' || props.disabled && props.id == undefined) {
            console.log('[EventInfo] Declining to fetch RSVP status')
            return
        }
        const uid = await storage.get('userUID')
        const { data, error } = await supabase.from('rsvps')
            .select('*')
            .eq('volunteer_id', uid)
            .eq('event_id', props.id)
        if (error != null) {
            console.error(`[EventInfo] Failed to get RSVP status for user ${uid} and event ${props.id}:`, event)
            return
        }

        const status = data.length > 0
        setIsRSVPed(status)
        console.log(`[EventInfo] Got RSVP status -- ${status}`)
    }

    const init = async () => {
        let userType = await storage.get('userType') as UserType;

        if (userType === 'organization') {
            // find if org is owner or other.
            const uid = await storage.get('userUID');
            userType = uid === props.organization_id ? 'owner' : 'organization';
        } else {
            getIsRSVPed(userType);
        }
        setUserType(userType);

        const dateTime = new Date(props.timestampz);
        formatDate(dateTime);
        formatTime(dateTime);
    }

    useEffect(() => {
        init();
    }, []);

    const header = (
        <View
            style={{
                width: '100%',
                paddingBottom: 10,
                borderBottomWidth: .5,
                borderBottomColor: '#B8B8B8',
            }}
        >
            {/* Name of events + tag */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Name Of events */}
                <View>
                    <Text
                        style={{
                            lineHeight: 20,
                            fontWeight: "600",
                            fontSize: 16
                        }}
                    >
                        {props.name}
                    </Text>
                </View>
                {/* Tag */}
                <View
                    style={{
                        backgroundColor: SECONDARY_COLOR,
                        paddingVertical: 2,
                        paddingHorizontal: 35,
                        borderRadius: 20,
                        width: 120,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            width: 100,
                            color: 'white',
                            fontWeight: "600",
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        {props.categoryName || 'ERROR'}
                    </Text>
                </View>
            </View>
        </View>
    );

    const body = (
        <View style={{ marginVertical: 5 }}>
            {/* Date */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Ionicons
                    name="calendar-clear-outline"
                    size={20}
                    color={SECONDARY_COLOR}
                    style={{
                        marginRight: 5,
                    }}
                />

                <View>
                    <Text style={{ color: "#656565", fontSize: 13, lineHeight: 25 }}>
                        {formattedDate}
                    </Text>
                </View>
            </View>
            {/* Time */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 110,
                }}
            >
                <Ionicons
                    name="time-outline"
                    size={20}
                    color={SECONDARY_COLOR}
                    style={{
                        marginRight: 5,
                    }}
                />
                <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
                    {formattedTime}
                </Text>
            </View>

            {/* Location */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Ionicons
                    name="location-outline"
                    size={20}
                    color={SECONDARY_COLOR}
                    style={{
                        marginRight: 5,
                    }}
                />
                <View>
                    <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
                        {props.city} | {props.state}
                    </Text>
                </View>
            </View>
            {/* Volunteers */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Ionicons
                    name="person-outline"
                    size={20}
                    color={SECONDARY_COLOR}
                    style={{
                        marginRight: 5,
                    }}
                />
                <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
                    {props.currentVolunteers}/{props.maxVolunteers} Volunteers
                </Text>
            </View>
        </View>
    );

    const footer = (
        <View style={{
            marginVertical: 5,
            borderTopWidth: .5,
            borderBottomWidth: .5,
            borderColor: '#B8B8B8',
        }}>
            {props.imageURI && (
                <Image
                    source={{ uri: props.imageURI }}
                    style={{
                        marginTop: 5,
                        borderRadius: 5,
                        width: '100%',
                        height: 180,
                        alignSelf: 'center'
                    }} />
            )}
            {/* About this event */}
            <Text
                style={{
                    fontWeight: "600",
                    marginTop: 5,
                }}
            >
                About this Event
            </Text>
            {/* Description */}
            <Text
                style={{
                    color: "#656565",
                    fontWeight: "400",
                    fontStyle: 'italic',
                    fontSize: 14,
                    marginVertical: 5,
                }}
            >
                {props.description}
            </Text>
        </View>
    )

    const button = (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 5,
            }}
        >
            {userType === 'volunteer' &&
                (
                    <TouchableOpacity
                        style={{
                            backgroundColor: BUTTON_COLOR,
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            borderRadius: 10,
                            flex: 1,
                            marginBottom: 12,
                            alignItems: "center",
                        }}
                        onPress={isRSVPed ? cancelRSVP : registerRSVP}
                        disabled={props.disabled}
                    >
                        <Text style={{ fontWeight: "600", fontSize: 14, color: "white" }}>
                            {isRSVPed ? "Cancel RSVP" : "RSVP"}
                        </Text>
                    </TouchableOpacity>
                )}
            {userType === 'owner' &&
                (
                    <TouchableOpacity
                        style={{
                            backgroundColor: BUTTON_COLOR,
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            borderRadius: 10,
                            flex: 1,
                            marginBottom: 12,
                            alignItems: "center",
                        }}
                        onPress={handleEditEvent}
                        disabled={props.disabled}
                    >
                        <Text style={{ fontWeight: "600", fontSize: 14, color: "white" }}>
                            Edit Event
                        </Text>
                    </TouchableOpacity>
                )}
        </View>
    )

    return (
        <View
            style={{
                marginHorizontal: 20,
                marginTop: 10,
                padding: 20,
                paddingBottom: 10,
                borderRadius: 10,
                borderColor: "#B8B8B8",
                borderWidth: 1,
            }}
        >
            {header}
            {body}
            {footer}
            {button}
        </View>
    )
}
