import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

export default function CreateUser({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateUser() {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
      });
      await setDoc(doc(db, 'organization', user.uid), {
        userId: user.uid,
      });

      alert("Usuário Criado Com Sucesso");
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        theme={{ colors: { primary: "#00B9D1" } }}
      />
      <TextInput
        label="Senha"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        theme={{ colors: { primary: "#00B9D1" } }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleCreateUser}
          disabled={loading}
          loading={loading}
        >
          Criar Usuário
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#043E59",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#00B9D1",
    borderRadius: 8,
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
