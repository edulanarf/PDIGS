import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { Home } from "./home.js";

import { Register } from "./user/register.js";
import { Login } from "./user/login.js";
import { ScanAndSearch } from "./barcode/scanAndSearch.js";
import { SearchFood } from "./db/searchFood.js";

import { CrudDiet } from "./CRUDDiet/crudDiet.js";
import { CreateDiet } from "./CRUDDiet/createDiet.js";
import { ViewDiet } from "./CRUDDiet/viewDiet.js";
import { EditDiet } from "./CRUDDiet/editDiet.js";
import { DeleteDiet } from "./CRUDDiet/deleteDiet.js";

const Stack = createNativeStackNavigator();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        <Stack.Screen name="Home" component={Home} options={{ title: "Inicio" }}/>

        <Stack.Screen name="Register" component={Register}options={{ title: "Registro" }} />

        <Stack.Screen name="Login" component={Login} options={{ title: "Login" }} />

        <Stack.Screen name="Scaner" component={ScanAndSearch} options={{ title: "Escanear Comida" }} />

        <Stack.Screen name="SearchFood" component={SearchFood} options={{ title: "Buscar Comida" }} />

        <Stack.Screen name="Dietas" component={CrudDiet} options={{ title: "Gestión de Dietas" }} />

        <Stack.Screen name="CreateDiet" component={CreateDiet} options={{ title: "Crear Dieta" }} />

        <Stack.Screen name="ViewDiet" component={ViewDiet} options={{ title: "Ver Dietas" }} />

        <Stack.Screen name="EditDiet" component={EditDiet} options={{ title: "Editar Dieta" }} />

        <Stack.Screen name="DeleteDiet" component={DeleteDiet} options={{ title: "Eliminar Dieta" }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}