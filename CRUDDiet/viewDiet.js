import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { db } from "../db/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const uid = "Nn8A81GXWYdmdLVWkGYReqb5Kl92";

export function ViewDiet(){

    const [dietas, setDietas] = useState([]);
    const [selected, setSelected] = useState(null);

    const load = async () => {
        const snap = await getDocs(collection(db, `users/${uid}/dietas`));

        const lista = [];
        snap.forEach(doc=>{
            lista.push({ id: doc.id, ...doc.data() });
        });

        setDietas(lista);
    };

    useEffect(()=>{
        load();
    },[]);

    return(
        <View style={{flex:1, padding:20, backgroundColor:"#000"}}>

            <Text style={{color:"#fff", fontSize:20, marginBottom:10}}>
                Tus dietas
            </Text>

            {/* BOTONES DE DIETAS */}
            <FlatList
                data={dietas}
                keyExtractor={(item)=>item.id}
                renderItem={({item})=>(
                    <TouchableOpacity
                        onPress={()=>setSelected(item)}
                        style={{
                            backgroundColor:"#2563eb",
                            padding:10,
                            marginBottom:10,
                            borderRadius:8
                        }}
                    >
                        <Text style={{color:"#fff"}}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* DETALLE */}
            {selected && (
                <View style={{marginTop:20}}>
                    <Text style={{color:"#fff"}}>
                        Calorías: {selected.calorias}
                    </Text>
                    <Text style={{color:"#fff"}}>
                        Proteínas: {selected.proteinas}
                    </Text>
                    <Text style={{color:"#fff"}}>
                        Objetivo: {selected.objetivo}
                    </Text>
                </View>
            )}

        </View>
    );
}