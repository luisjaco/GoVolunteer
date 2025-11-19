// this card will be used to generate
// a new volunteering event card on the home feed (volunteer view)

import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"
import { BUTTON_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from "../constants/colors";
import { useState } from 'react';
import EventModal from "./EventModal";

export default function EventCard() {

  // whether or not to show modal of the card...
  const [modalVisible, setModalVisible] = useState(false);

  const Header = (
    <>
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
              color: "white",
              fontWeight: "600",
            }}
          >
            Tag
          </Text>
        </View>
      </View>
      {/* Organization Name */}
      <View>
        <Text style={{ color: "#656565", fontWeight: "600" }}>
          Organization Name
        </Text>
      </View>
    </>
  );

  const Description = (
    <>
      {/* Description */}
      <View>
        <Text
          style={{
            color: "#656565",
            marginTop: 8,
            fontWeight: "400",
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          Description
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
        <View>
          <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
            0/20 Volunteers
          </Text>
        </View>
      </View>
    </>
  );

  const Buttons = (
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

      {/* View Button */}
      <Pressable
        onPress={() => setModalVisible(() => true)}
        style={{
          backgroundColor: "#FFF",
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 10,
          borderWidth: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600" }}>View</Text>
      </Pressable>
    </View>
  )

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 20,
        padding: 20,
        paddingBottom: 10,
        borderRadius: 10,
        borderColor: "#B8B8B8",
        borderWidth: 1, 
      }}
    >
      {Header}
      {Description}
      {Buttons}
      <EventModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    </View>
  );
}
