import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { db } from "../db/firebase.js";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const uid = "Nn8A81GXWYdmdLVWkGYReqb5Kl92";

export function EditDiet(){

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

    const save = async () => {
        await updateDoc(
            doc(db, `users/${uid}/dietas/${selected.id}`),
            selected
        );

        load();
        setSelected(null);
    };

    useEffect(()=>{
        load();
    },[]);

    return(
        <View style={{flex:1, padding:20, backgroundColor:"#000"}}>

            <Text style={{color:"#fff", fontSize:20}}>
                Editar dietas
            </Text>

            {!selected ? (

                dietas.map(item=>(
                    <TouchableOpacity
                        key={item.id}
                        onPress={()=>setSelected(item)}
                        style={{
                            backgroundColor:"#2563eb",
                            padding:10,
                            marginTop:10,
                            borderRadius:8
                        }}
                    >
                        <Text style={{color:"#fff"}}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))

            ) : (

                <View>

                    <TextInput
                        style={{backgroundColor:"#1e3a8a", color:"#fff", padding:10, marginTop:10}}
                        value={selected.name}
                        onChangeText={(t)=>setSelected({...selected, name:t})}
                    />

                    <TextInput
                        style={{backgroundColor:"#1e3a8a", color:"#fff", padding:10, marginTop:10}}
                        value={String(selected.calorias)}
                        onChangeText={(t)=>setSelected({...selected, calorias:Number(t)})}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity
                        onPress={save}
                        style={{
                            backgroundColor:"#22c55e",
                            padding:12,
                            marginTop:20,
                            borderRadius:8
                        }}
                    >
                        <Text style={{color:"#fff"}}>
                            Guardar cambios
                        </Text>
                    </TouchableOpacity>

                </View>

            )}

        </View>
    );
}