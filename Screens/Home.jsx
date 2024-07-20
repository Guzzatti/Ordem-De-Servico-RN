import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function Home({ navigation }) {
    const [loading, setLoading] = useState(false);

    function handleListOs() {
        navigation.navigate("ListOS");
    }

    function handleCreateClient() {
        navigation.navigate("CreateClient");
    }

    function handleListClients() {
        navigation.navigate("ClientsList");
    }

    function handleLogout() {
        setLoading(true);
        signOut(auth)
            .then(() => {
                alert('Usuário desconectado');
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.error('Erro ao desconectar:', error);
                alert('Erro ao desconectar. Tente novamente.');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={handleListOs}>
                Lista OS
            </Button>
            <Button mode="contained" onPress={handleCreateClient}>
                Criar Cliente
            </Button>
            <Button mode="contained" onPress={handleListClients}>
                Listar Clientes
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 24,
        flexDirection: "column",
        gap:20,
    },
});
