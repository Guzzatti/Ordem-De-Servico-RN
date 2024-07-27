import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import ForgetPasswordModal from "./ForgetPasswordModal";
import { getUserById } from "../database";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        alert("Entrando");
        const user = getUserById();
        navigation.navigate("Home",user);
      } else {
        navigation.navigate("Login");
      }
    });
    return () => unsubscribe();
  }, []);

  function handleLogin() {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Home");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        label={"Email"}
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label={"Senha"}
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
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
          <Button mode="text" style={styles.button} onPress={handleCreateUser}>
            Criar Conta
          </Button>
          <Button mode="text" onPress={handleForget} style={styles.button}>
            Esqueci Minha Senha
          </Button>
        </View>
      </View>

      <ForgetPasswordModal
        visible={visible}
        hideModal={hideModal}
        setEmail={setEmail}
        email={email}
        auth={auth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  clientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
