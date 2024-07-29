import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function Home({ navigation }) {
  const [loading, setLoading] = useState(false);

  function handleListOs() {
    navigation.navigate("ListOS");
  }

  function handleCreateClient() {
    navigation.navigate("CreateClient");
  }

  function handleListClients() {
    navigation.navigate("ClientsList");
  }

  function handleLogout() {
    setLoading(true);
    signOut(auth)
      .then(() => {
        alert("Usuário desconectado");
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Erro ao desconectar:", error);
        alert("Erro ao desconectar. Tente novamente.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reorganizer</Text>
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
        <Button
          mode="contained"
          onPress={handleLogout}
          disabled={loading}
          loading={loading}
          style={[styles.button, styles.logoutButton]}
        >
          Sair do App
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#043E59", // Cor do título
    textAlign: "center",
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
    backgroundColor: "#D9534F", // Cor diferente para o botão de logout
  },
});
