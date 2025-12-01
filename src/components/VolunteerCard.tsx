import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/colors'
import { Avatar } from 'react-native-paper'

type VolunteerCardProps = {
    firstName: string,
    lastName: string,
    email: string,
    age?: number,
    gender?: 'male' | 'female' | 'other' | null,
    phone?: string
    profilePictureURI?: string,
    profilePictureURL?: string
};

export default function VolunteerCard(props: VolunteerCardProps) {

    //console.log("props: ", props)

    const header = (
        <View
            style={{
                width: '100%',
                paddingBottom: 10,
                borderBottomWidth: .5,
                borderBottomColor: '#B8B8B8',
            }}
        >
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                Volunteer Info
            </Text>

            <View 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    marginLeft: 10, 
                    marginTop: 10,
                    alignItems: 'center'
                    }}
            >
                <Avatar.Image
                    size={50}
                    source={(props.profilePictureURI ?
                        { uri: props.profilePictureURI } :
                        (props.profilePictureURL ?
                            { uri: props.profilePictureURL } :
                            require('@/assets/icons/default-volunteer.png')
                        )
                    )}
                    style={{ marginRight: 20 }} />

                <View style={{ display: 'flex' }}>
                    <Text
                        style={{
                            fontWeight: "500",
                            fontSize: 13,
                        }}
                    >
                        {props.firstName} {props.lastName}
                    </Text>

                    <Text
                        style={{
                            fontWeight: "500",
                            fontSize: 12,
                            color: "#656565",
                        }}
                    >
                        { (props.age) && `${props.age} years old `} 
                        { ((props.age) && (props.gender !== null)) && '| '}
                        { (props.gender !== null ) && props.gender}
                    </Text>
                </View>

            </View>
        </View>
    );

    const body = (
        <View style={{ width: '100%', marginBottom: 5 }}>
            
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Ionicons
                    name="mail-outline"
                    size={20}
                    color={SECONDARY_COLOR}
                    style={{
                        marginRight: 5,
                    }}
                />
                <View>
                    <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
                        {props.email}
                    </Text>
                </View>
            </View>

            {props.phone && (
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Ionicons
                    name="call-outline"
                    size={20}
                    color={SECONDARY_COLOR}
                    style={{
                        marginRight: 4,
                    }}
                />
                <View>
                    <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
                        {props.phone}
                    </Text>
                </View>
            </View>
            )}
        </View>
    );

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
                width: '100%',
                height: 'auto'
            }}
        >
            
            {header}
            {body}

        </View>
    )
}