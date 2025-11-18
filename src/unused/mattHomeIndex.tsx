import React, { useState } from "react";
import { View, Linking, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Card, Text, Button } from "react-native-paper";

import styles from "@constants/styles" //import styles 

export default function Home() { //same as const Home = () => {(return)}
  
  const [rsvpCount, setRsvpCount] = useState(0);
  const [snackVisible, setSnackVisible] = useState(false);

  const openInMaps = () => {
    const address = encodeURIComponent("Bryant Park, New York, NY");
    const url = `http://maps.apple.com/?q=${address}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.content}>
      <Text variant="headlineSmall" style={styles.center}>
        Home / Events
      </Text>

      <Card style={{ width: "90%" }}>
        <Card.Title title="Park Cleanup" subtitle="Sat 10AM Manhattan" />
        <Card.Content>
          <Text>Join us to tidy up the park!</Text>

          <Text style={{ marginTop: 8 }}>
            RSVPs: <Text style={{ fontWeight: "600" }}>{rsvpCount}</Text>
          </Text>
        </Card.Content>

        <Card.Actions>
          <Button onPress={openInMaps} mode="outlined">
            Open in Maps
          </Button>

          <Button
            mode="contained"
            onPress={() => {
              setRsvpCount((n) => n + 1);
              setSnackVisible(true);
            }}
          >
            RSVP
          </Button>
        </Card.Actions>
      </Card>

      {/* Navigation using Expo Router */}
      <View style={{ marginTop: 20 }}>
        <Link href="/about" style={styles.links}>
          To About Page
        </Link>

        <Link href="/homeFeed" style={styles.links}>
          To HomeFeed
        </Link>
      </View>
    </View>
  )
}

