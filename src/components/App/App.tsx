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

// Allows us to control the style of the time and battery at the top of the phone
import {StatusBar} from 'expo-status-bar';

// SafeAreaView prevents content from going under the notch or StatusBar
import {SafeAreaView} from 'react-native-safe-area-context';

/*
  imports style design components from react native paper
  PaperProvider is the top-level theme/context provider for all Paper components
  MD3LightTheme / MD3DarkTheme: ready-made light/dark theme objects
  Button, Card, Text, Snackbar, FAB: UI components following Material Design
  snackbar is a pop-up feature similar to JOptionPane in Java GUI, shows a temporary message
  FAB = floating action button
*/

import {
  Provider as PaperProvider,
  MD3LightTheme, // Material Design 3 Light
  MD3DarkTheme,  // Material Design 3 Dark
  Snackbar,
  FAB,
  } from 'react-native-paper';

import styles from '../../constants';
import Home from './components/Home';
import About from './components/About';

/*
  The following is called a Component, it basically is a function used in React which has the 
  function of creating/returning an element (HTML)

  Regular typescript applies, and we can write HTML as one element by wrapping the HTML in 
  parenthesis (). To put code/variables inside of the HTML, we use curly brackets {}
*/

/* 
  export default allows you to import something (function, variable, etc.) as default. (Look at how
  we import React vs how we import other things within curly braces). We will pass App as the 
  top-level componenent into index.ts, and expo will start the app, using App.
*/
export default function App() {
  // const creates a constant variable (cannot be reassigned)

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
  
  // Here we make a custom type < 'home' | 'about' >, that forces the screen value to only be 
  // 'home' or 'about'
  const [screen, setScreen] = React.useState<'home' | 'about'>('home');
  
  const [snackVisible, setSnackVisible] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  
  //the theme depends on the dark state, any time the dark state is change, this whole component 
  // will re-run, so the theme constant will be updated.
  const theme = dark ? MD3DarkTheme : MD3LightTheme;
  const [rsvpCount, setRsvpCount] = React.useState(0);

  /*
    All the rest of this stuff is basically HTML, remember that using {} allows you to put code or
    logic inside of the HTML.

    * Note that when you make a component, the return statement has to have only one parent HTML
    element.
  */
   
  // return statement for the function App (top-level component, meaning this is the main component 
  // which will handle most things)
  return (
    // PaperProvider makes the theme and other Paper settings available to all child components (Buttons, Cards, etc.)
    // sets the theme to the constant theme which we defined at the top based on light or dark mode
    <PaperProvider theme={theme}>

      {/* 
        establishes the start of the content in safe area view
        style: a css-formatted object which contains style information.
      */}
      <SafeAreaView style={{flex:1, backgroundColor: dark ? '#000' : '#fff'}}>
        {/* 
          Basically a statement which says if the screen state is set to home, we will display the
          Home component, and if not, we display the About component. Here you can see that we pass
          in the states and state setters we defined previously as props.
        */}
        {
          screen === 'home' ? 
          <Home rsvpCount={rsvpCount} setRsvpCount={setRsvpCount} setSnackVisible={setSnackVisible} setScreen={setScreen}/> 
          : 
          <About setScreen={setScreen}/>
        }
        
        {/* 
          snackbar: a transient message bar that appears briefly at the bottom
          to confirm an action or show feedback
          visible={snackVisible}: controls whether it shows
          onDismiss: callback when it hides (we set visible to false)
          action: adds a button on the snackbar; here "Undo" will decrement the count but not below 0
          duration={2000}: auto-hide after ~2 seconds 
        */}
        <Snackbar visible={snackVisible} onDismiss={() => setSnackVisible(false)} duration={2000}
          action={{
            label: 'Undo',
            onPress: () => setRsvpCount((n) => Math.max(0, n-1)),
          }}>
          RSVP recorded!
        </Snackbar>
        {/* 
          FAB: Floating Action Button
          This button toggles light and dark mode. A fab is positioned absolutely, floats above 
          content, does not move while scrolling. All the props set the different styles and 
          eventHandlers of the component
        */}
        <FAB icon={dark ? 'weather-sunny' : 'weather-night'} onPress={() => setDark((d) => !d)}
          style={styles.fab} color="white"/>
        {/* 
          sets the status bar to light or dark depending on whether the app is in light or dark mode
          light if dark, dark if light
        */}
        <StatusBar style={dark ? 'light' : 'dark'} />
      </SafeAreaView>
    </PaperProvider>
  );
}
