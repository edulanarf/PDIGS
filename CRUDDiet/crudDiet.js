import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const BLUE = "#185FA5";
const BLUE_LIGHT = "#E6F1FB";
const BLUE_MID = "#378ADD";

export function CrudDiet({ navigation }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <Text style={styles.eyebrow}>Nutrition system</Text>
      <Text style={styles.title}>Diet management</Text>
      <Text style={styles.subtitle}>
        Control and edit your plans
      </Text>

      {/* GRID */}
      <View style={styles.grid}>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ViewDiet")}
        >
          <Ionicons name="eye-outline" size={26} color={BLUE} />
          <Text style={styles.cardText}>Diets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("SetObjective")}
        >
          <Ionicons name="add-circle-outline" size={26} color={BLUE} />
          <Text style={styles.cardText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("EditDiet")}
        >
          <MaterialIcons name="edit" size={26} color={BLUE} />
          <Text style={styles.cardText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("DeleteDiet")}
        >
          <MaterialIcons name="delete-outline" size={26} color={BLUE} />
          <Text style={styles.cardText}>Delete</Text>
        </TouchableOpacity>

      </View>
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
    paddingTop: 28,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    color: BLUE_MID,
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A0A0A",
    marginTop: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    marginBottom: 24,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: BLUE_LIGHT,
    borderWidth: 1,
    borderColor: "#B5D4F4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: BLUE,
    textAlign: "center",
  },
});