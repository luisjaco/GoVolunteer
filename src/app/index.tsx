import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SafeAreaStatusBar from '../components/SafeAreaStatusBar';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@constants/colors';
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@constants/styles";
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export default function WelcomeScreen() {
  return (
    <SafeAreaStatusBar>
      <View
        style={{
          flex: 1,
          backgroundColor: PRIMARY_COLOR,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 60,
        }}
      >

        {/* Logo + Titles */}
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            source={require('@/assets/icons/earthLogo.png')}
            style={{ width: 200, height: 200, marginBottom: 50 }}
          />

          {/* Main Title */}
          <Text
            style={{
              color: "white",
              fontWeight: "800",
              fontSize: 32,
              textAlign: "center",
            }}
          >
            GoVolunteer
          </Text>

          {/* Subtext */}
          <Text
            style={{
              color: "white",
              fontWeight: "400",
              fontSize: 16,
              marginTop: 8,
              marginBottom: 60,
              textAlign: "center",
            }}
          >
            Connect with opportunities to make a difference
          </Text>
        </View>

        {/* Buttons Column */}
        <View style={{ width: "80%" }}>
          {/* Sign In */}
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              paddingVertical: 12,
              borderRadius: 10,
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 16, color: PRIMARY_COLOR }}>
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Sign Up as Volunteer */}
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              paddingVertical: 12,
              borderRadius: 10,
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 16, color: PRIMARY_COLOR }}>
              Sign Up as Volunteer
            </Text>
          </TouchableOpacity>

          {/* Sign Up as Organization */}
          <TouchableOpacity
            style={{
              backgroundColor: PRIMARY_COLOR,
              borderWidth: 2,                
              borderColor: "white",
              paddingVertical: 12,
              borderRadius: 10,
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 16, color:"white" }}>
              Sign Up as Organization
            </Text>
          </TouchableOpacity>
        </View>
        
        <Link href='/(tabs)/(feed)' push asChild>
            <TouchableOpacity style={{ padding: 10, alignItems: "center", justifyContent: "center"}}>
                <Text style={{ color: "white", fontSize: 16 }}>Dev skip</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaStatusBar>
  );
}


/*

<Link href='/(tabs)/(feed)' push asChild>
                <Button>
                    Move to main tabs!
                </Button>
            </Link>
        </SafeAreaStatusBar>
    Right here is a general overview of all the pages we will be making and whos doing what

    Nicole
    | Homepage (will show title and show signIn, signUpUser, and signUpOrganization buttons.)
    | - SignIn (take in all users & organizations)
    | - SignUpUser (username, firstname, lastname, password, email, etc.)
    | - SignUpOrganization (username, orgname, password, email, url, etc.)

    Matt
    | HomeFeed (display what evens are posted)
    | - EventCard (basic info for the event)
    | - EventInfo (in-depth info page for the event, rsvp button)

    Daniella
    | ViewAccount (show current rsvps, username, pfp, etc.)
    | - EditAccount (change username, pfp, password, name, etc.)

    ^v honestly these two can be pretty similar with slight changes.

    Emily
    | ViewOrganization (organization info, current posts)
    | - EditOrganization (change username, pfp, password, etc)
    
    Logan
    | - EventInfoOrganization (EventInfo but for orgs, will show whos rsvp and an edit button)
    | - EditEvent (edit location, pictures, names, etc.)
    | - CreateEvent

    Luis 
    | NavBar
    ** Look into backend

  */