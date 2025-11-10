/*
Things to know about React
- A React component is a function that returns UI (in JSX syntax)
- JSX (JavaScript XML) is the syntax that allows us to write HTML-like code in JavaScript
- Expo (using Babel behind the scenes) converts JSX into plain JavaScript with React function calls
- We keep track of the state of the React components via useState
- When state changes, React re-renders the UI so it reflects the new data
- React Native Paper gives us ready-made components with Material Design styles
- Material Design is a Google system with specific guidelines
*/

// import everything from react and save it in an object called React
import * as React from 'react';
// lets us open URLs
import {Linking} from 'react-native';
// allows us to control the style of the time and battery at the top of the phone
import { StatusBar } from 'expo-status-bar';
// StyleSheet helps us define styles similar to CSS but for JS objects
// View is a generic box/container for the layout, similar to <div> in web dev
import { StyleSheet, View } from 'react-native';
// SafeAreaView prevents content from going under the notch or StatusBar
import {SafeAreaView} from 'react-native-safe-area-context';
// imports style design components from react native paper
// PaperProvider is the top-level theme/context provider for all Paper components
// MD3LightTheme / MD3DarkTheme: ready-made light/dark theme objects
// Button, Card, Text, Snackbar, FAB: UI components following Material Design
// snackbar is a pop-up feature similar to JOptionPane in Java GUI, shows a temporary message
// FAB = floating action button
import {
  Provider as PaperProvider,
  MD3LightTheme, // Material Design 3 Light
  MD3DarkTheme,  // Material Design 3 Dark
  Button,
  Card,
  Text,
  Snackbar,
  FAB,
  } from 'react-native-paper';

// export default refers to the main thing this file provides
// define a function named App
// expo will look for this App component and render it
export default function App() {
  // const creates a constant variable (cannot be reassigned)
  // React.useState returns [currentValue, functionToUpdateIt]
  // we set those values to the variables [screen, setScreen]
  // screen = the current screen; setScreen = the function to update the screen
  // useState lets a component remember which screen to show between re-renders
  // the initial value is home
  // < 'home' | 'about' > is a TypeScript type that forces
  // the screen value to only be 'home' or 'about'
  const [screen, setScreen] = React.useState<'home' | 'about'>('home');
  // a constant variable to track the rsvpCount
  // React.useState returns [currentValue, functionToUpdateIt]
  // we set those values to the variables [rsvpCount, setRsvpCount]
  // rsvpCount = current rsvpCount; setRsvpCount = function to update rsvpCount
  // the initial value of rsvpCount is 0
  const [rsvpCount, setRsvpCount] = React.useState(0);
  // creating a constant called snackVisible with default value of false
  const [snackVisible, setSnackVisible] = React.useState(false);
  // creating a constant called dark for dark mode with default value of false
  const [dark, setDark] = React.useState(false);
  // creating a constant called theme
  // if dark is true, then use MD3DarkTheme
  // if dark is false, then use MD3LightTheme
  const theme = dark ? MD3DarkTheme : MD3LightTheme;

  // openInMaps is a constant that holds an arrow function
  // React functions are typically stored as constants and not standalone functions
  // since we view the function as a value belonging to this component
  // The "=>" is arrow-function syntax: const fn = () => { ... } is the same as function fn() { ... }
  // but it's shorter and avoids issues that may arise later
  // in this function, we URL-encode the address (remove characters that can't be in a url)
  // and store it in a constant called address
  // then build an Apple Maps query URL using the address constant and store it in url constant
  // then ask Linking to open the url
  const openInMaps = () => {
    const address = encodeURIComponent('Bryant Park, New York, NY');
    const url = `http://maps.apple.com/?q=${address}`;
    Linking.openURL(url);
  }

  // return statement for the function App
  return (
    // PaperProvider makes the theme and other Paper settings available to all child components (Buttons, Cards, etc.)
    // sets the theme to the constant theme which we defined at the top based on light or dark mode
    <PaperProvider theme={theme}>
      {/* establishes the start of the content in safe area view
          @chatgpt explain what flex 1 does and why i put the style in this line instead of styles. whatever
          flex:1 tells this view to expand and fill the available space (like a flexbox)
          sets backgroundColor based on dark being true '#000' (black) or false '#fff' (white)
          inline style is used because it depends on dark, otherwise static styles go in StyleSheet.create */}
      <SafeAreaView style={{flex:1, backgroundColor: dark ? '#000' : '#fff'}}>
        {/* if the screen is set to 'home', display home page */}
        {screen === 'home' ? (
          // view groups elements
          // styles.container refers to the container portion of
          // the styles constant defined at the end of the code
          <View style={styles.content}>
            {/* displays the text "Home/Events" on the screen
                styles.center refers to the center portion of the styles constant */}
            <Text variant="headlineSmall" style={styles.center}>Home/Events</Text>
            {/* establish the start of a card that holds event info
                a Card is a Material Design surface with a shadow and padding
                meant to group related content/actions */}
            <Card style={{width: '90%'}}>
              <Card.Title title="Park Cleanup" subtitle="Sat 10AM Manhattan"/>
              <Card.Content>
                {/* plain text */}
                <Text>
                  Join us to tidy up the park!
                </Text>
                {/* style={{ marginTop: 8 }} adds 8px space above the Text
                    fontWeight: '600' makes the number appear semi-bold.
                    {rsvpCount} inserts the current RSVP count from state into the UI */}
                <Text style={{marginTop: 8}}>
                  RSVPs: <Text style={{fontWeight: '600'}}>{rsvpCount}</Text>
                </Text>
              </Card.Content>
              {/* defines the actions for each button on the card */}
              <Card.Actions>
                {/* onPress and mode are properties defined by react-native-paper
                    since that's where the button type was imported from
                    onPress calls the constant function openInMaps when the button is clicked
                    "outlined" is a style within the Material Design guidelines*/}
                <Button onPress={openInMaps} mode="outlined">Open in Maps</Button>
                {/* increments the rsvpCount and displays the snackbar
                    when the button is pressed
                    mode=contained is also a Material Design standard
                    will fill the background of the button with the theme's primary color*/}
                <Button
                  onPress={() => {
                    setRsvpCount((n) => n + 1);
                    setSnackVisible(true);
                  }}
                  mode="contained"
                >
                  {/* button displays the test "RSVP" */}
                  RSVP
                </Button>
              </Card.Actions>
            </Card>

            {/* this button navigates to the about screen */}
            <Button style={{marginTop: 12}} onPress={() => setScreen('about')}>
              About
            </Button>
          </View>
        ) : (
          <View style={styles.content}>
            {/** this is where the "else" branch of the conditional begins, if screen !== 'home'
               then we render the about page*/}
            {/** creating a new view with the style content from the styles const */}
            {/* variant = headlineSmall is a typography preset from React Native Paper's theme */}
            <Text variant="headlineSmall" style={styles.center}>About</Text>
            <Text style={styles.center}>
              This app is a practice for our project
            </Text>
            {/* Same idea as the About button above, but this navigates back to 'home' and uses a contained style */}
            <Button style={{marginTop: 12}} mode="contained" onPress={() => setScreen('home')}>
              Back to Home
            </Button>
          </View>
        )}
        {/* snackbar: a transient message bar that appears briefly at the bottom
            to confirm an action or show feedback
            visible={snackVisible}: controls whether it shows
            onDismiss: callback when it hides (we set visible to false)
            action: adds a button on the snackbar; here "Undo" will decrement the count but not below 0
            duration={2000}: auto-hide after ~2 seconds */}
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          action={{
            label: 'Undo',
            onPress: () => setRsvpCount((n) => Math.max(0, n-1)),
          }}
          duration={2000}
        >
          RSVP recorded!
        </Snackbar>
        {/* FAB = Floating Action Button
            this button toggles light and dark mode
            a fab is positioned absolutely, floats above content, does not move while scrolling */}
        <FAB
          // if dark mode, show sun icon; otherwise, show moon icon
          icon={dark ? 'weather-sunny' : 'weather-night'}
          // onPress toggles dark mode; (d) => !d flips the previous boolean value
          // setDark is the updater function we defined when we defined the const dark
          onPress={() => setDark((d) => !d)}
          style={styles.fab}
          // sets the color of the icon/foreground of the button
          color="white"
        />
        {/* sets the status bar to light or dark depending on whether the app is in light or dark mode
            light if dark, dark if light*/}
        <StatusBar style={dark ? 'light' : 'dark'} />
      </SafeAreaView>
    </PaperProvider>
  );
}

// StyleSheet.create collects static styles for performance and clarity
// container/content/center/fab are named style groups we can reuse on Views/Text/etc.
const styles = StyleSheet.create({
  container: {
    flex: 1, // fill available space
  },
  content: {
    flex: 1,
    alignItems: 'center',     // center children horizontally within this view
    justifyContent: 'center', // center children vertically within this view
    gap: 12,                  // adds uniform spacing between child elements
    padding: 24,
  },
  center: {textAlign: 'center'}, // centers the text within the text box
  // style choices for the fab
  fab: {
    position: 'absolute',
    right: 16,  // 16px from the right
    bottom: 24, // 24 px from the bottom
  },
});
