import { View,Text } from "react-native";

import { Button } from "react-native-paper";

export default function Home({navigation}){
    function handleLogin(){
        navigation.navigate("ListOS")  
    }
    return (
        <View>
            <Button mode="contained" onPress={handleLogin}>
                Lista OS
            </Button>
        </View>
    )
}