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
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.menuButton}
            >
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
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleAddItem}
            loading={loading}
            disabled={loading || !selectedClient || !osName || !osDescription}
            style={styles.addButton}
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
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  menuButton: {
    width: '100%',
    justifyContent: 'center',
    borderColor: '#00B9D1',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    width: '100%',
    paddingVertical: 5,
  },
});
