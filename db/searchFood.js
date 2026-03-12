import { useState } from "react";
import { View, TextInput, Button } from "react-native";

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
    <View>
      <TextInput
        placeholder="Buscar alimento..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={searchProduct} />
    </View>
  );
}