// Login.jsx
import { useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { auth } from "../firebaseConfig"; // Importar configuração Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        setError("Senha ou Email inválidos");
      });
  }

  function handleForget() {
    // Implementar função de recuperação de senha
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        label={"Email"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label={"Senha"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
        <Button mode="text" onPress={handleForget} style={styles.button}>
          Esqueci Minha Senha
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
    padding: 24
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center"
  },
  buttonContainer: {
    alignItems: "center"
  },
  button: {
    marginTop: 10,
  },
  input: {
    marginBottom: 10
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center"
  }
});
