import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function SearchFood() {

  const [query, setQuery] = useState("");

  const searchProduct = async () => {

    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=ptDDz4BdqqbNnOd5EJB1fyNVTnxBN3vYpKvX5Y6u`
    );

    const data = await response.json();

    const surveyFoods = data.foods.filter(f => f.dataType === "Survey (FNDDS)");

    surveyFoods.forEach((food) => {
      const kcal = food.foodNutrients.find((n) => n.nutrientName === "Energy")?.value || 0;
      const protein = food.foodNutrients.find((n) => n.nutrientName === "Protein")?.value || 0;
      const fat = food.foodNutrients.find((n) => n.nutrientName === "Total lipid (fat)")?.value || 0;

      console.log(`${food.description} | ${kcal} kcal | ${protein} g proteína | ${fat} g grasa`);
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#185FA5" />

        <TextInput
          placeholder="Buscar alimento..."
          placeholderTextColor="#7A9CC6"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={searchProduct}>
        <Ionicons name="search" size={18} color="white" />
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingTop: 30,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F1FB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#B5D4F4",
    marginBottom: 14,
    gap: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#185FA5",
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#185FA5",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

});