import { Link, router } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { styles } from "@constants/styles";
import { PRIMARY_COLOR } from '@constants/colors';
import { Ionicons } from "@expo/vector-icons";
import { Router } from 'expo-router';
import EventCard from "@/src/components/EventCard";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SafeAreaStatusBar from '@/src/components/SafeAreaStatusBar';

// Added components:

  // TextInput = allows you to take in input, used for the search bar
  // Pressable = a button that you can press and interact with on your scren
  // ScrollView = a container that allows you to scroll within a screen

  // Syntax:
  // <TextInput></TextInput> should be written as
  // <TextInput/> because it doesn't have any inner content

  // Ionicons = a library that contains icons. https://ionic.io/ionicons



export default function Feed() {

  const Header = (
    <View style={{ backgroundColor: PRIMARY_COLOR }}>
      {/*INNER CONTENT WRAPPER*/}
      <View style={{
        marginRight: 20,
        marginLeft: 20
      }}>
        {/*HEADER TITLE*/}
        <Text style={{
          color: 'white',
          paddingTop: 35,
          fontWeight: '500',
          paddingBottom: 10,
          fontSize: 24
        }}>
          Discover Events
        </Text>

        {/*SEARCH AREA*/}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          paddingVertical: 12,
          marginBottom: 25,
          borderRadius: 10
        }}>
          <Ionicons
            name='search'
            size={25}
            color='black'
            style={{
              marginLeft: 15,
              marginRight: 10
            }}
          />
          <TextInput
            placeholder='Search Events...'
            placeholderTextColor='gray'
            style={{
              flex: 1,
              paddingLeft: 0,
              paddingVertical: 0,
              fontSize: 16
            }}
          />
          <Pressable style={{ paddingRight: 20 }}>
            <Ionicons
              name='filter-outline'
              size={25}
              color='black'
            />
          </Pressable>
        </View>
        {/*END SEARCH AREA*/}
      </View>
    </View>
  );

  return (
    <SafeAreaStatusBar>
      {Header}
      <ScrollView>
        <EventCard />
      </ScrollView>
    </SafeAreaStatusBar>
  );
}