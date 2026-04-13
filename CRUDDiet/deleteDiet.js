import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState } from "react";
import { db } from "../db/firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const uid = "Nn8A81GXWYdmdLVWkGYReqb5Kl92";

export function DeleteDiet(){

    const [dietas, setDietas] = useState([]);
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);

    const load = async () => {
        const snap = await getDocs(collection(db, `users/${uid}/dietas`));

        const lista = [];
        snap.forEach(d=>{
            lista.push({ id: d.id, ...d.data() });
        });

        setDietas(lista);
    };

    useEffect(()=>{
        load();
    },[]);

    const openModal = (diet) => {
        setSelected(diet);
        setVisible(true);
    };

    const closeModal = () => {
        setSelected(null);
        setVisible(false);
    };

    const remove = async () => {
        await deleteDoc(doc(db, `users/${uid}/dietas/${selected.id}`));
        closeModal();
        load();
    };

    return(
        <View style={{flex:1, padding:20, backgroundColor:"#000"}}>

            <Text style={{color:"#fff", fontSize:20, marginBottom:10}}>
                Eliminar dietas
            </Text>

            {/* LISTA */}
            {dietas.map(item=>(
                <TouchableOpacity
                    key={item.id}
                    onPress={()=>openModal(item)}
                    style={{
                        backgroundColor:"#ef4444",
                        padding:12,
                        marginBottom:10,
                        borderRadius:8
                    }}
                >
                    <Text style={{color:"#fff"}}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}

            {/* MODAL */}
            <Modal
                visible={visible}
                transparent
                animationType="fade"
            >
                <View style={{
                    flex:1,
                    backgroundColor:"rgba(0,0,0,0.7)",
                    justifyContent:"center",
                    alignItems:"center"
                }}>

                    <View style={{
                        backgroundColor:"#111",
                        padding:20,
                        borderRadius:10,
                        width:"80%"
                    }}>

                        <Text style={{color:"#fff", fontSize:18, marginBottom:10}}>
                            ¿Eliminar dieta?
                        </Text>

                        <Text style={{color:"#aaa", marginBottom:20}}>
                            {selected?.name}
                        </Text>

                        <TouchableOpacity
                            onPress={remove}
                            style={{
                                backgroundColor:"#ef4444",
                                padding:12,
                                borderRadius:8,
                                marginBottom:10
                            }}
                        >
                            <Text style={{color:"#fff", textAlign:"center"}}>
                                Eliminar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={closeModal}
                            style={{
                                backgroundColor:"#2563eb",
                                padding:12,
                                borderRadius:8
                            }}
                        >
                            <Text style={{color:"#fff", textAlign:"center"}}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>

        </View>
    );
}