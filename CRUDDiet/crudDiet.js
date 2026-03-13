import { useEffect, useState } from 'react';
import {Text, View, Button } from 'react-native';
import { auth,db } from '../db/firebase';
import { getDoc, getDocs, collection } from 'firebase/firestore';

export function CrudDiet({navigation}){

    const [diets, setDiets] = useState([]);

    //READ
    useEffect(() => {
        const loadDiets = async ()=>{
            const user = auth.currentUser
            if(!user){
                return
            }
            const querySnapshot = await getDocs(collection(db,"users",user.uid,"dietas"));

            const dietsList = []
            
            querySnapshot.forEach((doc) => {
                    dietsList.push({
                    id: doc.id,
                    ...doc.data()
                });
            })

            setDiets(dietsList)
        }
        loadDiets()

    }, []); 
        
    return(<View>
        <Text>MY DIETS</Text>
            {diets.map((diet) => (
                <Button
                title={diet.id}
                onPress={() => console.log("Dieta seleccionada:", diet.id)}
            />
            ))}
        <Button title="Create Diet" onPress={() => navigation.navigate("Creating Diet")}></Button>
        </View>
    );
}