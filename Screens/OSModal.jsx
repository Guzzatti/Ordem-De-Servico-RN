import React, { useState, useEffect } from 'react';
import { Modal, Portal, TextInput, Button, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function OSMODAL({ visible, hideModal, osToEdit, setOsToEdit, clients, fetchData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');

  useEffect(() => {
    if (osToEdit) {
      setTitle(osToEdit.titleOs);
      setDescription(osToEdit.description);
      setClient(osToEdit.client);
    }
  }, [osToEdit]);

  const handleSave = async () => {
    if (title && description && client) {
      if (osToEdit) {
        // Update existing OS
        const osRef = doc(db, "orders", osToEdit.id);
        await updateDoc(osRef, { titleOs: title, description, client });
        alert("Ordem de Serviço atualizada com sucesso.");
      } else {
        // Create new OS
        await addDoc(collection(db, "orders"), {
          titleOs: title,
          description,
          client,
          createdAt: new Date(),
        });
        alert("Ordem de Serviço criada com sucesso.");
      }
      fetchData();
      hideModal();
      setOsToEdit(null);
    } else {
      alert("Preencha todos os campos.");
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
        <View>
          <Text style={styles.title}>{osToEdit ? "Editar OS" : "Criar OS"}</Text>
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
          <TextInput
            label="Cliente"
            mode="outlined"
            value={client}
            onChangeText={setClient}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
            >
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
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
