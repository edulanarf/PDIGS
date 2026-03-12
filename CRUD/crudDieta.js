import {Text, View, Button } from 'react-native';

export function CrudDiet({navigation}){
        
    return(<View>
        <Button title="Create Diet" onPress={() => navigation.navigate("Creating Diet")}></Button>
        </View>
    );
}