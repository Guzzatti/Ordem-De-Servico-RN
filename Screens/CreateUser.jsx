import { View,Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button,TextInput } from "react-native-paper";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function CreateUser({navigation}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const auth = getAuth();

    function handleCreateUser(){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          alert("user Criado com sucesso")
          navigation.navigate("Home");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage)
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar conta</Text>
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
                <Button mode="contained" style={styles.button} onPress={handleCreateUser}>
                    Criar Usuario
                </Button>
            </View>
        </View>
    )
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
      },
      clientContainer:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
      }
  });