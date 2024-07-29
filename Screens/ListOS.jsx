import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { List, Button, Divider, IconButton } from "react-native-paper";
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

  const showModal = (os = null) => {
    setOsToEdit(os);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setOsToEdit(null);
  };

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
                <View style={styles.descriptionContainer}>
                  <Text style={styles.clientText}>{item.client || "Cliente não disponível"}</Text>
                  <View style={styles.dateContainer}>
                    <IconButton icon="calendar" size={18} style={styles.icon} />
                    <Text style={styles.dateText}>
                      {item.createdAt ? formatDate(item.createdAt) : "Data não disponível"}
                    </Text>
                  </View>
                </View>
              }
              onPress={() => showModal(item)}
              left={props => <List.Icon {...props} icon="archive" />}
              right={props => (
                <View style={styles.deleteButtonContainer}>
                  <Button
                    mode="contained"
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteButton}
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
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => showModal()} style={styles.addButton}>
          Adicionar OS
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  icon: {
    marginRight: 4,
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  deleteButton: {
    backgroundColor: "#D9534F",
    borderRadius: 4,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: "#00B9D1",
  },
});
