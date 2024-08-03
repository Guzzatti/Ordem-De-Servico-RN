import React, { useState, useEffect } from "react";
import { Modal, Portal, TextInput, Button, Text, RadioButton } from "react-native-paper";
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
  const [status, setStatus] = useState("Pendente");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function resetData(){
    setTitle("");
    setDescription("");
    setClient("");
    setStatus("Pendente");
  }

  useEffect(() => {
    if (osToEdit) {
      setTitle(osToEdit.titleOs);
      setDescription(osToEdit.description);
      setClient(osToEdit.client);
      setStatus(osToEdit.status || "Pendente");
    }else{
      resetData();
    }
  }, [osToEdit]);

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

  useEffect(() => {
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
          const osRef = doc(db, "organization", user.uid, "serviceOrders", osToEdit.id);
          await updateDoc(osRef, {
            titleOs: title,
            description,
            client,
            status,
            updatedAt: new Date()
          });
          alert("Ordem de Serviço atualizada com sucesso.");
        } else {
          await addDoc(collection(db, "organization", user.uid, "serviceOrders"), {
            titleOs: title,
            description,
            client,
            status,
            createdAt: new Date(),
          });
          alert("Ordem de Serviço criada com sucesso.");
        }
        fetchData();
        hideModal();
        setOsToEdit(null);
      } catch (error) {
        console.error("Erro ao salvar a ordem de serviço:", error);
        alert("Ocorreu um erro ao salvar a ordem de serviço. Por favor, tente novamente.");
      }
    } else {
      alert("Preencha todos os campos.");
    }
  };

  const selectClient = (clientId) => {
    setClient(clientId);
    setClientModalVisible(false);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Text style={styles.clientText}>
              {client ? `Cliente: ${clients.find(c => c.id === client)?.name}` : "Selecione um cliente"}
            </Text>
          </TouchableOpacity>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <RadioButton.Group
              onValueChange={value => setStatus(value)}
              value={status}
            >
              <View style={styles.statusOption}>
                <RadioButton value="Pendente" />
                <Text>Pendente</Text>
              </View>
              <View style={styles.statusOption}>
                <RadioButton value="Finalizada" />
                <Text>Finalizada</Text>
              </View>
            </RadioButton.Group>
          </View>
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
        <TextInput
          placeholder="Pesquisar cliente"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.clientItem}
              onPress={() => selectClient(item.id)}
            >
              <Text style={styles.clientItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00B9D1",
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#043E59',
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  clientSelector: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#00B9D1",
    borderRadius: 5,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
  },
  clientText: {
    color: '#043E59',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    color: '#043E59',
    marginBottom: 5,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#00B9D1',
  },
  clientModal: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00B9D1",
    elevation: 5,
  },
  searchInput: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#00B9D1",
    borderRadius: 5,
    backgroundColor: '#f7f7f7',
  },
  clientItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  clientItemText: {
    color: '#043E59',
  },
}); 