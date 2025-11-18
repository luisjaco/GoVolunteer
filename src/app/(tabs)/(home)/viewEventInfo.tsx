import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function () {
  const router = useRouter();

  return (
    
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ backgroundColor: "#00A63E", paddingBottom: 25 }}>
        <View style={{ marginLeft: 20, marginRight: 20, marginTop: 15 }}>
          {/* Back Button */}
          <View style={{ marginTop: 8 }}>
            <Pressable
              onPress={() => router.dismissTo('/(tabs)/(home)')}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="arrow-back-outline"
                size={40}
                color="#000"
                strokeWidth={1}
              />
            </Pressable>
          </View>
        </View>
      </View>

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
              backgroundColor: "rgba(0,166,62,.43)",
              paddingVertical: 2,
              paddingHorizontal: 35,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#006B28",
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
              color="#00A63E"
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
              color="#00A63E"
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
            color="#00A63E"
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
            color="#00A63E"
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
              backgroundColor: "#00A63E",
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

      {/* Second card (Organization Info) */}
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
        </View>

        {/* Profile picture, Organization name, organization motto */}
        <View style={{ flexDirection: "row", marginLeft: 10, marginBottom: 30 }}>
          {/* Profile Picture */}
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 35, // 70 / 2 = 35 -> circle
              backgroundColor: "#00A63E",
              justifyContent: "center", // ← centers children vertically
              alignItems: "center", // ← centers children horizontally
            }}
          ></View>

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
            color="#00A63E"
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
            color="#00A63E"
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
            color="#00A63E"
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
    </View>
  );
}