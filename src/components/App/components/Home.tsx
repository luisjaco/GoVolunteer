import React from 'react';

/*
  View: Basically a component which React Native maps to its respective platform (iOS, andriod, web)
  Linking: Interface to create links to other apps (using Deep Links/Universal Links), emails, and
  the web
*/
import {View, Linking} from 'react-native';

/*
  React native paper is basically a React Native Library which follows Material Design standards
  (where Material Design is a set of standards/styles aimed to maintain consistency and easy design,
  think about how all of Google's apps follow the same style, thats Material Design).
  React Native Paper just gives you pre-made componenets to use.

  Card: Basically a little box which stands out from the background
  Text: Literally just text
  Button: A button
*/
import {Card, Text, Button} from 'react-native-paper';

// Just a CSS stylesheet basically
import styles from '../../../constants';

// Typescript props declaration of types
// Props are basically parameters which are put inside of componentes the same way you would in HTML
type HomeProps = {
  rsvpCount: number,
  setRsvpCount: React.Dispatch<React.SetStateAction<number>>,
  setSnackVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setScreen: React.Dispatch<React.SetStateAction<'home' | 'about'>>
};

export default function Home({rsvpCount, setRsvpCount, setSnackVisible, setScreen} : HomeProps) {

    // a constant variable to track the rsvpCount
    // React.useState returns [currentValue, functionToUpdateIt]
    // we set those values to the variables [rsvpCount, setRsvpCount]
    // rsvpCount = current rsvpCount; setRsvpCount = function to update rsvpCount
    // the initial value of rsvpCount is 0
    
    
    // this is an arrow (lambda) function that we use to open the maps app using Linking
    const openInMaps = () => {
    const address = encodeURIComponent('Bryant Park, New York, NY');
    const url = `http://maps.apple.com/?q=${address}`;
    Linking.openURL(url);
    }

    // This return statement contains all of the components (HTML) of the Home area
    return (
        <View style={styles.content}>
            <Text variant="headlineSmall" style={styles.center}>Home/Events</Text>
            <Card style={{width: '90%'}}>
              <Card.Title title="Park Cleanup" subtitle="Sat 10AM Manhattan"/>
              <Card.Content>
                <Text>Join us to tidy up the park!</Text>
                {/*
                  In the following Text component, we create a nested Text component because we want
                  the rsvp count to be bold.
                */}
                <Text style={{marginTop: 8}}>
                  RSVPs: 
                  <Text style={{fontWeight: '600'}}>{rsvpCount}</Text>
                </Text>
              </Card.Content>
              {/* 
                defines the actions for each button on the card
              */}
              <Card.Actions>
                {/* 
                  onPress: an event, when the button is pressed.
                  mode: defines the style of the button.
                */}
                <Button onPress={openInMaps} mode="outlined">Open in Maps</Button>
                {/* 
                  In the following button, we define the onPress event response with an arrow
                  function, it just increments the RsvpCount & makes the snack visible (little bar
                  on the bottom of the screen which says "You just RSVP'd!").
                */}
                <Button mode="contained" onPress={() => {
                    setRsvpCount((n: number) => n + 1);
                    setSnackVisible(true);
                  }}>
                  RSVP
                </Button>
              </Card.Actions>
            </Card>
            <Button style={{marginTop: 12}} onPress={() => setScreen('about')}>About</Button>
        </View>
    );
};