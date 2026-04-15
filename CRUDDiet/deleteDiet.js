import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { db, auth } from "../db/firebase.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const BLUE = "#185FA5";
const BLUE_LIGHT = "#E6F1FB";
const BLUE_MID = "#378ADD";

export function DeleteDiet() {

    const uid = auth.currentUser?.uid;

    const [dietas, setDietas] = useState([]);
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);

    const load = async () => {
        if (!uid) return;

        const snap = await getDocs(collection(db, `users/${uid}/dietas`));

        const lista = [];
        snap.forEach(d => {
            lista.push({ id: d.id, ...d.data() });
        });

        setDietas(lista);
    };

    useEffect(() => {
        load();
    }, []);

    const openModal = (diet) => {
        setSelected(diet);
        setVisible(true);
    };

    const closeModal = () => {
        setSelected(null);
        setVisible(false);
    };

    const remove = async () => {
        if (!uid || !selected) return;

        await deleteDoc(doc(db, `users/${uid}/dietas/${selected.id}`));
        closeModal();
        load();
    };

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <Text style={styles.eyebrow}>Nutrition system</Text>
            <Text style={styles.title}>Delete diets</Text>
            <Text style={styles.subtitle}>Tap a diet to remove it</Text>

            {/* LISTA */}
            {dietas.map(item => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => openModal(item)}
                    style={styles.card}
                >
                    <Text style={styles.cardTitle}>
                        {item.name}
                    </Text>

                    <Text style={styles.cardSub}>
                        {item.calorias} kcal • {item.objetivo}
                    </Text>
                </TouchableOpacity>
            ))}

            {/* MODAL */}
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.modalOverlay}>

                    <View style={styles.modalBox}>

                        <Text style={styles.modalTitle}>
                            Delete diet?
                        </Text>

                        <Text style={styles.modalText}>
                            {selected?.name}
                        </Text>

                        <TouchableOpacity
                            onPress={remove}
                            style={styles.deleteBtn}
                        >
                            <Text style={styles.deleteText}>
                                Delete
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={closeModal}
                            style={styles.cancelBtn}
                        >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 20
    },

    eyebrow: {
        fontSize: 11,
        fontWeight: "600",
        color: BLUE_MID,
        letterSpacing: 0.9,
        textTransform: "uppercase"
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginTop: 4
    },

    subtitle: {
        fontSize: 14,
        color: "#888",
        marginBottom: 20
    },

    card: {
        backgroundColor: BLUE_LIGHT,
        borderWidth: 1,
        borderColor: "#B5D4F4",
        padding: 14,
        borderRadius: 14,
        marginBottom: 12
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: BLUE
    },

    cardSub: {
        marginTop: 4,
        fontSize: 12,
        color: "#666"
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center"
    },

    modalBox: {
        backgroundColor: "#FFF",
        width: "80%",
        borderRadius: 14,
        padding: 20
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10
    },

    modalText: {
        color: "#666",
        marginBottom: 20
    },

    deleteBtn: {
        backgroundColor: "#ef4444",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10
    },

    deleteText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "700"
    },

    cancelBtn: {
        backgroundColor: BLUE,
        padding: 12,
        borderRadius: 10
    },

    cancelText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "700"
    }

});