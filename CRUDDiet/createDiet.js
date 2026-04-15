import React, { useState,useEffect } from "react";
import {
View,
TextInput,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
ActivityIndicator,
Alert
} from "react-native";

import { db,auth } from "../db/firebase.js";
import { setDoc, doc, serverTimestamp,getDoc } from "firebase/firestore";


// 🎨 mismos colores del SetObjective
const BLUE = "#185FA5";
const BLUE_LIGHT = "#E6F1FB";
const BLUE_MID = "#378ADD";

export function CreateDiet({navigation}) {

const uid = auth.currentUser?.uid;
const [objetivo, setObjetivo] = useState("");

const [name, setName] = useState("");
const [calorias, setCalorias] = useState("");
const [proteinas, setProteinas] = useState("");
const [grasas, setGrasas] = useState("");
const [carbohidratos, setCarbohidratos] = useState("");

const [restricciones, setRestricciones] = useState("");
const [prohibidos, setProhibidos] = useState("");
const [recomendados, setRecomendados] = useState("");

const [fechaInicio, setFechaInicio] = useState("");
const [fechaFin, setFechaFin] = useState("");

const [loading, setLoading] = useState(false);

// CARGO LOS OBJETIVOS PARA PONER LAS CALORIAS PROTEINAS GRASAS E HIDRATOS EN LOS CAMPOS

useEffect(() => {

const loadCaloriesAndMacros = async () => {

try {

const uid = auth.currentUser?.uid;

if (!uid) return;

const snap = await getDoc(doc(db, "objectives", uid));

if (!snap.exists()) return;

const data = snap.data();

if (!data.dailyCalorieTarget) return;

setObjetivo(data.goal || "");

const calories = data.dailyCalorieTarget;

setCalorias(String(calories));


// 🧮 cálculo automático macros

const protein = Math.round((calories * 0.30) / 4);

const fat = Math.round((calories * 0.25) / 9);

const carbs = Math.round((calories * 0.45) / 4);


setProteinas(String(protein));

setGrasas(String(fat));

setCarbohidratos(String(carbs));

} catch (error) {

console.log("Error loading macros:", error);

}

};

loadCaloriesAndMacros();

}, []);

const create = async () => {

if (!name)
return Alert.alert("Nombre requerido","Introduce un nombre para la dieta");

setLoading(true);

try {

const dieta = {

name,
userId: uid,

calorias: Number(calorias),
proteinas: Number(proteinas),
grasas: Number(grasas),
carbohidratos: Number(carbohidratos),
objetivo: objetivo,

restricciones: restricciones.split(",").map(x=>x.trim()),
alimentosProhibidos: prohibidos.split(",").map(x=>x.trim()),
alimentosRecomendados: recomendados.split(",").map(x=>x.trim()),

fechaInicio,
fechaFin,

createdAt: serverTimestamp()

};

await setDoc(
doc(db, `users/${uid}/dietas/${name}`),
dieta
);

Alert.alert("Guardado","Dieta creada correctamente");

navigation.navigate("DietPage", {
  dietId: dieta.name
});

} catch(error) {

console.log(error);

Alert.alert("Error","No se pudo crear la dieta");

} finally {

setLoading(false);

}

};

return (

<ScrollView
style={styles.container}
contentContainerStyle={styles.content}
showsVerticalScrollIndicator={false}
>

{/* HEADER */}

<View style={styles.header}>

<Text style={styles.eyebrow}>Nutrition planner</Text>

<Text style={styles.title}>Create diet</Text>

<Text style={styles.subtitle}>
Define macros and food preferences
</Text>

</View>


{/* BASIC INFO */}

<View style={styles.section}>

<Text style={styles.sectionLabel}>Basic info</Text>

<TextInput
style={styles.input}
placeholder="Diet name"
placeholderTextColor="#959595"
value={name}
onChangeText={setName}
/>

<View style={styles.inputGroup}>

<Text style={styles.inputLabel}>
Calories (kcal)
</Text>

<TextInput
style={styles.input}
keyboardType="numeric"
value={calorias}
onChangeText={setCalorias}
/>

</View>

<View style={styles.row}>

{/* PROTEIN */}
<View style={styles.inputGroup}>

<Text style={styles.inputLabel}>
Protein (g)
</Text>

<TextInput
style={styles.input}
keyboardType="numeric"
value={proteinas}
onChangeText={setProteinas}
/>

</View>

<View style={{ width: 12 }} />

{/* FAT */}
<View style={styles.inputGroup}>

<Text style={styles.inputLabel}>
Fat (g)
</Text>

<TextInput
style={styles.input}
keyboardType="numeric"
value={grasas}
onChangeText={setGrasas}
/>

</View>

</View>

<View style={styles.inputGroup}>

<Text style={styles.inputLabel}>
Carbs (g)
</Text>

<TextInput
style={styles.input}
keyboardType="numeric"
value={carbohidratos}
onChangeText={setCarbohidratos}
/>

</View>

</View>


{/* FOOD SETTINGS */}

<View style={styles.section}>

<Text style={styles.sectionLabel}>Food preferences</Text>

<TextInput
style={styles.input}
placeholder="Restrictions (comma separated)"
placeholderTextColor="#959595"
value={restricciones}
onChangeText={setRestricciones}
/>

<TextInput
style={styles.input}
placeholder="Forbidden foods"
placeholderTextColor="#959595"
value={prohibidos}
onChangeText={setProhibidos}
/>

<TextInput
style={styles.input}
placeholder="Recommended foods"
placeholderTextColor="#959595"
value={recomendados}
onChangeText={setRecomendados}
/>

</View>


{/* DATES */}

<View style={styles.section}>

<Text style={styles.sectionLabel}>Timeline</Text>

<View style={styles.row}>

<TextInput
style={[styles.input,{flex:1}]}
placeholder="Start date"
placeholderTextColor="#959595"
value={fechaInicio}
onChangeText={setFechaInicio}
/>

<View style={{width:10}}/>

<TextInput
style={[styles.input,{flex:1}]}
placeholder="End date"
placeholderTextColor="#959595"
value={fechaFin}
onChangeText={setFechaFin}
/>

</View>

</View>


{/* BUTTON */}

<TouchableOpacity
style={[styles.saveBtn, loading && {opacity:.7}]}
onPress={create}
disabled={loading}
>

{loading
? <ActivityIndicator color="#fff"/>
: <Text style={styles.saveBtnText}>Create diet</Text>
}

</TouchableOpacity>

<View style={{height:40}}/>

</ScrollView>

);

}


// 🎨 styles clonados del SetObjective

const styles = StyleSheet.create({

container:{ flex:1, backgroundColor:"#FFFFFF" },

content:{ padding:20, paddingTop:28 },


header:{ marginBottom:28 },

eyebrow:{
fontSize:11,
fontWeight:"600",
color:BLUE_MID,
letterSpacing:.9,
textTransform:"uppercase"
},

title:{
fontSize:26,
fontWeight:"700",
marginTop:4
},

subtitle:{
fontSize:14,
color:"#888"
},


section:{ marginBottom:24 },

sectionLabel:{
fontSize:11,
fontWeight:"600",
color:"#999",
letterSpacing:.9,
textTransform:"uppercase",
marginBottom:10
},
inputGroup:{
flex:1
},

inputLabel:{
fontSize:11,
fontWeight:"600",
color:"#999",
letterSpacing:0.9,
textTransform:"uppercase",
marginBottom:6
},


row:{ flexDirection:"row" },


input:{
backgroundColor:"#F5F5F5",
borderRadius:10,
borderWidth:1,
borderColor:"#E5E5E5",
color:"#0A0A0A",
fontSize:16,
fontWeight:"600",
paddingHorizontal:14,
paddingVertical:11,
marginBottom:10
},


goalRow:{
flexDirection:"row",
gap:8
},

goalCard:{
flex:1,
borderRadius:10,
borderWidth:1,
borderColor:"#E5E5E5",
backgroundColor:"#FAFAFA",
padding:12,
alignItems:"center"
},

goalCardActive:{
borderColor:BLUE_MID,
borderWidth:1.5,
backgroundColor:BLUE_LIGHT
},

goalLabel:{
fontSize:12,
fontWeight:"600",
color:"#333"
},

goalLabelActive:{
color:BLUE
},


saveBtn:{
borderRadius:12,
paddingVertical:16,
alignItems:"center",
backgroundColor:BLUE
},

saveBtnText:{
color:"#FFF",
fontSize:16,
fontWeight:"700"
}

});