import { useState } from "react";
import { View } from "react-native";
import { BarcodeScanner } from "./barcodeScanner.js";
import { FoodAPIBarcode } from "./foodAPI";


export function ScanAndSearch() {
  const [barcode, setBarcode] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      {!barcode ? (
        // Mostrar la cámara hasta que se escanee
        <BarcodeScanner onScan={setBarcode} />
      ) : (
        // Mostrar la info del producto
        <FoodAPIBarcode barcode={barcode} />
      )}
    </View>
  );
}