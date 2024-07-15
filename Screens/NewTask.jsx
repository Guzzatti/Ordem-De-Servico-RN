import React from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Portal, Text, TextInput, Button } from "react-native-paper";

export default function NewTask({ visible, hideModal, id, title, setTitle, addItem }) {

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.containerStyle}
      >
        <Text>ID: {id}</Text>
        <TextInput
          label="Title"
          mode="outlined"
          value={title}
          onChangeText={(title) => setTitle(title)}
        />

        <View style={{ alignItems: "center" }}>
          <Button mode="contained" onPress={() => addItem(id, title, false)}>
            Adicionar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  containerStyle:{
      backgroundColor: 'white',
      padding: 20,
      margin: 10,
      borderRadius: 10,
      borderWidth:2,
      borderColor:"gray"
  },
});
