import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../db/firebase";

// ─────────────────────────────────────────────
//  CONSTANTES
// ─────────────────────────────────────────────

const GOALS = [
  {
    id: "lose",
    label: "Lose weight",
    icon: "↓",
    description: "Burn fat",
    calorieDelta: -500,
    weeklyChange: -0.5,
  },
  {
    id: "maintain",
    label: "Maintain",
    icon: "⟷",
    description: "Stay stable",
    calorieDelta: 0,
    weeklyChange: 0,
  },
  {
    id: "gain",
    label: "Gain weight",
    icon: "↑",
    description: "Build mass",
    calorieDelta: 500,
    weeklyChange: 0.5,
  },
];

const ACTIVITY_LEVELS = [
  { key: "sedentary", label: "Sedentary",        detail: "Little or no exercise", multiplier: 1.2 },
  { key: "light",     label: "Lightly active",   detail: "1–3 days/week",         multiplier: 1.375 },
  { key: "moderate",  label: "Moderately active", detail: "3–5 days/week",        multiplier: 1.55 },
  { key: "active",    label: "Very active",       detail: "6–7 days/week",         multiplier: 1.725 },
];

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

function calcTDEE(weight, height, age, sex, activityKey) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  const bmr  = sex === "female" ? base - 161 : base + 5;
  const mult = ACTIVITY_LEVELS.find((a) => a.key === activityKey)?.multiplier ?? 1.55;
  return Math.round(bmr * mult);
}

function weeksToGoal(current, target, weeklyChange) {
  if (!weeklyChange) return null;
  return Math.ceil(Math.abs(target - current) / Math.abs(weeklyChange));
}

// ─────────────────────────────────────────────
//  AUTH MODAL  (login / register bottom sheet)
// ─────────────────────────────────────────────

function AuthModal({ visible, onClose, onSuccess }) {
  const [mode, setMode]         = useState("login");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  function reset() {
    setName(""); setEmail(""); setPassword(""); setMode("login");
  }

  function handleClose() { reset(); onClose(); }

  async function handleSubmit() {
    if (!email || !password || (mode === "register" && !name)) {
      Alert.alert("Campos requeridos", "Por favor rellena todos los campos.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", user.uid), { name, email });
      }
      reset();
      onSuccess();
    } catch (error) {
      const msgs = {
        "auth/invalid-email":        "El email no es válido.",
        "auth/user-not-found":       "No existe cuenta con ese email.",
        "auth/wrong-password":       "Contraseña incorrecta.",
        "auth/email-already-in-use": "Ese email ya está registrado.",
        "auth/weak-password":        "La contraseña debe tener al menos 6 caracteres.",
      };
      Alert.alert("Error", msgs[error.code] || "Algo salió mal. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={authStyles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={authStyles.sheet}>
          {/* Header */}
          <View style={authStyles.header}>
            <Text style={authStyles.title}>
              {mode === "login" ? "Inicia sesión" : "Crear cuenta"}
            </Text>
            <TouchableOpacity onPress={handleClose} style={authStyles.closeBtn}>
              <Text style={authStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={authStyles.subtitle}>
            {mode === "login"
              ? "Necesitas iniciar sesión para guardar tu objetivo."
              : "Crea una cuenta gratuita para guardar tu progreso."}
          </Text>

          {/* Tabs */}
          <View style={authStyles.tabs}>
            <TouchableOpacity
              style={[authStyles.tab, mode === "login" && authStyles.tabActive]}
              onPress={() => setMode("login")}
            >
              <Text style={[authStyles.tabText, mode === "login" && authStyles.tabTextActive]}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[authStyles.tab, mode === "register" && authStyles.tabActive]}
              onPress={() => setMode("register")}
            >
              <Text style={[authStyles.tabText, mode === "register" && authStyles.tabTextActive]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          {mode === "register" && (
            <View style={authStyles.fieldGroup}>
              <Text style={authStyles.label}>Nombre</Text>
              <TextInput
                style={authStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor="#888"
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={authStyles.fieldGroup}>
            <Text style={authStyles.label}>Email</Text>
            <TextInput
              style={authStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={authStyles.fieldGroup}>
            <Text style={authStyles.label}>Contraseña</Text>
            <TextInput
              style={authStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#888"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[authStyles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.submitText}>
                {mode === "login" ? "Entrar y guardar" : "Registrarme y guardar"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────

export function SetObjective({ navigation }) {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight,  setTargetWeight]  = useState("");
  const [height,        setHeight]        = useState("");
  const [age,           setAge]           = useState("");
  const [sex,           setSex]           = useState("male");
  const [selectedGoal,  setSelectedGoal]  = useState("lose");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [loading,       setLoading]       = useState(false);
  const [fetchingData,  setFetchingData]  = useState(true);
  const [showAuth,      setShowAuth]      = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    loadExistingObjective();
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  async function loadExistingObjective() {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, "objectives", uid));
      if (snap.exists()) {
        const d = snap.data();
        if (d.currentWeight) setCurrentWeight(String(d.currentWeight));
        if (d.targetWeight)  setTargetWeight(String(d.targetWeight));
        if (d.height)        setHeight(String(d.height));
        if (d.age)           setAge(String(d.age));
        if (d.sex)           setSex(d.sex);
        if (d.goal)          setSelectedGoal(d.goal);
        if (d.activityLevel) setActivityLevel(d.activityLevel);
      }
    } catch (e) {
      console.warn("No se pudo cargar el objetivo:", e);
    } finally {
      setFetchingData(false);
    }
  }

  // Derived values
  const cw   = parseFloat(currentWeight) || 0;
  const tw   = parseFloat(targetWeight)  || 0;
  const h    = parseFloat(height)        || 0;
  const a    = parseFloat(age)           || 0;
  const goal = GOALS.find((g) => g.id === selectedGoal);
  const tdee          = cw && h && a ? calcTDEE(cw, h, a, sex, activityLevel) : null;
  const dailyCalories = tdee ? tdee + goal.calorieDelta : null;
  const weeks         = tw && cw ? weeksToGoal(cw, tw, goal.weeklyChange) : null;

  function validate() {
    if (!cw || cw < 20 || cw > 300)
      return Alert.alert("Peso inválido", "Introduce un peso actual entre 20 y 300 kg.") || false;
    if (!tw || tw < 20 || tw > 300)
      return Alert.alert("Peso inválido", "Introduce un peso objetivo entre 20 y 300 kg.") || false;
    if (selectedGoal === "lose" && tw >= cw)
      return Alert.alert("Meta inválida", "El peso objetivo debe ser menor al actual.") || false;
    if (selectedGoal === "gain" && tw <= cw)
      return Alert.alert("Meta inválida", "El peso objetivo debe ser mayor al actual.") || false;
    if (!h || h < 100 || h > 250)
      return Alert.alert("Altura inválida", "Introduce una altura entre 100 y 250 cm.") || false;
    if (!a || a < 10 || a > 120)
      return Alert.alert("Edad inválida", "Introduce una edad entre 10 y 120.") || false;
    return true;
  }

  async function doSave() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setLoading(true);
    try {
      await setDoc(
        doc(db, "objectives", uid),
        {
          currentWeight: cw,
          targetWeight: tw,
          height: h,
          age: a,
          sex,
          goal: selectedGoal,
          activityLevel,
          dailyCalorieTarget: dailyCalories,
          tdee,
          weeklyWeightChange: goal.weeklyChange,
          estimatedWeeks: weeks,
          updatedAt: new Date().toISOString(),
          uid,
        },
        { merge: true }
      );
      navigation.navigate("CreateDiet");
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar. Inténtalo de nuevo.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!validate()) return;
    if (!auth.currentUser) {
      setShowAuth(true); // abre el modal si no hay sesión
    } else {
      doSave();
    }
  }

  // ── Loading screen ──
  if (fetchingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#185FA5" />
        <Text style={styles.loadingText}>Cargando tu perfil…</Text>
      </View>
    );
  }

  // ── Summary note text ──
  const summaryNotes = {
    lose:     "Un déficit de 500 kcal lleva a ~0,5 kg/semana de pérdida de grasa.",
    maintain: "Comer en tu TDEE mantiene el peso estable.",
    gain:     "Un superávit de 500 kcal apoya ~0,5 kg/semana de masa muscular.",
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.eyebrow}>Fitness planner</Text>
            <Text style={styles.title}>Set your goal</Text>
            <Text style={styles.subtitle}>Define your path and we'll calculate the rest</Text>
          </Animated.View>

          {/* Goal selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Objective</Text>
            <View style={styles.goalRow}>
              {GOALS.map((g) => {
                const active = selectedGoal === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    style={[styles.goalCard, active && styles.goalCardActive]}
                    onPress={() => setSelectedGoal(g.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.goalIcon, active && styles.goalIconActive]}>{g.icon}</Text>
                    <Text style={[styles.goalLabel, active && styles.goalLabelActive]}>{g.label}</Text>
                    <Text style={[styles.goalDesc, active && styles.goalDescActive]}>{g.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Weight */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Weight (kg)</Text>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current</Text>
                <TextInput
                  style={styles.input}
                  value={currentWeight}
                  onChangeText={setCurrentWeight}
                  keyboardType="decimal-pad"
                  placeholder="80"
                  placeholderTextColor="#959595"
                  maxLength={6}
                />
              </View>
              <View style={[styles.inputGroup, { marginLeft: 12 }]}>
                <Text style={styles.inputLabel}>Target</Text>
                <TextInput
                  style={[styles.input, styles.inputAccent]}
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  keyboardType="decimal-pad"
                  placeholder="72"
                  placeholderTextColor="#959595"
                  maxLength={6}
                />
              </View>
            </View>
          </View>

          {/* Body stats */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Body stats</Text>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                  placeholder="175"
                  placeholderTextColor="#959595"
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, { marginLeft: 12 }]}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  placeholder="28"
                  placeholderTextColor="#959595"
                  maxLength={3}
                />
              </View>
            </View>

            {/* Sex */}
            <Text style={[styles.inputLabel, { marginTop: 14, marginBottom: 8 }]}>
              Biological sex
            </Text>
            <View style={styles.row}>
              {["male", "female"].map((s) => {
                const active = sex === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.sexBtn, active && styles.sexBtnActive, s === "male" && { marginRight: 8 }]}
                    onPress={() => setSex(s)}
                  >
                    <Text style={[styles.sexBtnText, active && styles.sexBtnTextActive]}>
                      {s === "male" ? "Male" : "Female"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Activity level</Text>
            {ACTIVITY_LEVELS.map((item) => {
              const active = activityLevel === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.activityRow, active && styles.activityRowActive]}
                  onPress={() => setActivityLevel(item.key)}
                >
                  <View>
                    <Text style={[styles.activityLabel, active && styles.activityLabelActive]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.activityDetail, active && styles.activityDetailActive]}>
                      {item.detail}
                    </Text>
                  </View>
                  {active && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Summary */}
          {dailyCalories && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Your plan</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryValue}>{dailyCalories}</Text>
                  <Text style={styles.summaryKey}>kcal/day</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryValue}>
                    {goal.weeklyChange === 0
                      ? "±0"
                      : `${goal.weeklyChange > 0 ? "+" : ""}${goal.weeklyChange}`}
                  </Text>
                  <Text style={styles.summaryKey}>kg/week</Text>
                </View>
                {weeks && (
                  <>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryStat}>
                      <Text style={styles.summaryValue}>{weeks}</Text>
                      <Text style={styles.summaryKey}>weeks est.</Text>
                    </View>
                  </>
                )}
              </View>
              <Text style={styles.summaryNote}>{summaryNotes[selectedGoal]}</Text>
            </View>
          )}

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save objective</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Auth Modal — se muestra si no hay sesión al guardar */}
      <AuthModal
        visible={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          doSave();
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
//  STYLES — SetObjective
// ─────────────────────────────────────────────

const BLUE      = "#185FA5";
const BLUE_LIGHT = "#E6F1FB";
const BLUE_MID  = "#378ADD";

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

  // Sections
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  // Goals
  goalRow: {
    flexDirection: "row",
    gap: 8,
  },
  goalCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
    padding: 12,
    alignItems: "center",
  },
  goalCardActive: {
    borderColor: BLUE_MID,
    borderWidth: 1.5,
    backgroundColor: BLUE_LIGHT,
  },
  goalIcon:        { fontSize: 18, color: "#999",   marginBottom: 4 },
  goalIconActive:  { color: BLUE },
  goalLabel:       { fontSize: 12, fontWeight: "600", color: "#333", textAlign: "center" },
  goalLabelActive: { color: BLUE },
  goalDesc:        { fontSize: 10, color: "#AAA",  marginTop: 2, textAlign: "center" },
  goalDescActive:  { color: BLUE_MID },

  // Inputs
  row:        { flexDirection: "row" },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 12, color: "#888", fontWeight: "500", marginBottom: 6 },
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

  // Sex
  sexBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  sexBtnActive:     { backgroundColor: BLUE_LIGHT, borderColor: BLUE_MID, borderWidth: 1.5 },
  sexBtnText:       { color: "#888", fontSize: 13, fontWeight: "600" },
  sexBtnTextActive: { color: BLUE },

  // Activity
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "transparent",
  },
  activityRowActive:   { borderColor: BLUE_MID, backgroundColor: BLUE_LIGHT },
  activityLabel:       { color: "#333", fontWeight: "600", fontSize: 13 },
  activityLabelActive: { color: BLUE },
  activityDetail:      { color: "#AAA", fontSize: 11, marginTop: 1 },
  activityDetailActive:{ color: BLUE_MID },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BLUE,
  },

  // Summary
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
    marginBottom: 12,
  },
  summaryStat:    { alignItems: "center" },
  summaryValue:   { fontSize: 24, fontWeight: "700", color: BLUE },
  summaryKey:     { fontSize: 11, color: BLUE_MID, marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: "#B5D4F4" },
  summaryNote:    { fontSize: 12, color: "#185FA5", lineHeight: 17, textAlign: "center" },

  // Save button
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: BLUE,
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

// ─────────────────────────────────────────────
//  STYLES — AuthModal
// ─────────────────────────────────────────────

const authStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(24,95,165,0.25)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 2,
    borderTopColor: BLUE_MID,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    borderTopWidth: 0.5,
    borderColor: "#E5E5E5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title:     { fontSize: 19, fontWeight: "700", color: "#0A0A0A" },
  closeBtn:  { padding: 4 },
  closeText: { fontSize: 16, color: "#AAA" },
  subtitle:  { fontSize: 13, color: "#888", marginBottom: 18, lineHeight: 18 },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 3,
    marginBottom: 18,
  },
  tab:           { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: "center" },
  tabActive:     { backgroundColor: BLUE },
  tabText:       { fontSize: 13, fontWeight: "600", color: "#999" },
  tabTextActive: { color: "#FFFFFF" },

  fieldGroup: { marginBottom: 13 },
  label:      { fontSize: 12, color: "#888", fontWeight: "500", marginBottom: 6 },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    color: "#0A0A0A",
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  submitBtn: {
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: "center",
  backgroundColor: BLUE,
  marginTop: 6,
},

submitText: {
  color: "#FFF",
  fontSize: 15,
  fontWeight: "700",
  letterSpacing: 0.2,
},
});