import React, { useState, useEffect } from "react";
import { Modal, Portal, TextInput, Button, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { collection, addDoc, updateDoc, doc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Picker } from '@react-native-picker/picker'; // Atualizado

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
            updatedAt: new Date() // Opcional: para rastrear a data da última atualização
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
          <View style={styles.pickerContainer}>
            <Text>Cliente</Text>
            <Picker
              selectedValue={client}
              onValueChange={(itemValue) => setClient(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um cliente" value="" />
              {clients.map((client) => (
                <Picker.Item key={client.id} label={client.name} value={client.id} />
              ))}
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSave} loading={loading} style={styles.button}>
              {osToEdit ? "Atualizar" : "Criar"}
            </Button>
          </View>
        </View>
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
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
});
