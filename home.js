import {Text, View, Button } from 'react-native';
import { auth } from './db/firebase.js'

export function Home({navigation}){
    //Compruebo si el usuario esta log para el boton de "Dietas"

    const handleCrearDieta = () => {
        const user = auth.currentUser; // verifica si hay usuario logueado

        if (user) {
        // Usuario logueado ir al CRUD de dietas
        navigation.navigate("Dietas");
        } else {
        navigation.navigate("Login")
        }
  };

    return (
    <View>
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")}
      />
      <Button
        title="Buscar comida API (codigo barras)"
        onPress={() => navigation.navigate("Scaner")}
      />
      <Button
        title="Buscar comida escribiendo"
        onPress={() => navigation.navigate("SearchFood")}
      />
      <Button title="Dietas" onPress={handleCrearDieta} />
    </View>
    )
}