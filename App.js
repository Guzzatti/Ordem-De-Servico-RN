import {  StyleSheet } from "react-native";
import { List, PaperProvider } from "react-native-paper";
import Home from "./Screens/Home";
import Login from "./Screens/Login"
import NewTask from "./Screens/NewTask"
import ListOS from "./Screens/ListOS";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="NewTask" component={NewTask}/>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="ListOS" component={ListOS}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    marginHorizontal: 10,
  },
});
