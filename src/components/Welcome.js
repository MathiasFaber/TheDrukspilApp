import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, Alert } from 'react-native';
import uuid from 'react-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Game from './Game';
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

    /*
    useEffect(()=> {
        const checkForUser = async() => {
            setCurrentUser(await AsyncStorage.getItem('currentUser'))
        }
        checkForUser()
    })
    */


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

    return (
        <View style={{ paddingTop: 70 }}>
            {loading ? <View><Text style={{ alignSelf: 'center', paddingBottom: 10 }}>Loading</Text><ActivityIndicator size={'large'}></ActivityIndicator></View> :
                <View>
                    <Button title='Create Game' onPress={() => identifyUser()} />
                    <Text style={{ paddingTop: 20, alignSelf: 'center' }}>Game Pin:</Text>
                    <TextInput placeholder='Pin' style={{ alignSelf: 'center', borderWidth: 1, width: '50%' }} onChangeText={(e) => setPin(e)}></TextInput>
                    <Button title='Join Game' onPress={() => (pin?.length === 6) ? identifyUser() : Alert.alert("Koden er ikke gyldig")} />
                    {currentUser ? <Text style={{ alignSelf: 'center' }}>{currentUser}</Text> : null}
                    <Button title='Opret testbruger' onPress={() => hackTesting()} />
                    <Button title='Slet testbruger' onPress={() => deleteUserAsync()} />
                </View>
            }
        </View>
    );
}

export default Welcome
