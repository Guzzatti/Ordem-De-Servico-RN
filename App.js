import { StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Screens/Home";
import Login from "./Screens/Login";
import NewTask from "./Screens/NewTask";
import ListOS from "./Screens/ListOS";
import CreateUser from "./Screens/CreateUser";
import ClientsList from "./Screens/ClientsList";
import CreateClient from "./Screens/CreateClient"; // Importe a nova tela

export default function App() {
  const Stack = createStackNavigator();
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="NewTask" component={NewTask} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ListOS" component={ListOS} />
          <Stack.Screen name="CreateUser" component={CreateUser} />
          <Stack.Screen name="ClientsList" component={ClientsList} />
          <Stack.Screen name="CreateClient" component={CreateClient} />
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
});
