import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Pressable, Text, ActivityIndicator, Alert, Image } from 'react-native';
import uuid from 'react-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../style';
import { firebase } from '../../FirebaseConfig';
// this works, connecting to devices. Now try, instead of awesome channel, pass in an id from a "login" page, which will be the channel, so that multiple channels can be used at the same time. 

function Welcome({ navigation }) {
    const [joinGame, setJoinGame] = useState(false)
    const [createGame, setCreateGame] = useState(false)
    const [pin, setPin] = useState(null)
    const [currentUser, setCurrentUser] = useState()
    const [userProfile, setUserProfile] = useState({})
    const [loading, setLoading] = useState(false)
    const [idUser, setIdUser] = useState(false)


    useEffect(() => {
        const checkForUser = async () => {
            setCurrentUser(await AsyncStorage.getItem('currentUser'))
        }
        checkForUser()
    })


    useEffect(() => {
        const randomPin = Math.floor(100000 + Math.random() * 900000)
        const findCurrentUser = async (userId) => {
            try {
                firebase
                    .database()
                    .ref(`/users/${userId}`)
                    .on('value', snapshot => {
                        const user = snapshot.val()
                        console.log(user, "user??")
                        if (user !== null) {
                            console.log(user, "hejsa")
                            navigation.navigate('Lobby', { pin: pin || randomPin, currentUser: user, host: pin ? false : true })
                            setPin(null)
                            setLoading(false)
                        } else {
                            navigation.navigate('CreateProfile', { pin: pin || randomPin, host: pin ? false : true })
                            setLoading(false)
                        }
                    })
            } catch (err) {
                console.log(err, 1232323)
            }
        }

        const setAsyncStorage = async () => {
            //const delet = await AsyncStorage.removeItem('currentUser')

            const user = await AsyncStorage.getItem('currentUser')
            //const user = {"user": "test"}
            //const user = currentUser
            console.log(user, "user1")
            if (!user) {
                navigation.navigate('CreateProfile', { pin: pin || randomPin, host: pin ? false : true })
                setLoading(false)
            } else if (user) {
                await findCurrentUser(user)
            } else {
                console.log('wtf something very wrong')
            }
        }
        if (idUser) {
            setAsyncStorage()
            console.log("we here")
            setIdUser(!idUser)
        }
    }, [idUser])

    const identifyUser = async () => {
        setLoading(true)
        setIdUser(true)
    }

    const hackTesting = async () => {
        const thisGuy = uuid()
        await AsyncStorage.setItem('currentUser', thisGuy)
        firebase
            .database()
            .ref(`/users/${thisGuy}`)
            .set({ 'id': thisGuy })
        setCurrentUser(thisGuy)
        console.log(thisGuy, "hacktesting")
    }

    const deleteUserAsync = async () => {
        await AsyncStorage.removeItem('currentUser')
    }

    const useTestUser = async (user) => {
        if (user === 1) {
            await AsyncStorage.setItem('currentUser', '48d8991d-a45c-e296-b335-0d099e26f466')
            setCurrentUser('48d8991d-a45c-e296-b335-0d099e26f466')
        } else {
            await AsyncStorage.setItem('currentUser', '55a129be-b4ee-dfcd-6bd1-e2c8bde1f1e1')
            setCurrentUser('55a129be-b4ee-dfcd-6bd1-e2c8bde1f1e1')
        }

    }

    return (
        <View style={{ paddingTop: 20 }}>
            <Image
                source={require('../../assets/logo.png')}
                style={styles.welcome.img}
                key={userProfile.id}
            />
            <Text style={styles.welcome.headline}>Dit yndlings drukspil</Text>
            {currentUser & !loading ? <Text style={{ alignSelf: 'center' }}>{currentUser}</Text> : null}
            {loading ? <View><Text style={styles.welcome.gamePin}>Gør spillet klar...</Text><ActivityIndicator color={'white'} size={'large'}></ActivityIndicator></View> :
                <View>
                    <Pressable
                        onPress={() => identifyUser()}
                        style={{ ...styles.btn, marginTop: 10 }}
                    >
                        <Text style={styles.btn.txt}>Opret spil</Text>
                    </Pressable>
                    <Text style={styles.welcome.gamePin}>Pinkode:</Text>
                    <TextInput placeholder='123456' style={styles.welcome.input} onChangeText={(e) => setPin(e)}></TextInput>

                    <Pressable
                        onPress={() => (pin?.length === 6) ? identifyUser() : Alert.alert("Koden er ikke gyldig")}
                        style={{ ...styles.btn, marginTop: 10 }}
                    >
                        <Text style={styles.btn.txt}>Join spil</Text>
                    </Pressable>
                    <Button title='Skip til game' onPress={() => navigation.navigate('Game', {currentUser: { id: '48d8991d-a45c-e296-b335-0d099e26f466'}, host:  true, pin: '123456'})} />
                    <Button title='Opret testbruger' onPress={() => hackTesting()} />
                    <Button title='Slet testbruger' onPress={() => deleteUserAsync()} />
                    <Button title='Skip login, use test user 1' onPress={() => useTestUser(1)} />
                    <Button title='Skip login, use test user 2' onPress={() => useTestUser(2)} />

                </View>
            }
        </View>
    );
}

export default Welcome
