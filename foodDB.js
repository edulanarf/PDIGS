import { useEffect, useState } from "react";
import {Text, View, StyleSheet } from 'react-native';

export function FoodDB(){
    const [food, setFood] = useState(null)
    useEffect(()=> {
        const getFirstFood = async ()=> {
        try{
            const response = await fetch("https://world.openfoodfacts.net/api/v2/product/3017624010701")
            const data = await response.json();
            if(data.product) {
                setFood(data.product)
            }
        }
        catch(error){
            console.error("error:" ,error)
        }
    };
    getFirstFood()
},[])

  if (!food) {
    return (
      <View style={styles.container}>
        <Text>Cargando primer alimento...</Text>
      </View>
    );
  }

return (
  <View>
    <Text>{food.product_name}</Text>
    <Text>Marca: {food.brands}</Text>
    <Text>Calorías: {food.nutriments?.["energy-kcal_100g"] ?? "N/A"}</Text>
  </View>
);
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
});