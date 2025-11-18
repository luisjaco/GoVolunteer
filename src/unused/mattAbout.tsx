import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Link } from "expo-router";

import styles from "@constants/styles" // adjust if needed

export default function about(){
  return (
    <View style={styles.content}>
      <Text> Testing testing 123, this is the about page</Text>


      <View>
        <Link href="/" style={styles.links}>Back To Home</Link>
      </View>
      
    </View>
  );
};


