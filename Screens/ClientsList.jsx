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

  const user = auth.currentUser; // Obtém o usuário autenticado

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
      fetchClients(); // Atualiza a lista de clientes
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
          <View style={styles.clientContainer}>
            <Text style={styles.clientName}>{item.name}</Text>
            <Button mode="contained" onPress={() => handleSelectClient(item)}>
              Editar
            </Button>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Modal para editar cliente */}
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
          />
          <TextInput
            label="CPF"
            value={clientCpf}
            onChangeText={setClientCpf}
            style={styles.input}
            keyboardType="numeric" // Adiciona tipo de teclado para números
          />
          <TextInput
            label="Telefone"
            value={clientPhone}
            onChangeText={setClientPhone}
            style={styles.input}
            keyboardType="phone-pad" // Adiciona tipo de teclado para números de telefone
          />
          <Button mode="contained" onPress={handleSaveClient} style={styles.button}>
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
    backgroundColor: "#fff",
  },
  clientContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  clientName: {
    fontSize: 18,
    marginBottom: 5,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});
