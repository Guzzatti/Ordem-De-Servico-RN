import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import ForgetPasswordModal from "./ForgetPasswordModal";
import logo from "../assets/logo.png"; // Certifique-se de que o caminho esteja correto

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        let errorMessage = "Senha ou Email inválidos";
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Email inválido";
            break;
          case "auth/user-not-found":
            errorMessage = "Usuário não encontrado";
            break;
          case "auth/wrong-password":
            errorMessage = "Senha incorreta";
            break;
          default:
            errorMessage = "Erro desconhecido. Tente novamente.";
        }
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  const handleCreateUser = () => {
    navigation.navigate("CreateUser");
  };

  const handleForget = () => {
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>SEJA BEM-VINDO!</Text>
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
        <Button
          mode="text"
          onPress={handleCreateUser}
          style={styles.textButton}
        >
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
  logo: {
    width: 300,
    height: 120,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#00B9D1",
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
    color: "#00B9D1",
  },
});
