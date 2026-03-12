import { useEffect, useState } from "react";
import {Text, View, StyleSheet } from 'react-native';


// Esta funcion hace una llamada a la API de openfoodfacts usando el valor del codigo de barras
// Conseguido mediante la funcion "barcodeScanner".

export function FoodAPIBarcode({barcode}){

    // - useState crea un estado dentro del componente
    // - food guarda el alimento actual
    // - setFood es la función que permite actualizar ese valor
    // - cuando se llama a setFood React vuelve a renderizar la interfaz
    // - Si se asignase una variable normal, react no detecta el cambio por
    // lo que no rederizaría la interfaz. Mejor siempre hacerlo asi:

    const [food, setFood] = useState(null) 

    //En caso de no haber valor del barcode:
    if (!barcode) {
      return (
        <View style={styles.container}>
          <Text>Esperando código de barras...</Text>
        </View>
      );
    }
    
    // useEffect hace que cuando se cree el componente FoodDB, se ejecute.
    useEffect(()=> {

        // Como useEffect no puede ser asyncrona creo una funcion para ello:

        const getProduct = async ()=> {
        try{
            //El siguiente enlace indica un producto a través del codigo de barras (product/numero)
            
            const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`)
            const data = await response.json();
            if(data.product) {
                //Como comenté al principio, este método le asigna un valor a la variable food
                //data.product sería el producto que se añade a la variable "food"
                setFood(data.product)
            }
        }
        catch(error){
            console.error("error:" ,error)
        }
    };
    getProduct()
},[barcode])

  // En caso de no haberse encontrado un producto:
  if (!food) {
    return (
      <View style={styles.container}>
        <Text>Cargando primer alimento...</Text>
      </View>
    );
  }

  //si se encuentra muestra lo siguiente (json):
return (
  <View>
    <Text>{food.product_name}</Text>
    <Text>Marca: {food.brands}</Text>
    <Text>Calorías: {food.nutriments?.["energy-kcal_100g"] ?? "N/A"}</Text>
  </View>
);
}

// Esto es como el ccs pero en este caso se hace dentro del mismo js, asignando
// una variable "styles a la que luego se puede hacer por ejemplo
// styles.container ...":

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