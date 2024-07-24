import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { List, Button, Divider } from "react-native-paper";
import OSMODAL from "./OSModal";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Importe a configuração do Firebase

export default function ListOS() {
  const [data, setData] = useState([]);
  const [osToEdit, setOsToEdit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clients, setClients] = useState([]); // Lista de clientes para seleção

  useEffect(() => {
    fetchData();
    fetchClients(); // Função para buscar clientes
  }, []);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(orders);
    } catch (error) {
      console.error("Erro ao buscar ordens de serviço: ", error);
    }
  };

  const fetchClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clients")); // Supondo que os clientes estão na coleção "clients"
      const clientsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsList);
    } catch (error) {
      console.error("Erro ao buscar clientes: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      fetchData(); // Atualize a lista após exclusão
    } catch (error) {
      console.error("Erro ao deletar ordem de serviço: ", error);
    }
  };

  const showModal = (os = null) => {
    setOsToEdit(os);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setOsToEdit(null);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date.seconds * 1000).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <OSMODAL
        visible={modalVisible}
        hideModal={hideModal}
        osToEdit={osToEdit}
        setOsToEdit={setOsToEdit}
        clients={clients}
        fetchData={fetchData}
      />
      <FlatList
        style={styles.listContainer}
        data={data}
        renderItem={({ item }) => (
          <View>
            <List.Item
              title={item.titleOs}
              description={
                <View>
                  <Text style={styles.descriptionText}>{item.client || "Cliente não disponível"}</Text>
                  <Text style={styles.dateText}>
                    {item.createdAt ? formatDate(item.createdAt) : "Data não disponível"}
                  </Text>
                </View>
              }
              onPress={() => showModal(item)}
              left={props => <List.Icon {...props} icon="archive" />}
              right={props => (
                <Button
                  mode="contained"
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteButton}
                >
                  Deletar
                </Button>
              )}
              style={styles.listItem}
            />
            <Divider />
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.buttonPos}>
        <Button mode="contained" onPress={() => showModal()}>
          Adicionar OS
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
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  listItem: {
    backgroundColor: "#fff",
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  buttonPos: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
});
