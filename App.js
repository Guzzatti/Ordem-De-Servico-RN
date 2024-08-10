import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { PaperProvider, Button } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Screens/Home";
import Login from "./Screens/Login";
import ListOS from "./Screens/ListOS";
import CreateUser from "./Screens/CreateUser";
import ClientsList from "./Screens/ClientsList";
import CreateClient from "./Screens/CreateClient";
import theme from "./theme";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const logo = require("./assets/logo.png");

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
      })
      .catch((error) => {
        console.error("Erro ao desconectar:", error);
        alert("Erro ao desconectar. Tente novamente.");
      });
  };

  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      setEmail(doc.data().email);
      setName(doc.data().name);
    });

    return () => unsub();
  }, [user.uid]);

  return (
    <View style={styles.drawerContainer}>
      <View>
        <Image source={logo} style={{ width: 150, height: 70 }} />
      </View>
      <View>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>
      <View>
        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
          Desconectar
        </Button>
      </View>
    </View>
  );
}

function CustomStackContent(props) {
  const logo = require("./assets/logo.png");
  return (
    <View>
      <Image source={logo} style={{ width: 100, height: 55 }} />
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerRight: (props) => <CustomStackContent {...props} /> }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ListOS" component={ListOS} />
      <Stack.Screen name="ClientsList" component={ClientsList} />
      <Stack.Screen name="CreateClient" component={CreateClient} />
    </Stack.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    const logo = require("./assets/logo.png");
    return (
      <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
        <Image source={logo} style={{ width: 400, height: 200 }} />
        <ActivityIndicator size={"large"} animating={true} color={"#00B9D1"} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Drawer.Navigator
            initialRouteName="HomeStack"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              headerShown: false,
              drawerPosition: "right",
              gestureEnabled: false,
            }}
          >
            <Drawer.Screen name="HomeStack" component={HomeStack} />
          </Drawer.Navigator>
        ) : (
          <Stack.Navigator
            initialRouteName="Login"
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="CreateUser" component={CreateUser} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "#888",
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#D9534F",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
