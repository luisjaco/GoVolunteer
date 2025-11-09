// Look at Home.tsx for an explanation of everything going on, I won't repeat anything which was
// already said there 

import React from 'react';
import styles from '../../../constants';
import {Text, Button} from 'react-native-paper';
import {View} from 'react-native';

type AboutProps = {
    setScreen: React.Dispatch<React.SetStateAction<'home' | 'about'>>
};

export default function About({setScreen}: AboutProps) {
    return (
        <View style={styles.content}>
            {/* 
                varient: prop which alters the style of the text.
            */}
            <Text variant="headlineSmall" style={styles.center}>About</Text>
            <Text style={styles.center}>This app is a practice for our project</Text>
            <Button style={{marginTop: 12}} mode="contained" onPress={() => setScreen('home')}>Back to Home</Button>
        </View>
    );
}