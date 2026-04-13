import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { auth } from './db/firebase.js';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export function Home({ navigation }) {

  const caloriasConsumidas = 1200;
  const caloriasObjetivo = 2000;

  const porcentaje = (caloriasConsumidas / caloriasObjetivo) * 100;

  const handleCrearDieta = () => {
    const user = auth.currentUser;

    if (user) {
      navigation.navigate("Dietas");
    } else {
      navigation.navigate("Login");
    }
  };

  return (

    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      {/* 🔹 Botón arriba derecha */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Objetivos")}>
          <Text style={styles.objetivosBtn}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Gráfica semicircular */}
      <View style={styles.graficaContainer}>
        <AnimatedCircularProgress
          size={200}
          width={20}
          fill={porcentaje}
          tintColor="#00e0ff"
          backgroundColor="#3d5875"
          rotation={-90}
          arcSweepAngle={180} // 🔥 esto hace el semicirculo
        >
          {
            () => (
              <Text style={styles.caloriasText}>
                {caloriasConsumidas} / {caloriasObjetivo} kcal
              </Text>
            )
          }
        </AnimatedCircularProgress>
      </View>

      {/* 🔹 Botones principales */}
      <View style={styles.botonesContainer}>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.textoBoton}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.textoBoton}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Scaner")}>
          <Ionicons name="camera" size={28} color="white" />
          <Text style={styles.textoBoton}>Escanear comida</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("SearchFood")}>
          <Ionicons name="search" size={28} color="white" />
          <Text style={styles.textoBoton}>Buscar comida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("Dietas")}
        >
          <FontAwesome5 name="file-alt" size={24} color="white" />
          <Text style={styles.textoBoton}>Dietas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("SetObjective")}
        >
          <FontAwesome5 name="check-double" size={24} color="white" />
          <Text style={styles.textoBoton}>Marcar Objetivo</Text>
        </TouchableOpacity>


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },

  topBar: {
    alignItems: "flex-end",
    marginBottom: 10,
  },

  objetivosBtn: {
    fontSize: 24,
    color: "white",
  },

  graficaContainer: {
    alignItems: "center",
    marginVertical: 20,
  },

  caloriasText: {
    color: "white",
    fontSize: 16,
  },

botonesContainer: {
  marginTop: 20,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

boton: {
  backgroundColor: "#2563eb",
  width: "48%",
  aspectRatio: 1,
  borderRadius: 20,
  marginBottom: 15,
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  alignSelf: "center"
},

  botonesCRUD: {
  flexDirection: "row",
  justifyContent: "space-center",
  marginTop: 10,
},

  botonCRUD: {
  backgroundColor: "#10b981",
  width: "48%",
  aspectRatio: 1,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  gap: 8
},

  textoBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});