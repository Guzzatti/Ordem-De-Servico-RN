import { View,Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function Home({navigation}){
    const [loading, setLoading] = useState(false);

    function handleListOs(){
        navigation.navigate("ListOS")  
    }
    function handleClient(){
        alert("em produção")
    }
    function handleLogout(){
        signOut(auth).then(() => {
            alert('Usuário desconectado');
            navigation.navigate('Login');
          }).catch((error) => {
            console.error('Erro ao desconectar:', error);
          });
    }
    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={handleListOs}>
                Lista OS
            </Button>
            <Button mode="contained" onPress={handleClient}>
                Clientes
            </Button>
            <Button 
                mode="contained" 
                onPress={handleLogout}
                disabled={loading}
                loading={loading}
            >
                Deslogar
            </Button>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 24,
        flexDirection:"row",
        alignItems:"flex-start",
        justifyContent:"space-evenly"
      },
  });