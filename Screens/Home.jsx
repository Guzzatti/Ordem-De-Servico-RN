import { View, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import logo from "../assets/logo.png"; // Certifique-se de que o caminho esteja correto

export default function Home({ navigation }) {
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }
  }, [user, navigation]);

  function handleListOs() {
    navigation.navigate("ListOS");
  }

  function handleCreateClient() {
    navigation.navigate("CreateClient");
  }

  function handleListClients() {
    navigation.navigate("ClientsList");
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleListOs} style={styles.button}>
          Ordens de Serviço
        </Button>
        <Button mode="contained" onPress={handleCreateClient} style={styles.button}>
          Registrar Novo Cliente
        </Button>
        <Button mode="contained" onPress={handleListClients} style={styles.button}>
          Lista de Clientes
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
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200, 
    height: 50, 
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 500,
  },
  button: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#00B9D1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#D9534F",
  },
});
