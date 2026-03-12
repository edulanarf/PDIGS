import {Text, View, Button } from 'react-native';

export function Home({navigation}){
    return (
    <View>
      <Text>Bienvenido a EasyDiet</Text>

      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button
        title="Buscar comida API (codigo barras)"
        onPress={() => navigation.navigate("ApiFood")}
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