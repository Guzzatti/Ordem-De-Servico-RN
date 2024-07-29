import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
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

  const user = auth.currentUser;

  const fetchClients = async () => {
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    try {
      const clientsRef = collection(db, "organization", user.uid, "clients");
      const querySnapshot = await getDocs(clientsRef);
      const tempClients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(tempClients);
    } catch (error) {
      console.error("Erro ao buscar clientes: ", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

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
      const clientRef = doc(db, "organization", user.uid, "clients", selectedClient.id);
      await updateDoc(clientRef, { name: clientName, cpf: clientCpf, phone: clientPhone });
      setModalVisible(false);
      fetchClients();
      setSelectedClient(null);
    } catch (error) {
      console.error("Erro ao atualizar cliente: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        renderItem={({ item }) => (
          <View style={styles.clientCard}>
            <Text style={styles.clientName}>{item.name}</Text>
            <Button mode="contained" onPress={() => handleSelectClient(item)} style={styles.editButton}>
              Editar
            </Button>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

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
          <Button mode="contained" onPress={handleSaveClient} style={styles.saveButton}>
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
    alignSelf: 'flex-start',
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
});
