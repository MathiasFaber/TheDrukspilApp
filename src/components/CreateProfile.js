import React, { useState, useEffect } from 'react';
import { View, Pressable, ActivityIndicator, Text, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../../FirebaseConfig';

import styles from '../style';
import uuid from 'react-uuid';


const CreateProfile = ({ route, navigation }) => {
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [image, setImage] = useState([])
    const [name, setName] = useState('')
    const [currentUser, setCurrentUser] = useState({})

    const { pin, host } = route.params

    // Picks an image from the phone, to add to the advertisement
    const pickImage = async () => {
        let source = {}
        await ImagePicker.requestCameraPermissionsAsync()
        source = await ImagePicker.launchCameraAsync()
        if (source.canceled) {
            setLoading1(false)
            return
        }
        let fileName
        if (source.assets[0].fileName === null) {
            fileName = source.assets[0].uri.split("/").pop();
        } else {
            fileName = source.assets[0].fileName;
        }
        // Firebase does not support images with the ".heic" format. It is therefore converted to JPG in these cases.
        if (Platform.OS === 'ios' && (fileName?.endsWith('.heic') || fileName?.endsWith('.HEIC'))) {
            source.assets[0].fileName = `${fileName.split(".")[0]}.JPG`;
        }
        setImage([source.assets[0].uri, fileName]);
    };

    const saveUser = async () => {

        setLoading2(true)
        let user;
        /*
        if (image.length === 0) {
            Alert.alert('Noget gik galt :O', 'Tag et billede :D', [{ text: 'Oki!', onPress: () => setLoading2(false) }])
            return
        }
        */
        if (name.length < 1) {
            Alert.alert('Noget gik galt :O', 'Vælg et navn :D', [{ text: 'Oki!', onPress: () => setLoading2(false) }])
            return
        }

        const userId = uuid()

        await AsyncStorage.setItem(
            'currentUser',
            userId,
        )
/*
        const response = await fetch(image[0]);
        const blob = await response.blob();

        const ref = firebase.storage().ref().child(`pictures/users/${image[1]}`);
        const snapshot = await ref.put(blob);

        snapshot.ref.getDownloadURL().then((imgurl) => {
            user = {
                'id': userId,
                'name': name,
                'img': imgurl
            }
            firebase
                .database()
                .ref(`/users/${userId}`)
                .set(user)

                navigation.navigate('Lobby', { pin, currentUser: user, host: host })

        }).then(() => {
            setLoading2(false)
        }).catch((err) => {
            console.log(err)
        })
        */

        navigation.navigate('Lobby', { pin, currentUser: {id:userId}, host: host }) // this should be deleted and navigation should come from inside firebase call
    }

    return (
        <View>
            <Pressable style={{ paddingTop: 100 }} onPress={async () => {
                setLoading1(true)
                await pickImage()
                setLoading1(false)
            }}>
                {loading1 ? <ActivityIndicator color={'white'} style={styles.create.img}></ActivityIndicator> : image[0] ? <Image source={{ uri: image[0] }} style={styles.create.img} /> : <Image source={require('../../assets/userImage.png')} style={styles.create.img} />}
            </Pressable>
            <Text style={styles.create.txt}>Indtast spillernavn:</Text>
            <TextInput style={styles.create.input} onChangeText={(x) => setName(x)}></TextInput>
            <Pressable onPress={async () => {
                await saveUser()
            }} style={[styles.btn, { marginTop: 40 }]} >
                {loading2 ?
                    <ActivityIndicator size={'small'} color={'black'} />
                    :
                    <Text>Start spil</Text>
                }
            </Pressable>
        </View>
    )
}

export default CreateProfile