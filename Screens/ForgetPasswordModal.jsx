import React, { useState } from 'react';
import { Modal, Portal, TextInput, Button } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth'; // Importa função de redefinição de senha do Firebase

export default function ForgetPasswordModal({ visible, hideModal, setEmail, email, auth }) {
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleSendResetEmail = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetEmailSent(true);
      })
      .catch((error) => {
        setResetError(error.message);
      });
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
        <View>
          <Text style={[styles.margin, styles.title]}>Digite seu email para recuperar sua senha:</Text>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.margin}
          />
          {resetEmailSent ? (
            <Text style={styles.successMessage}>Um email de recuperação foi enviado.</Text>
          ) : null}
          {resetError ? <Text style={styles.errorMessage}>{resetError}</Text> : null}
          <View style={[styles.margin, { alignItems: 'center' }]}>
            <Button mode="contained" onPress={handleSendResetEmail}>
              Enviar
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  margin: {
    marginTop: 15,
  },
  title: {
    fontSize: 18,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth:2,
    borderColor:"gray"
  },
  successMessage: {
    marginTop: 10,
    color: 'green',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
});
