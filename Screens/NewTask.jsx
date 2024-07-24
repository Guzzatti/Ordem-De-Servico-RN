import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  Menu,
} from "react-native-paper";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function NewTask({ visible, hideModal, addItem }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [osName, setOsName] = useState("");
  const [osDescription, setOsDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchClients = async () => {
    let tempClients = [];

    const querySnapshot = await getDocs(collection(db, "clients"));
    querySnapshot.forEach((doc) => {
      tempClients.push({ id: doc.id, ...doc.data() });
    });

    setClients(tempClients);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddItem = () => {
    addItem(selectedClient, osName, osDescription);
    setSelectedClient(null);
    setOsName("");
    setOsDescription("");
    hideModal();
  };

  const handleSelectClient = clients.map((client) => (
    <Menu.Item
      key={client.id}
      onPress={() => {
        setSelectedClient(client.name);
        setMenuVisible(false);
      }}
      title={client.name}
    />
  ));

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.containerStyle}
      >
        <Text style={styles.title}>Nova Ordem de Serviço</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button onPress={() => setMenuVisible(true)}>
              {selectedClient === null
                ? "Selecione um cliente"
                : selectedClient}
            </Button>
          }
        >
          {handleSelectClient}
        </Menu>
        <TextInput
          label="Nome da OS"
          mode="outlined"
          value={osName}
          onChangeText={setOsName}
          style={styles.input}
        />
        <TextInput
          label="Descrição da OS"
          mode="outlined"
          value={osDescription}
          onChangeText={setOsDescription}
          style={styles.input}
        />
        <View style={{ alignItems: "center" }}>
          <Button
            mode="contained"
            onPress={handleAddItem}
            loading={loading}
            disabled={loading || !selectedClient || !osName || !osDescription}
          >
            Adicionar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
});
