import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GVArea from '@components/GVArea';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@constants/colors';
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@constants/styles";
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export default function WelcomeScreen() {
  return (
    <GVArea>
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
            Connect with opportunities to make a difference!
          </Text>
        </View>

        {/* Buttons Column */}
        <View style={{ width: "80%" }}>
          <Link href='/(auth)' push asChild>
            {/* Sign In */}
            <TouchableOpacity
              activeOpacity={.4}
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
          </Link>
          
          {/* Sign Up as Volunteer */}
          <Link href="/SignUp" push asChild>
            <TouchableOpacity
              activeOpacity={.6}
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
          </Link>
          
          {/* Sign Up as Organization */}
          <TouchableOpacity
            activeOpacity={.4}
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
        
        <Link href='/feed' push asChild>
            <TouchableOpacity style={{ padding: 10, alignItems: "center", justifyContent: "center"}}>
                <Text style={{ color: "white", fontSize: 16 }}>Dev skip</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </GVArea>
  );
}