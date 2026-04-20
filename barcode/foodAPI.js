import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, ScrollView } from "react-native";

export function FoodAPIBarcode({ barcode }) {

  const [food, setFood] = useState(null);

  if (!barcode) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Esperando código de barras...</Text>
      </View>
    );
  }

  useEffect(() => {

    const getProduct = async () => {
      try {
        const response = await fetch(
          `https://world.openfoodfacts.net/api/v2/product/${barcode}`
        );
        const data = await response.json();

        if (data.product) {
          setFood(data.product);
        }
      } catch (error) {
        console.error("error:", error);
      }
    };

    getProduct();

  }, [barcode]);

  if (!food) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Cargando alimento...</Text>
      </View>
    );
  }

  const kcal100 = food.nutriments?.["energy-kcal_100g"] ?? 0;
  const protein100 = food.nutriments?.["proteins_100g"] ?? 0;
  const carbs100 = food.nutriments?.["carbohydrates_100g"] ?? 0;
  const fat100 = food.nutriments?.["fat_100g"] ?? 0;
  const salt100 = food.nutriments?.["salt_100g"] ?? 0;
  const sugar100 = food.nutriments?.["sugars_100g"] ?? 0;

  let weight = null;

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

  return (

    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.card}>

        {food.image_front_url && (
          <Image
            source={{ uri: food.image_front_url }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <Text style={styles.title}>{food.product_name}</Text>
        <Text style={styles.brand}>{food.brands}</Text>

      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Por 100g / 100ml</Text>

        <Text style={styles.text}>Calorías: {kcal100}</Text>
        <Text style={styles.text}>Proteínas: {protein100} g</Text>
        <Text style={styles.text}>Carbohidratos: {carbs100} g</Text>
        <Text style={styles.text}>Grasas: {fat100} g</Text>
        <Text style={styles.text}>Sal: {salt100} g</Text>
        <Text style={styles.text}>Azúcar: {sugar100} g</Text>
      </View>

      {weight ? (
        <View style={styles.card}>
          <Text style={styles.section}>
            Producto completo ({food.quantity ?? weight})
          </Text>

          <Text style={styles.text}>Calorías: {kcalTotal.toFixed(1)}</Text>
          <Text style={styles.text}>Proteínas: {proteinTotal.toFixed(1)} g</Text>
          <Text style={styles.text}>Carbohidratos: {carbsTotal.toFixed(1)} g</Text>
          <Text style={styles.text}>Grasas: {fatTotal.toFixed(1)} g</Text>
          <Text style={styles.text}>Sal: {saltTotal.toFixed(1)} g</Text>
          <Text style={styles.text}>Azúcar: {sugarTotal.toFixed(1)} g</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.section}>Producto completo</Text>
          <Text style={styles.info}>
            Tamaño del producto no disponible en la base de datos
          </Text>
        </View>
      )}

    </ScrollView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 20,
    gap: 12,
  },

  card: {
    backgroundColor: "#E6F1FB",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#B5D4F4",
  },

  image: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#185FA5",
    textAlign: "center",
  },

  brand: {
    fontSize: 14,
    color: "#7A9CC6",
    textAlign: "center",
    marginTop: 4,
  },

  section: {
    fontSize: 15,
    fontWeight: "600",
    color: "#185FA5",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    color: "#185FA5",
    marginBottom: 2,
  },

  info: {
    fontSize: 14,
    color: "#7A9CC6",
    textAlign: "center",
  },

});