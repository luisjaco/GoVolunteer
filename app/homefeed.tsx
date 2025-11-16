import { Link } from 'expo-router'
import {View, Text, TextInput, Pressable, ScrollView} from 'react-native'
import styles from "./constants/styles"
import { Ionicons } from "@expo/vector-icons"


//Added components:

  //TextInput = allows you to take in input, used for the search bar
  //Pressable = a button that you can press and interact with on your scren
  //ScrollView = a container that allows you to scroll within a screen 

  //Syntax:
  //<TextInput></TextInput> should be written as
  //<TextInput/> because it doesn't have any inner content

  //Ionicons = a library that contains icons. https://ionic.io/ionicons


export default function HomeFeed() {

  return (
    <View style={{ flex: 1 }}>

      {/* HEADER */}
      <View style={{ backgroundColor: "#00A63E" }}>

        {/* INNER CONTENT WRAPPER */}
        <View style={{ marginRight: 20, marginLeft: 20 }}>

          {/* Header Title */}
          <Text
            style={{
              color: "white",
              paddingTop: 40,
              fontWeight: "500",
              paddingBottom: 10,
              fontSize: 24,
            }}
          >
            Discover Events
          </Text>

          {/* Search Area */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              paddingVertical: 12,
              marginBottom: 25,
              borderRadius: 10,
            }}
          >

            {/* Search Icon */}
            <Ionicons
              name="search"
              size={25}
              color="black"
              style={{
                marginLeft: 15,
                marginRight: 10,
              }}
            />

            {/* Text Input */}
            <TextInput
              placeholder="Search events..."
              placeholderTextColor="gray"
              style={{
                flex: 1,
                paddingLeft: 0,
                paddingVertical: 0,
                fontSize: 16,
              }}
            />

            {/* Filter Button */}
            <Pressable style={{ paddingRight: 20 }}>
              <Ionicons
                name="filter-outline"
                size={25}
                color="black"
              />
            </Pressable>

          </View>

        </View> {/* END INNER WRAPPER */}

      </View> {/* END HEADER */}

      {/* MAIN CONTENT */}
      <ScrollView>
        <View
          style={{
            backgroundColor: "red",
            marginHorizontal: 20,
            marginTop: 20,
            padding: 20,
            paddingBottom: 20,
            borderRadius: 10
          }}
        >
          <View style={{
            flexDirection: "row", 
            alignItems: "center",
            justifyContent: "space-between" //puts space between the elements in the flex box
            }}
          >
            <View>
              <Text>Name of Event</Text>  
            </View>

            <View>
              <Text>Tag</Text>
            </View>

          </View>
            
            <View>
              {/* placeholder needed for updated organization name details */}
              <Text>Organization Name</Text>
            </View> 

             <View>
              {/* placeholder needed for updated description details */}
              {/* To make sure that the description doesn't change the size of the card, we'll limit the amount of characters the description can have */}
              <Text>Description</Text>
             </View> 
             
            <View style={{
            flexDirection: "row", 
            alignItems: "center",
            }}
          >
            <View>
              {/* placeholder needed for updated date details */}
              <Text style={{fontSize: 14}}>Date</Text>  
            </View>

            <View>
              {/* placeholder needed for updated time details */}
              <Text style={{fontSize: 14}}>12:00-2PM</Text>
            </View>

          </View>

             <View>
              {/* placeholder needed for updated location details */}
              <Text style={{fontSize: 14}}>Location</Text>
             </View> 

             <View>
              {/* placeholder needed required for updated volunteer number */}
              <Text style={{fontSize: 14}}>0/20 volunteers</Text> 
             </View> 
             

            {/* Container for RSVP and View Buttons*/}
            <View style={{
              flexDirection: "row", 
              justifyContent: "space-between",
              marginTop: 15
              }}
            >
              {/* RSVP Button */}
              <View style={{
                backgroundColor: "#FFF",
                padding: 20,
      
                }}
              >
                <Text style={{fontSize: 14}}>RSVP</Text>
              </View>

              {/* RSVP Button */}
              <View style={{
                backgroundColor: "#FFF",
                padding: 20
                }}
              >
                <Text style={{fontSize: 14}}>View</Text>
              </View>
            </View>
            

            

        </View>
      </ScrollView>

      {/* For the Footer Component*/}

    </View>
  );
}


