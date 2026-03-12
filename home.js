import {Text, View, Button } from 'react-native';

export function Home({navigation}){
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
      <Button
        title="Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
    )
}