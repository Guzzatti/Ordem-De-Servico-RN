import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, Animated } from "react-native";
import { Button, Modal, TextInput } from "react-native-paper";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function ClientsList({ navigation }) {
  const [clients, setClients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientCpf, setClientCpf] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity

  const user = auth.currentUser;

  const fetchClients = async () => {
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    try {
      const clientsRef = collection(db, "organization", user.uid, "clients");
      const querySnapshot = await getDocs(clientsRef);
      const tempClients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(tempClients);
      // Start the fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Erro ao buscar clientes: ", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);
  const handleNavCreateClient = () => {
    navigation.navigate("CreateClient");
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setClientName(client.name || "");
    setClientCpf(client.cpf || "");
    setClientPhone(client.phone || "");
    setModalVisible(true);
  };

  const handleSaveClient = async () => {
    if (!selectedClient) return;

    try {
      const clientRef = doc(
        db,
        "organization",
        user.uid,
        "clients",
        selectedClient.id
      );
      await updateDoc(clientRef, {
        name: clientName,
        cpf: clientCpf,
        phone: clientPhone,
      });
      setModalVisible(false);
      fetchClients();
      setSelectedClient(null);
    } catch (error) {
      console.error("Erro ao atualizar cliente: ", error);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar clientes"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        mode="outlined"
      />

      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
        <FlatList
          data={filteredClients}
          renderItem={({ item }) => (
            <View style={styles.clientCard}>
              <Text style={styles.clientName}>{item.name}</Text>
              <Button
                mode="contained"
                onPress={() => handleSelectClient(item)}
                style={styles.editButton}
              >
                Editar
              </Button>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </Animated.View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => handleNavCreateClient()}
          style={styles.addButton}
        >
          Adicionar Cliente
        </Button>
      </View>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View>
          <Text style={styles.modalTitle}>Editar Cliente</Text>
          <TextInput
            label="Nome"
            value={clientName}
            onChangeText={setClientName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="CPF"
            value={clientCpf}
            onChangeText={setClientCpf}
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
          />
          <TextInput
            label="Telefone"
            value={clientPhone}
            onChangeText={setClientPhone}
            style={styles.input}
            keyboardType="phone-pad"
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handleSaveClient}
            style={styles.saveButton}
          >
            Salvar
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  searchInput: {
    marginBottom: 15,
  },
  listContainer: {
    flex: 1,
  },
  clientCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  editButton: {
    alignSelf: "flex-start",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00B9D1",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#00B9D1",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
