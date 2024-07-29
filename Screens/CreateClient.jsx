import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";

export default function CreateClient({ navigation }) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const handleSave = async () => {
    setLoading(true);

    if (!user) {
      setLoading(false);
      alert("Usuário não autenticado. Por favor, faça login novamente.");
      return;
    }

    if (name && cpf && phone) {
      try {
        const docRef = await addDoc(collection(db, "organization", user.uid, "clients"), {
          name: name,
          cpf: cpf,
          phone: phone,
          createdAt: new Date(),
        });
        alert("Cliente salvo com sucesso.");
        navigation.navigate("Home");
      } catch (error) {
        console.error("Erro ao salvar o cliente:", error);
        alert("Ocorreu um erro ao salvar o cliente. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Preencha todos os campos.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nome Completo"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="CPF"
        mode="outlined"
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        label="Telefone"
        mode="outlined"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        style={styles.button}
      >
        Salvar Cliente
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});
