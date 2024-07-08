import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Checkbox, List, TextInput } from "react-native-paper";
import { Modal, Portal, Text, Button, Provider as PaperProvider } from 'react-native-paper';
import  AddOsModal from "../Components/Modal";
import { Icon } from 'react-native-paper'

export default function ListOS() {
  const [data, setData] = useState([
    {
      id: 1,
      title: "First Item",
      status: false,
    },
    {
      id: 2,
      title: "aaaaaa",
      status: true,
    },
    {
      id: 3,
      title: "Third Item",
      status: true,
    },
  ]);
  const [id,setId] = useState(4)

  function updateData(id, status) {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, status: status } : item
    );
    setData(updatedData);
    
  }

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};


  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>ID: {id}</Text>
          <TextInput mode="outlined"label={"title"}/>
          <View style={{alignItems:"center"}}>
            <Button mode='contained'>
              Adicionar
            </Button>
          </View>
        </Modal>
      </Portal>
        <FlatList
        style={styles.listContainer}
        data={data}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description="Item description"
            onPress={() => updateData(item.id, !item.status)}
            left={(props) => (
              <Checkbox
                status={item.status ? "checked" : "unchecked"}
                onPress={() => {
                  updateData(item.id, !item.status);
                }}
              />
            )}
          />
        )}
        keyExtractor={(item) => item?.id}
      />
      <View style={styles.buttonPos}>
        <Button mode='contained' onPress={showModal}>
            +
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  listContainer: {
    marginHorizontal: 10,
  },
  buttonPos:{
    position:"absolute",
    bottom:10,right:10,
  }
});