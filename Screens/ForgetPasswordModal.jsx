import React, { useState } from "react";
import { Modal, Portal, TextInput, Button } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth"; // Importa função de redefinição de senha do Firebase

export default function ForgetPasswordModal({
  visible,
  hideModal,
  setEmail,
  email,
  auth,
}) {
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetEmailSent(true);
        hideModal();
        alert("Um email de recuperação foi enviado.");
      })
      .catch((error) => {
        setResetError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modal}
      >
        <View>
          <Text style={styles.title}>
            Digite seu email para recuperar sua senha:
          </Text>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            theme={{ colors: { primary: "#00B9D1" } }}
          />
          {resetError ? (
            <Text style={styles.errorMessage}>{resetError}</Text>
          ) : null}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSendResetEmail}
              disabled={loading}
              loading={loading}
              style={styles.button}
            >
              Enviar
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#043E59",
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#00B9D1",
    borderRadius: 8,
  },
  errorMessage: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
  },
});
