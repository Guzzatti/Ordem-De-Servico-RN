import { View,Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Home({navigation}){
    function handleLogin(){
        navigation.navigate("ListOS")  
    }
    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={handleLogin}>
                Lista OS
            </Button>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems:"flex-start",
        padding: 24
      },
  });