import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../db/firebase.js";
import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

const BLUE = "#185FA5";
const BLUE_MID = "#378ADD";

export function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
      });

      console.log(`User ${user.email} registered`);

      setName("");
      setEmail("");
      setPassword("");

      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>

        {/* HEADER */}
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Start tracking your nutrition journey
        </Text>

        {/* NAME */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Adrian"
            placeholderTextColor="#AAA"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#AAA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#AAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        {/* FOOTER */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.footerText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: BLUE,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0A0A0A",
    fontWeight: "500",
  },

  button: {
    marginTop: 10,
    backgroundColor: BLUE,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: BLUE_MID,
    fontWeight: "600",
  },
});