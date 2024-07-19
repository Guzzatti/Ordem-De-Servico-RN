import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { firestore } from "../firebaseConfig"; // Importa o Firestore

export default function CreateClient({ navigation }) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (name && cpf && phone) {
      setLoading(true);
      try {
        await firestore.collection("clients").add({
          name,
          cpf,
          phone,
          createdAt: new Date(),
        });
        alert("Cliente criado com sucesso!");
        navigation.goBack(); // Voltar para a tela anterior após salvar
      } catch (error) {
        console.error("Erro ao criar cliente: ", error);
        alert("Erro ao criar cliente. Tente novamente.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Preencha todos os campos.");
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
