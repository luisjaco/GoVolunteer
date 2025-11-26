import {Ionicons} from '@expo/vector-icons'
import {Link} from 'expo-router'
import {Pressable, Text, View} from 'react-native'
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../constants/colors'

export default function OrganizationCard() {
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
      {/* Organization Info */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              lineHeight: 20,
              fontWeight: "600",
              fontSize: 13,
              marginBottom: 30,
            }}
          >
            Organization Info
          </Text>
        </View>

        {/* More Info Button */}
        <Link href="/infoScreens/OrganizationInfo" push asChild>
          <Pressable>
            <Ionicons
              name="information-circle-outline"
              size={30}
              style={{
                borderWidth: 1.5,
                borderColor: "#898989",
                borderRadius: 10,
                paddingVertical: 4,
                paddingHorizontal: 4,
                justifyContent: "center",
                paddingRight: 5,
              }}
            />
          </Pressable>
        </Link>
      </View>

      {/* Profile picture, Organization name, organization motto */}
      <View style={{ flexDirection: "row", marginLeft: 10, marginBottom: 30 }}>
        {/* Profile Picture */}
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 35, // 70 / 2 = 35 -> circle
            backgroundColor: PRIMARY_COLOR,
            justifyContent: "center", // ← centers children vertically
            alignItems: "center", // ← centers children horizontally
          }}
        >
        </View>

        {/* Organization name+motto */}
        <View style={{ flexDirection: "column", marginLeft: 7 }}>
          {/* Organization name */}
          <Text
            style={{
              lineHeight: 20,
              fontWeight: "500",
              fontSize: 13,
            }}
          >
            John Doe Foundation
          </Text>

          {/* Organization motto */}
          <Text
            style={{
              lineHeight: 15,
              fontWeight: "500",
              fontSize: 12,
              color: "#656565",
            }}
          >
            Dedicated to preserving the John Doe ecosystem
          </Text>
        </View>
      </View>

      {/* Phone number */}
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
            (123)-456-7890
          </Text>
        </View>
      </View>


      {/* Email */}

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
            john.doe@nyit.edu
          </Text>
        </View>
      </View>


      {/* Website */}

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
            marginRight: 5,
          }}
        />

        <View>
          <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
            john-doe.org
          </Text>
        </View>
      </View>
    </View>
  )
}
