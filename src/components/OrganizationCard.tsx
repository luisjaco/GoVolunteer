import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/colors'
import { Avatar } from 'react-native-paper'

type OrganizationCardProps = {
  title: string,
  motto?: string,
  phone: string,
  email: string,
  organizationURL: string,
  state: string,
  city: string,
  address?: string,
  description?: string,
  profilePictureURI?: string,
  profilePictureURL?: string,
  disabled?: boolean
}

export default function OrganizationCard(props: OrganizationCardProps) {
  // console.log(props);
  
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
        Organization Info
      </Text>

      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          marginLeft: 10,
          marginTop: 10,
          alignItems: 'center',
        }}
      >
        <Avatar.Image
          size={50}
          source={(props.profilePictureURI ?
            { uri: props.profilePictureURI } :
            (props.profilePictureURL ?
              { uri: props.profilePictureURL } :
              require('@/assets/icons/default-organization.png')
            )
          )}
          style={{ marginRight: 20 }} />

        <View style={{ display: 'flex', width: '75%' }}>
          <Text
            style={{
              fontWeight: "500",
              fontSize: 13,
            }}
          >
            {props.title}
          </Text>

          <Text
            style={{
              fontWeight: "500",
              fontSize: 12,
              color: "#656565",
            }}
          >
            {props.city} | {props.state}
          </Text>

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              color: "#656565",
              fontStyle: 'italic',
            }}
          >
            {props.motto && (props.motto)}
          </Text>
        </View>

      </View>
    </View>
  );

  const description = (
    <View
      style={{
        paddingVertical: 5,
        borderBottomWidth: .5,
        borderBottomColor: '#B8B8B8',
      }}
    >
      <Text style={{fontWeight: 'bold', color: '#656565', fontSize: 10}}>
        {props.description}
      </Text>
    </View>
  )

  const body = (
    <View style={{ marginBottom: 5 }}>

                {props.description && (description)}
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

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="globe-outline"
          size={20}
          color={SECONDARY_COLOR}
          style={{
            marginRight: 4,
          }}
        />
        <View>
          <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
            {props.organizationURL}
          </Text>
        </View>
      </View>

      {props.address && (
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
            marginRight: 4,
          }}
        />
        <View>
          <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
            {props.address}
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
        width: '90%',
        height: 'auto'
      }}
    >

      {header}
      {body}

    </View>
  )
}
