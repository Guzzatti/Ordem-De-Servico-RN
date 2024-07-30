import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Text, TextInput } from "react-native";
import { List, Button, Divider } from "react-native-paper";
import OSMODAL from "./OSModal";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth } from '../firebaseConfig';

export default function ListOS() {
  const [data, setData] = useState([]);
  const [osToEdit, setOsToEdit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Pendente");
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  useEffect(() => {
    fetchClients();
    fetchData();
  }, [statusFilter]);

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
      })).filter(order => order.status === statusFilter);

      setData(orders);
    } catch (error) {
      console.error("Erro ao buscar ordens de serviço: ", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const osRef = doc(db, "organization", user.uid, "serviceOrders", id);
      await updateDoc(osRef, { status: newStatus });
      fetchData(); 
    } catch (error) {
      console.error("Erro ao atualizar ordem de serviço: ", error);
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

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Nome não disponível";
  };

  const filteredData = data.filter(item => 
    getClientName(item.client).toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <OSMODAL
        visible={modalVisible}
        hideModal={hideModal}
        osToEdit={osToEdit}
        setOsToEdit={setOsToEdit}
        fetchData={fetchData}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar pelo nome do cliente"
        value={searchText}
        onChangeText={setSearchText}
      />
      <View style={styles.navContainer}>
        <Button
          mode={statusFilter === "Pendente" ? "contained" : "outlined"}
          onPress={() => setStatusFilter("Pendente")}
          style={styles.navButton}
        >
          Pendentes
        </Button>
        <Button
          mode={statusFilter === "Finalizada" ? "contained" : "outlined"}
          onPress={() => setStatusFilter("Finalizada")}
          style={styles.navButton}
        >
          Finalizadas
        </Button>
      </View>
      <FlatList
        style={styles.listContainer}
        data={filteredData}
        renderItem={({ item }) => (
          <View>
            <List.Item
              title={item.titleOs}
              description={
                <View>
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.clientText}>{getClientName(item.client)}</Text>
                  </View>
                  <View>
                    <Text style={styles.dateText}>
                      {item.createdAt ? formatDate(item.createdAt) : "Data não disponível"}
                    </Text>
                  </View>
                </View>
              }
              onPress={() => showModal(item)}
              left={props => <List.Icon {...props} icon="archive" />}
              right={props => (
                <View>
                  <Button
                    mode="contained"
                    onPress={() => updateStatus(item.id, item.status === "Pendente" ? "Finalizada" : "Pendente")}
                    style={styles.updateButton}
                  >
                    {item.status === "Pendente" ? "Finalizar" : "Reabrir"}
                  </Button>
                </View>
              )}
              style={styles.listItem}
            />
          </View>
        )}
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
  searchInput: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 5,
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
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  updateButton: {
    backgroundColor: "#00B9D1",
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: "#00B9D1",
  },
});
