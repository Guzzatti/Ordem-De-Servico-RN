import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Button } from "react-native-paper";
import { firestore } from "../firebaseConfig"; // Importa o Firestore

export default function ClientsList({ navigation, route }) {
  const [clients, setClients] = useState([]);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsCollection = await firestore.collection("clients").get();
        const clientList = clientsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClients(clientList);
      } catch (error) {
        console.error("Erro ao carregar clientes: ", error);
      }
    };

    fetchClients();
  }, []);

  const handleSelectClient = (client) => {
    // Passa o cliente selecionado de volta para a tela anterior
    route.params.setSelectedClient(client);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        renderItem={({ item }) => (
          <View style={styles.clientContainer}>
            <Text style={styles.clientName}>{item.name}</Text>
            <Button mode="contained" onPress={() => handleSelectClient(item)}>
              Selecionar
            </Button>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
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
});
