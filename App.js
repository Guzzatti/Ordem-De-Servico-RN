import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Screens/Home';
import Login from './Screens/Login';
import NewTask from './Screens/NewTask';
import ListOS from './Screens/ListOS';
import CreateUser from './Screens/CreateUser';
import ClientsList from './Screens/ClientsList';
import CreateClient from './Screens/CreateClient';
import theme from './theme';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert('Usuário desconectado');
        props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Erro ao desconectar:', error);
        alert('Erro ao desconectar. Tente novamente.');
      });
  };

  return (
    <View style={styles.drawerContainer}>
      <Image
        source={{ uri: 'https://example.com/user-photo.jpg' }} // Substitua pela URL da foto do usuário
        style={styles.userPhoto}
      />
      <Text style={styles.userName}>Nome do Usuário</Text>
      <Text style={styles.userEmail}>email@example.com</Text>
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Sair do App
      </Button>
    </View>
  );
}

function HomeStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={Home} 
      />
      <Stack.Screen name="NewTask" component={NewTask} />
      <Stack.Screen name="ListOS" component={ListOS} />
      <Stack.Screen name="CreateUser" component={CreateUser} />
      <Stack.Screen name="ClientsList" component={ClientsList} />
      <Stack.Screen name="CreateClient" component={CreateClient} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Login"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{ headerShown: false, drawerPosition: 'right', gestureEnabled: false }}
        >
          <Drawer.Screen name="HomeStack" component={HomeStack} />
          <Drawer.Screen name="Login" component={Login} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#D9534F',
  },
});

export default App;
