import EventModal from '@/src/components/EventModal';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen() {
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <View>
            <Text>
                This will be the home screen. It will display the general feed. When a user clicks 
                on an event posting, they will add a new eventInfo screen to the stack, or perhaps
                a modal... we'll see.
            </Text>
            <Button onPress={() => {
                setModalVisible(true);
            }}>
                Bring out the modal!
            </Button>

            <EventModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
        </View>
    );
}