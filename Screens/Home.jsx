import { View,Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Home({navigation}){
    function handleListOs(){
        navigation.navigate("ListOS")  
    }
    function handleClient(){
        alert("em produção")
    }
    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={handleListOs}>
                Lista OS
            </Button>
            <Button mode="contained" onPress={handleClient}>
                Clientes
            </Button>
            <Button mode="contained" onPress={()=>{alert("alguma coisa")}}>
                Testes
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