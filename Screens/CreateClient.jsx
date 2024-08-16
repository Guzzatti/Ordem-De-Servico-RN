import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";

export default function CreateClient({ navigation }) {
  const [name, setName] = useState("");
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

    if (name && phone) {
      try {
        await addDoc(collection(db, "organization", user.uid, "clients"), {
          name: name,
          phone: phone,
          createdAt: new Date(),
        });
        alert("Cliente salvo com sucesso.");
        navigation.navigate("Home");
      } catch (error) {
        console.error("Erro ao salvar o cliente:", error);
        alert(
          "Ocorreu um erro ao salvar o cliente. Por favor, tente novamente."
        );
      } finally {
        setLoading(false);
      }
    } else {
      alert("Preencha todos os campos.");
      setLoading(false);
    }
  };

  function formatTelefone(value) {
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Nome Completo"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
        theme={{ colors: { primary: "#00B9D1" } }}
      />
      <TextInput
        label="Telefone"
        mode="outlined"
        value={phone}
        onChangeText={setPhone}
        onEndEditing={(e) => setPhone(formatTelefone(e.nativeEvent.text))}
        style={styles.input}
        keyboardType="phone-pad"
        theme={{ colors: { primary: "#00B9D1" } }}
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
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00B9D1",
    borderRadius: 8,
  },
});
