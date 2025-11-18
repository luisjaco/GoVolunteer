import React from 'react';
import { Modal, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

// simple modal screen Component, will open and close like an apple pageSheet.

type EventModalProps = {
    modalVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
};

export default function EventModal({modalVisible, setModalVisible}: EventModalProps) {
    return (
        <Modal
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
            presentationStyle='pageSheet'
            animationType='slide'
        >
            <View>
                <Text>
                    This is a modal!!!
                </Text>
                <Button onPress={() => {
                    setModalVisible(false);
                }}>
                    Close Modal.
                </Button>
            </View>
        </Modal>
    )
}