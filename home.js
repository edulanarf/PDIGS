import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { AnimatedCircularProgress } from "react-native-circular-progress";
import { auth } from "./db/firebase.js";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export function Home({ navigation }) {
  const caloriasConsumidas = 1200;
  const caloriasObjetivo = 2000;

  const porcentaje = (caloriasConsumidas / caloriasObjetivo) * 100;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appName}>Easy Diet</Text>

        <TouchableOpacity
          onPress={() =>
            auth.currentUser
              ? navigation.navigate("Objetivos")
              : navigation.navigate("Login")
          }
        >
          <Ionicons name="settings-outline" size={24} color="#185FA5" />
        </TouchableOpacity>
      </View>

      {/* HERO / PROGRESS */}
      <View style={styles.hero}>
        <AnimatedCircularProgress
          size={220}
          width={18}
          fill={porcentaje}
          tintColor="#185FA5"
          backgroundColor="#E6F1FB"
          rotation={-90}
          arcSweepAngle={180}
        >
          {() => (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.caloriesBig}>
                {caloriasConsumidas}
              </Text>
              <Text style={styles.caloriesSub}>
                / {caloriasObjetivo} kcal
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* ACTIONS */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Scaner")}
        >
          <Ionicons name="camera" size={28} color="#185FA5" />
          <Text style={styles.cardText}>Scan food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("SearchFood")}
        >
          <Ionicons name="search" size={28} color="#185FA5" />
          <Text style={styles.cardText}>Search food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Dietas")}
        >
          <FontAwesome5 name="utensils" size={24} color="#185FA5" />
          <Text style={styles.cardText}>Diets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("SetObjective")}
        >
          <FontAwesome5 name="plus" size={24} color="#185FA5" />
          <Text style={styles.cardText}>New diet</Text>
        </TouchableOpacity>
      </View>

      {/* LOGIN CTA (solo si no está logueado) */}
      {!auth.currentUser && (
        <TouchableOpacity
          style={styles.loginCard}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="log-in-outline" size={20} color="#185FA5" />
          <Text style={styles.loginText}>
            Sign in to save your progress
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 30 }} />
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#185FA5",
  },

  hero: {
    alignItems: "center",
    marginVertical: 20,
  },

  caloriesBig: {
    fontSize: 28,
    fontWeight: "700",
    color: "#185FA5",
  },

  caloriesSub: {
    fontSize: 14,
    color: "#888",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  card: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#E6F1FB",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#B5D4F4",
  },

  cardText: {
    marginTop: 8,
    color: "#185FA5",
    fontWeight: "600",
    fontSize: 13,
  },

  loginCard: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#E6F1FB",
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#B5D4F4",
  },

  loginText: {
    color: "#185FA5",
    fontWeight: "600",
  },
});