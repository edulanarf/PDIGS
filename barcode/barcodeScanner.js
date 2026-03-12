import { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export function BarcodeScanner({ onScan }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />; // permisos aún cargando
  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos permisos para usar la cámara</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Dar permisos</Text>
        </TouchableOpacity>
      </View>
    );

  const handleScan = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      onScan(data); // devolvemos el código escaneado
      console.log(`Código escaneado: ${data} (tipo: ${type})`);
    }
  };

  const toggleCamera = () => {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onCameraReady={() => console.log("Camera lista")}
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a", "qr"], // tipos de código que quieres detectar
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCamera}>
          <Text style={styles.text}>Cambiar cámara</Text>
        </TouchableOpacity>
        {scanned && (
          <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
            <Text style={styles.text}>Escanear de nuevo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  button: { padding: 10, backgroundColor: "#0008", borderRadius: 5 },
  text: { color: "white", fontWeight: "bold" },
  message: { textAlign: "center", marginBottom: 10 },
});