import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import ForgetPasswordModal from "./ForgetPasswordModal";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("HomeStack");
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  function handleLogin() {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("Home");
        setEmail("");
        setPassword("");
      })
      .catch(() => {
        setError("Senha ou Email inválidos");
      })
      .finally(() => setLoading(false));
  }

  function handleCreateUser() {
    navigation.navigate("CreateUser");
  }

  function handleForget() {
    setVisible(true);
  }

  const hideModal = () => setVisible(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Reorganizer!</Text>
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Senha"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        disabled={loading}
        loading={loading}
      >
        Login
      </Button>
      <View style={styles.clientContainer}>
        <Button mode="text" onPress={handleCreateUser} style={styles.textButton}>
          Criar Conta
        </Button>
        <Button mode="text" onPress={handleForget} style={styles.textButton}>
          Esqueci Minha Senha
        </Button>
      </View>
      <ForgetPasswordModal
        visible={visible}
        hideModal={hideModal}
        setEmail={setEmail}
        email={email}
        auth={auth}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00B9D1",
  },
  error: {
    color: "#D9534F",
    marginBottom: 16,
    textAlign: "center",
  },
  clientContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textButton: {
    marginHorizontal: 8,
    color: "#00B9D1", // Cor do texto dos botões
  },
});
