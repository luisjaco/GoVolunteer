import * as React from 'react';
import {Linking} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Button,
  Card,
  Text,
  Snackbar,
  FAB,
  } from 'react-native-paper';

/*
  This is called a Component, it basically is a function used in React which has the function of 
  creating an element (HTML)

  Regular javascipt applies, and we can write HTML as one element by wrapping the HTML in 
  parenthesis (). To put code/variables inside of the HTML, we use curly brackets {}
*/
export default function App() {
  /*
    All this React.useState stuff basically makes it so variables can change and the UI will display
    the changes in real time.
    
    const [variable, setVariable] = React.useState(defaultValue);
    setVariable(newValue);
    
    * Note that if you made a regular variable and have function (like an event handler) which 
    changes it, the UI won't display the changes.

    Things like .useState (and anything that starts with .use____) are called Hooks. Hooks are
    functions from React which essentially allow you to alter the rendering of the UI.

    Follow the naming convention!!!
  */
  const [screen, setScreen] = React.useState<'home' | 'about'>('home');
  const [rsvpCount, setRsvpCount] = React.useState(0);
  const [snackVisible, setSnackVisible] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const theme = dark ? MD3DarkTheme : MD3LightTheme;

  const openInMaps = () => {
    const address = encodeURIComponent('Bryant Park, New York, NY');
    const url = `http://maps.apple.com/?=${address}`;
    Linking.openURL(url);
  }

  /*
    All the rest of this stuff is basically HTML, remember that using {} allows you to put code or
    logic inside of the HTML.

    * Note that when you make a component, the return statement has to have only one parent HTML
    element.
  */
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{flex:1, backgroundColor: dark ? '#000' : '#fff'}}>
        {screen === 'home' ? (
          <View style={styles.content}>
            <Text variant="headlineSmall" style={styles.center}>Home/Events</Text>
            <Card style={{width: '90%'}}>
              <Card.Title title="Park Cleanup" subtitle="Sat 10AM Manhattan"/>
              <Card.Content>
                <Text>
                  Join us to tidy up the park!
                </Text>
                <Text style={{marginTop: 8}}>
                  RSVPs: <Text style={{fontWeight: '600'}}>{rsvpCount}</Text>
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={openInMaps} mode="outlined">Open in Maps</Button>
                <Button
                  onPress={() => {
                    /* this right here is a lambda function in place of an event handler (when you 
                    press the button, this will trigger)
                    */
                    setRsvpCount((n) => n + 1);
                    setSnackVisible(true);
                  }}
                  mode="contained"
                >
                  RSVP
                </Button>
              </Card.Actions>
            </Card>

            <Button style={{marginTop: 12}} onPress={() => setScreen('about')}>
              About
            </Button>
          </View>
        ) : (
          <View style={styles.content}>
            <Text variant="headlineSmall" style={styles.center}>About</Text>
            <Text style={styles.center}>
              This app is a practice for our project
            </Text>
            <Button style={{marginTop: 12}} mode="contained" onPress={() => setScreen('home')}>
              Back to Home
            </Button>
          </View>
        )}
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

        <FAB
          icon={dark ? 'weather-sunny' : 'weather-night'}
          onPress={() => setDark((d) => !d)}
          style={styles.fab}
          color="white"
        />
        <StatusBar style={dark ? 'light' : 'dark'} />
      </SafeAreaView>
    </PaperProvider>
  );
}

// CSS stuff to alter the page.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  center: {textAlign: 'center'},
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});
