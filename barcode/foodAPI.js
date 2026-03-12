import { useEffect, useState } from "react";
import {Text, View, StyleSheet, Image  } from 'react-native';


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

  // Mostrar los macros de 100g o del producto completo (si el json tiene la cantidad del mismo claro):
const kcal100 = food.nutriments?.["energy-kcal_100g"] ?? 0;
const protein100 = food.nutriments?.["proteins_100g"] ?? 0;
const carbs100 = food.nutriments?.["carbohydrates_100g"] ?? 0;
const fat100 = food.nutriments?.["fat_100g"] ?? 0;
const salt100 = food.nutriments?.["salt_100g"] ?? 0;
const sugar100 = food.nutriments?.["sugars_100g"] ?? 0;

let weight = null;

// En ocasiones el producto tiene product_quantity, quantity o ni tiene, en los dos primeros casos se
// muestra los macros del producto entero (abajo) pero cuando weight es null no se muestra.(abajo tamb)
if (food.product_quantity) {
  weight = parseFloat(food.product_quantity);
} else if (food.quantity) {
  const match = food.quantity.match(/[\d.]+/);
  if (match) weight = parseFloat(match[0]);
}

const kcalTotal = (kcal100 * weight) / 100;
const proteinTotal = (protein100 * weight) / 100;
const carbsTotal = (carbs100 * weight) / 100;
const fatTotal = (fat100 * weight) / 100;
const saltTotal = (salt100 * weight) / 100;
const sugarTotal = (sugar100 * weight) / 100;
  //si se encuentra muestra lo siguiente (json):
return (
<View>
    {food.image_front_url && (
    <Image
      source={{ uri: food.image_front_url }}
      style={{ width: 150, height: 150, marginBottom: 10 }}
      resizeMode="contain"
    />
  )}
  <Text>{food.product_name}</Text>
  <Text>Marca: {food.brands}</Text>

  <Text>--- Por 100g / 100ml ---</Text>
  <Text>Calorías: {kcal100}</Text>
  <Text>Proteínas: {protein100} g</Text>
  <Text>Carbohidratos: {carbs100} g</Text>
  <Text>Grasas: {fat100} g</Text>
  <Text>Sal: {salt100} g</Text>
  <Text>Azúcar: {sugar100} g</Text>

  {weight ? (
    <>
      <Text>--- Producto completo ({food.quantity ?? weight}) ---</Text>
      <Text>Calorías: {kcalTotal.toFixed(1)}</Text>
      <Text>Proteínas: {proteinTotal.toFixed(1)} g</Text>
      <Text>Carbohidratos: {carbsTotal.toFixed(1)} g</Text>
      <Text>Grasas: {fatTotal.toFixed(1)} g</Text>
      <Text>Sal: {saltTotal.toFixed(1)} g</Text>
      <Text>Azúcar: {sugarTotal.toFixed(1)} g</Text>
    </>
  ) : (
    <>
      <Text>--- Producto completo ---</Text>
      <Text>Tamaño del producto no disponible en la base de datos</Text>
    </>
  )}

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