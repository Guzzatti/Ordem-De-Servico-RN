import React, { useState, useEffect } from "react";
import { Modal, Portal, TextInput, Button, Text } from "react-native-paper";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { collection, addDoc, updateDoc, doc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function OSMODAL({
  visible,
  hideModal,
  osToEdit,
  setOsToEdit,
  fetchData,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientModalVisible, setClientModalVisible] = useState(false);

  useEffect(() => {
    if (osToEdit) {
      setTitle(osToEdit.titleOs);
      setDescription(osToEdit.description);
      setClient(osToEdit.client);
    }
  }, [osToEdit]);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const clientsRef = collection(db, "organization", user.uid, "clients");
          const querySnapshot = await getDocs(clientsRef);
          const clientsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setClients(clientsList);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Usuário não autenticado. Por favor, faça login novamente.");
      return;
    }
    if (title && description && client) {
      try {
        if (osToEdit) {
          // Atualizar ordem de serviço existente
          const osRef = doc(db, "organization", user.uid, "serviceOrders", osToEdit.id);
          await updateDoc(osRef, {
            titleOs: title,
            description,
            client,
            updatedAt: new Date()
          });
          alert("Ordem de Serviço atualizada com sucesso.");
        } else {
          // Criar nova ordem de serviço
          await addDoc(collection(db, "organization", user.uid, "serviceOrders"), {
            titleOs: title,
            description,
            client,
            createdAt: new Date(),
          });
          alert("Ordem de Serviço criada com sucesso.");
        }
        fetchData(); // Atualiza a lista de ordens de serviço
        hideModal(); // Fecha o modal
        setOsToEdit(null); // Limpa o estado de edição
      } catch (error) {
        console.error("Erro ao salvar a ordem de serviço:", error);
        alert("Ocorreu um erro ao salvar a ordem de serviço. Por favor, tente novamente.");
      }
    } else {
      alert("Preencha todos os campos.");
    }
  };

  const selectClient = (clientId, clientName) => {
    setClient(clientId);
    setClientModalVisible(false);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modal}
      >
        <View>
          <Text style={styles.title}>
            {osToEdit ? "Editar OS" : "Criar OS"}
          </Text>
          <TextInput
            label="Título"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            label="Descrição"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.clientSelector}
            onPress={() => setClientModalVisible(true)}
          >
            <Text>{client ? `Cliente: ${clients.find(c => c.id === client)?.name}` : "Selecione um cliente"}</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSave} loading={loading} style={styles.button}>
              {osToEdit ? "Atualizar" : "Criar"}
            </Button>
          </View>
        </View>
      </Modal>
      <Modal
        visible={clientModalVisible}
        onDismiss={() => setClientModalVisible(false)}
        contentContainerStyle={styles.clientModal}
      >
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.clientItem}
              onPress={() => selectClient(item.id, item.name)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    marginBottom: 10,
  },
  clientSelector: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  clientModal: {
    backgroundColor: "white",
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  clientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});
