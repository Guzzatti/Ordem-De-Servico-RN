import { useState } from "react";
import { View ,Text, BackHandler} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function Login({navigation}){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState("")

    function handleLogin(){
        if(password==="123"){
            navigation.navigate("Home")
        }else{
            setError("Senha ou Email invalidos")
        }
    }
    function handleForget(){

    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                label={"Email"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="nome"
                style={styles.input}
            />
            <TextInput
                label={"Senha"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text>: null}
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Login
            </Button>
            <Button mode="text" onPress={handleForget} style={styles.button}>
                Esqueci Minha Senha
            </Button>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      padding:24
    },title:{
        fontSize:24,
        marginBottom:20,
        textAlign:"center"
    },
    button:{
        marginTop:10,
        alignItems:"center",
        justifyContent:"center"
    },
    input:{
        marginBottom:10
    },
    error:{
        color:"red",
        marginBottom:10,
        textAlign:"center"
    }
  });