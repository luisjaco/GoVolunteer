// this card will be used to generate
// a new volunteering event card on the home feed (volunteer view)

import React, { useState, useEffect } from 'react';
import {View, Text, Pressable, TouchableOpacity, Image } from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {BUTTON_COLOR, PRIMARY_COLOR, SECONDARY_COLOR} from "../constants/colors";
import {Link, useRouter} from "expo-router";
import { Avatar } from 'react-native-paper';

type EventCardProps = {
  event_id: number
  name: string
  organization_id: string,
  categoryName: string,
  description?: string,
  state: string,
  city: string,
  maxVolunteers: number,
  currentVolunteers: number,
  imageURI?: string,
  timestampz: string
  organization_profile_picture_url?: string,
  organization_title: string
};

export default function EventCard(props: EventCardProps) {

  const [formattedDate, setFomattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');

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

  useEffect(() => {
    const dateTime = new Date(props.timestampz);
    formatDate(dateTime);
    formatTime(dateTime);
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
    <View style={{marginVertical: 5}}>
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

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar.Image
        size={20}
        style={{marginRight: 5}}
        source={(props.organization_profile_picture_url ?
          { uri: props.organization_profile_picture_url } :
          require('@/assets/icons/default-organization.png')
        )}/>
        <View>
          <Text style={{ color: "#656565", fontSize: 13, lineHeight: 30 }}>
            Hosted by <Text style={{fontWeight:'bold'}}>{props.organization_title || 'SAMPLE'}</Text>
          </Text>
        </View>
      </View>
    </View>
  );


  return (
    <Link href={`/event/${props.event_id}`} push asChild>
      <TouchableOpacity
        activeOpacity={.6}
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
      </TouchableOpacity>

    </Link>

  )
}
