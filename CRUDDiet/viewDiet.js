import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { db,auth } from "../db/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const BLUE = "#185FA5";
const BLUE_LIGHT = "#E6F1FB";
const BLUE_MID = "#378ADD";

export function ViewDiet({navigation}) {
  const [dietas, setDietas] = useState([]);

  const load = async (uid) => {
    const snap = await getDocs(collection(db, `users/${uid}/dietas`));

    const lista = [];
    snap.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });

    setDietas(lista);
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    load(uid);
  }, []);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.eyebrow}>Nutrition system</Text>
      <Text style={styles.title}>Your diets</Text>
      <Text style={styles.subtitle}>
        Select your diet
      </Text>

      {/* LISTA */}
      <FlatList
        data={dietas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const active = false

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("DietPage", {
              dietId: item.id
            })}
              style={[
                styles.card,
                active && styles.cardActive
              ]}
            >
              <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                {item.name}
              </Text>

              <Text style={styles.cardSub}>
                {item.calorias} kcal • {item.objetivo}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
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
    marginTop: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },

  card: {
    backgroundColor: BLUE_LIGHT,
    borderWidth: 1,
    borderColor: "#B5D4F4",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  cardActive: {
    borderColor: BLUE_MID,
    backgroundColor: "#DCEEFF",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BLUE,
  },

  cardTitleActive: {
    color: "#0A0A0A",
  },

  cardSub: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },

  detailCard: {
    marginTop: 10,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F5F9FF",
    borderWidth: 1,
    borderColor: "#B5D4F4",
  },

  detailTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: BLUE,
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  detailLabel: {
    color: "#666",
    fontSize: 13,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0A0A0A",
  },
});