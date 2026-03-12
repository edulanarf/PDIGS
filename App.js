import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { FoodAPIBarcode} from './api/foodAPI.js';
import{SearchFood } from './db/searchFood.js';

export default function App() {

  return (
    <View style={styles.container}>
      <FoodAPIBarcode/>
       <SearchFood/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
