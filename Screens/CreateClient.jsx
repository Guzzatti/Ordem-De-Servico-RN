import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { db } from "../firebaseConfig"; // Importa o Firestore
import { collection, addDoc } from "firebase/firestore";

export default function CreateClient({ navigation }) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    if (name && cpf && phone) {
      const docRef = await addDoc(collection(db, "clients"), {
        name: name,
        cpf: cpf,
        phone: phone,
        createdAt: new Date(),
      }).finally(() => {
        setLoading(false);
        alert("Cliente salvo com sucesso.");
        navigation.navigate("Home");
      });
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
