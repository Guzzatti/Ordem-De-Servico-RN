import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Button } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ClientsList({ navigation }) {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    let tempClients = [];

    const querySnapshot = await getDocs(collection(db, "clients"));
    querySnapshot.forEach((doc) => {
      tempClients.push({ id: doc.id, ...doc.data() });
    });

    setClients(tempClients);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSelectClient = () => {
    alert("em produção");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        renderItem={({ item }) => (
          <View style={styles.clientContainer}>
            <Text style={styles.clientName}>{item.name}</Text>
            <Button mode="contained" onPress={() => handleSelectClient()}>
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
