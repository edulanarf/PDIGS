import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export function CrudDiet({ navigation }) {

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>GESTIÓN DE DIETAS</Text>

      <View style={styles.grid}>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("ViewDiet")}
        >
          <Ionicons name="eye" size={30} color="white" />
          <Text style={styles.texto}>Ver dietas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("CreateDiet")}
        >
          <Ionicons name="add-circle" size={30} color="white" />
          <Text style={styles.texto}>Crear dieta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("EditDiet")}
        >
          <MaterialIcons name="edit" size={30} color="white" />
          <Text style={styles.texto}>Editar dieta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("DeleteDiet")}
        >
          <MaterialIcons name="delete" size={30} color="white" />
          <Text style={styles.texto}>Eliminar dieta</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container:{
    flexGrow:1,
    padding:20,
    backgroundColor:"#0f172a",
    alignItems:"center"
  },

  titulo:{
    fontSize:28,
    fontWeight:"bold",
    marginBottom:40,
    color:"white"
  },

  grid:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"space-between",
    width:"100%"
  },

  boton:{
    backgroundColor:"#10b981",
    width:"48%",
    aspectRatio:1,
    borderRadius:20,
    marginBottom:20,
    alignItems:"center",
    justifyContent:"center",
    gap:10,
    alignSelf: "center"
  },

  texto:{
    color:"white",
    fontSize:16,
    fontWeight:"bold"
  }

});