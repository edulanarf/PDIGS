import { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

// Esta funcion se utiliza para habilitar la camara (pedir permisos) y para escanear el codigo de barras
// La camara escanea el codigo de barras mediante

// onScan es el valor que se le pasa a la funcion, como si fueran parámetros. En este caso representa al
// "setBarcode" del fichero scanAndSearch:

export function BarcodeScanner({ onScan }) {
  // Variable para indicar al movil que camara usar, en este caso empieza con la trasera 
  const [facing, setFacing] = useState("back");
  // Variable que indica si se le asignan permisos a la camara
  const [permission, requestPermission] = useCameraPermissions();
  // Variable para indicar si se ha escaneado algo o no (booleana)
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />; // permisos aún cargando

  // Display de los permisos
  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos permisos para usar la cámara</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Dar permisos</Text>
        </TouchableOpacity>
      </View>
    );

  // metodo al que se llama cuando se ha escaneado un codigo
  // type: tipo del codigo
  // data: numeros
  const handleScan = ({ type, data }) => {
    // El if evita que se escanee el mismo codigo todo el rato 
    if (!scanned) {
      // se cambia el flag para el if
      setScanned(true);
      // onScan es basicamente la variable q se le pasaba a la funcion arriba del todo (variable para poder
      // pasarla al fichero de "scanAndSeach")
      onScan(data); // devolvemos el código escaneado
      console.log(`Código escaneado: ${data} (tipo: ${type})`);
    }
  };

  // Cambiar entre camaras del movil (trasera y delantera)
  const toggleCamera = () => {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}                              //Estilos para la camara
        facing={facing}                                    //Direccion de la camara, predeterminado "back"
        onCameraReady={() => console.log("Camera lista")}  //Cuando la camara esté lista imprime
        onBarcodeScanned={scanned ? undefined : handleScan}//Si se ha detectado un codigo de barras, llama a handleScan, sino scanned:undefined
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a", "qr"], // tipos de código que quieres detectar, ns cuales mas poner
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