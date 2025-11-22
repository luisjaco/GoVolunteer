import {Ionicons} from '@expo/vector-icons'
import {Pressable, Text, View} from 'react-native'
import {SECONDARY_COLOR, BUTTON_COLOR} from '../constants/colors'

export default function EventInfo() {
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
            Name of Event
          </Text>
        </View>
        {/* Tag */}
        <View
          style={{
            backgroundColor: SECONDARY_COLOR,
            paddingVertical: 2,
            paddingHorizontal: 35,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: "600",
            }}
          >
            Tag
          </Text>
        </View>
      </View>
      {/* Organization Name */}
      <View>
        <Text style={{ color: "#656565", fontWeight: "600", marginBottom: 30 }}>
          Organization Name
        </Text>
      </View>
      {/* Date and Time */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Date */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
              Date
            </Text>
          </View>
        </View>
        {/* Time */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: 110,
          }}
        >
          <Ionicons
            name="time-outline"
            size={20}
            color={SECONDARY_COLOR}
            style={{
              marginRight: 2,
            }}
          />
          <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
            12:00-2PM
          </Text>
        </View>
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
            Location
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
        {/* Border */}
        <View>
          <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
            0/20 Volunteers
          </Text>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: "#B8B8B8", marginTop: 25 }}></View>
      {/* About this event */}
      <View>
        <Text
          style={{
            lineHeight: 20,
            fontWeight: "600",
            marginTop: 15,
          }}
        >
          About this Event
        </Text>
      </View>
      {/* Description */}
      <View>
        <Text
          style={{
            color: "#656565",
            marginTop: 8,
            fontWeight: "400",
            fontSize: 14,
            marginBottom: 25,
          }}
        >
          Description
        </Text>
      </View>
      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 15,
          gap: 15,
        }}
      >
        {/* RSVP Button */}
        <Pressable
          style={{
            backgroundColor: BUTTON_COLOR,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 10,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>
            RSVP
          </Text>
        </Pressable>
        {/* Share Button */}
        <Pressable>
          <Ionicons
            name="share-social-outline"
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
      </View>
    </View>
  )
}
