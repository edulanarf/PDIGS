import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { FoodAPIBarcode} from './api/foodAPI.js';
import{SearchFood } from './db/searchFood.js';
import { Register } from './user/register.js';
import {Home} from './home.js'


const Stack = createNativeStackNavigator();

export function Navigation(){
    return  (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home}></Stack.Screen>
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ApiFood" component={FoodAPIBarcode} ></Stack.Screen>
                <Stack.Screen name="SearchFood" component={SearchFood} ></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}