import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { List, Button, Divider } from "react-native-paper";
import OSMODAL from "./OSModal";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from '../firebaseConfig';

export default function ListOS() {
  const [data, setData] = useState([]);
  const [osToEdit, setOsToEdit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clients, setClients] = useState([]); 

  useEffect(() => {
    fetchData();
    fetchClients();
  }, []);
  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const ordersRef = collection(db, "organization", user.uid, "serviceOrders");
      const querySnapshot = await getDocs(ordersRef);

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
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const clientsRef = collection(db, "organization", user.uid, "clients");
      const querySnapshot = await getDocs(clientsRef);

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
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      await deleteDoc(doc(db, "organization", user.uid, "serviceOrders", id));
      fetchData(); 
    } catch (error) {
      console.error("Erro ao deletar ordem de serviço: ", error);
    }
  };

  // Função para exibir o modal
  const showModal = (os = null) => {
    setOsToEdit(os);
    setModalVisible(true);
  };

  // Função para ocultar o modal
  const hideModal = () => {
    setModalVisible(false);
    setOsToEdit(null);
  };

  // Função para formatar a data
  const formatDate = (date) => {
    if (!date) return "Data não disponível";
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
                <View style={styles.deleteButton}>
                  <Button
                    mode="contained"
                    onPress={() => handleDelete(item.id)}
                  >
                    Deletar
                  </Button>
                </View>
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
    display: "flex",
    justifyContent: "center",
  },
});
