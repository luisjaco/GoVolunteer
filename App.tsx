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

export default function App() {
  const [screen, setScreen] = React.useState<'home' | 'about'>('home');
  const [rsvpCount, setRsvpCount] = React.useState(0);
  const [snackVisible, setSnackVisible] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const theme = dark ? MD3DarkTheme : MD3LightTheme;

  const openInMaps = () => {
    const address = encodeURIComponent('Bryant Park, New York, NY');
    const url = 'http://maps.apple.com/?=${address}';
    Linking.openURL(url);
  }

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
