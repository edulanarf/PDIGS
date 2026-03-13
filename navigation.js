import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { ScanAndSearch} from './barcode/scanAndSearch.js';
import{SearchFood } from './db/searchFood.js';
import { Register } from './user/register.js';
import { Login } from './user/login.js';
import {Home} from './home.js'
import {CrudDiet} from './CRUDDiet/crudDiet.js';
import {CreateDiet} from './CRUDDiet/createDiet.js'


const Stack = createNativeStackNavigator();

export function Navigation(){
    return  (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home}></Stack.Screen>
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Scaner" component={ScanAndSearch} ></Stack.Screen>
                <Stack.Screen name="SearchFood" component={SearchFood} ></Stack.Screen>
                <Stack.Screen name="Dietas" component={CrudDiet} ></Stack.Screen>
                <Stack.Screen name="Creating Diet" component={CreateDiet} ></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}