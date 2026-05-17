import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { db } from "../db/firebase.js";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const uid = "Nn8A81GXWYdmdLVWkGYReqb5Kl92";

export function EditDiet() {

  const [dietas,   setDietas]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, `users/${uid}/dietas`));
      const lista = [];
      snap.forEach(d => lista.push({ id: d.id, ...d.data() }));
      setDietas(lista);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateDoc(
        doc(db, `users/${uid}/dietas/${selected.id}`),
        selected
      );
      await load();
      setSelected(null);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Loading screen ──
  if (loading && dietas.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#185FA5" />
        <Text style={styles.loadingText}>Cargando dietas…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Nutrition</Text>
        <Text style={styles.title}>
          {selected ? "Edit diet" : "Your diets"}
        </Text>
        <Text style={styles.subtitle}>
          {selected
            ? "Modify the fields and save your changes"
            : "Select a diet to edit it"}
        </Text>
      </View>

      {!selected ? (

        /* ── Diet list ── */
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Available diets</Text>

          {dietas.length === 0 && (
            <Text style={styles.emptyText}>No diets found.</Text>
          )}

          {dietas.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelected(item)}
              style={styles.dietCard}
              activeOpacity={0.8}
            >
              <View>
                <Text style={styles.dietName}>{item.name}</Text>
                {item.calorias != null && (
                  <Text style={styles.dietSub}>{item.calorias} kcal/day</Text>
                )}
              </View>
              <Text style={styles.dietChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

      ) : (

        /* ── Edit form ── */
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Diet details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={selected.name}
                onChangeText={t => setSelected({ ...selected, name: t })}
                placeholderTextColor="#959595"
                placeholder="Diet name"
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: 14 }]}>
              <Text style={styles.inputLabel}>Calories (kcal/day)</Text>
              <TextInput
                style={[styles.input, styles.inputAccent]}
                value={String(selected.calorias)}
                onChangeText={t => setSelected({ ...selected, calorias: Number(t) })}
                keyboardType="numeric"
                placeholderTextColor="#959595"
                placeholder="2000"
              />
            </View>
          </View>

          {/* Summary card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>{selected.calorias || "—"}</Text>
                <Text style={styles.summaryKey}>kcal/day</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue} numberOfLines={1}>{selected.name || "—"}</Text>
                <Text style={styles.summaryKey}>diet name</Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={save}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveBtnText}>Save changes</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setSelected(null)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>

      )}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────

const BLUE       = "#185FA5";
const BLUE_LIGHT = "#E6F1FB";
const BLUE_MID   = "#378ADD";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingTop: 28,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#888",
    fontSize: 14,
  },

  // Header
  header: {
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    color: BLUE_MID,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A0A0A",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
  },

  // Section
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  // Diet list cards
  dietCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  dietName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A0A0A",
  },
  dietSub: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  dietChevron: {
    fontSize: 20,
    color: BLUE_MID,
    fontWeight: "300",
  },
  emptyText: {
    fontSize: 14,
    color: "#AAA",
    textAlign: "center",
    marginTop: 20,
  },

  // Inputs
  inputGroup: { marginBottom: 4 },
  inputLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    color: "#0A0A0A",
    fontSize: 17,
    fontWeight: "600",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  inputAccent: {
    borderColor: BLUE_MID,
    backgroundColor: BLUE_LIGHT,
    color: BLUE,
  },

  // Summary card
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#B5D4F4",
    backgroundColor: BLUE_LIGHT,
    padding: 18,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: BLUE_MID,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryStat:    { alignItems: "center", flex: 1 },
  summaryValue:   { fontSize: 22, fontWeight: "700", color: BLUE },
  summaryKey:     { fontSize: 11, color: BLUE_MID, marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: "#B5D4F4" },

  // Buttons
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: BLUE,
    marginBottom: 10,
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  cancelBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cancelBtnText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "600",
  },
});