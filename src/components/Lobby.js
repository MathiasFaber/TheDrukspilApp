import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, Image, Pressable, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";

import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';
import { firebase } from '../../FirebaseConfig';
import styles from '../style';
import { NavigationContainer } from '@react-navigation/native';



const Lobby = ({ route, navigation }) => {

    const { currentUser, host, pin } = route.params

    const pubnub = new PubNub({
        publishKey: 'pub-c-0a4c102e-d8c7-49ba-80fe-d13b3e6ddd5e',
        subscribeKey: 'sub-c-06546e42-6ace-4a92-ab1c-99b4886bf66f',
        uuid: currentUser.id
    });

    return (
        <PubNubProvider client={pubnub}>
            <GameLobby pin={pin} currentUser={currentUser} host={host} navigation={navigation} />
        </PubNubProvider>
    );
}

const GameLobby = ({ pin, currentUser, host, navigation }) => {
    const pubnub = usePubNub();
    const [channels] = useState([pin]);
    const [messages, addMessage] = useState([]);
    const [message, setMessage] = useState('');
    const [count, setCount] = useState(0)
    const [ready, setReady] = useState(false)
    const [occupants, setOccupants] = useState([])
    const [userProfiles, setUserProfiles] = useState([])

    const getUserProfiles = useCallback(async () => {
        try {
            const promises = occupants.map((x) => {
                return new Promise((resolve, reject) => {
                    firebase.database().ref(`/users/${x}`).on('value', snapshot => {
                        const value = snapshot.val();
                        resolve(value);
                    }, reject);
                });
            });

            const profiles = await Promise.all(promises);
            setUserProfiles(profiles);
        } catch (error) {
            console.log(error, "error");
        }
    }, [occupants]);

    const handleMessage = event => {
        const message = event.message;
        if (typeof message === 'string' || message.hasOwnProperty('text')) {
            const text = message.text || message;
            addMessage(messages => [...messages, text]);
        }
    };

    const updateLobby = async () => {
        let arrOfOccupants = []
        const hereNow = await pubnub.hereNow({
            channels: channels,
            includeUUIDs: true,
            includeState: true
        }).catch((error) => {
            console.log(error)
        })
        const test = Object.values(hereNow.channels)
        await test[0].occupants.map((x) => {
            arrOfOccupants.push(x.uuid)
            // not done, should add new uuid's on join. Right now it adds mulitple times the same and doesnt update on all devices. 
        })
        return arrOfOccupants
    }

    const handlePresence = async event => {
        console.log(event.action, currentUser.id)
        if (event.action === 'join' || event.action === 'leave') {
            const lobbyists = await updateLobby()
            setCount(event.occupancy)
            const update = async () => {
                const lobs = await updateLobby()
                setOccupants(lobs)
            }
            update()
            /*
            const interval = setInterval(() => {
                update()
            }, 2000);
            */

            return () => clearInterval(interval);
        }
    };

    const sendMessage = (message) => {
        if (message) {
            pubnub
                .publish({ channel: channels[0], message })
                .then(() => setMessage(''));
        }
    };

    useEffect(() => {
        console.log(JSON.stringify(userProfiles, null, 2))
    }, [userProfiles])

    useEffect(() => {
        console.log(occupants, "occupants on change occupants")
        const gup = async () => {
            await getUserProfiles()
            setReady(true)
        }
        console.log(userProfiles, "userprofile")
        gup()
    }, [occupants])

    useEffect(() => {
        const messageListener = { message: handleMessage }
        const userJoinListener = { presence: handlePresence }
        pubnub.addListener(messageListener);
        pubnub.addListener(userJoinListener);
        pubnub.subscribe({ channels, withPresence: true });
        pubnub.hereNow({
            channels: channels,
            includeUUIDs: true,
            includeState: true
        }).catch((error) => {
            console.log(error)
        });
        return () => {
            pubnub.unsubscribe({ channels })
            pubnub.removeListener(messageListener)
            pubnub.removeListener(userJoinListener)
        }
    }, [pubnub, channels]);

    const startGame = () => {
        console.log("start spillet manner")
        navigation.navigate('Game', { currentUser, host, pin })
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.lobby.view}
        >
            <Text style={styles.lobby.pin}>{pin}</Text>
            {userProfiles.length === 0 && <ActivityIndicator color={'white'}></ActivityIndicator>}
            <View style={styles.lobby.container}>
                {userProfiles.map((userProfile, index) => (
                    <View style={styles.lobby.imgContainer} key={index}>
                        <Image
                            source={{
                                uri:
                                    'https://firebasestorage.googleapis.com/v0/b/thedrukspilapp.appspot.com/o/pictures%2Fusers%2FE9B41E47-12B4-4E32-9897-910D4DC36488.jpg?alt=media&token=58626f6c-80cb-4975-a535-9578ff2bfd1c',
                            }}
                            style={styles.lobby.img}
                            key={userProfile.id}
                        />
                        <Text key={userProfile.name} style={styles.lobby.name}>
                            {userProfile.name}
                        </Text>
                    </View>
                ))}


            </View>
            {userProfiles.length < 1 ? <Pressable
                style={{ ...styles.btn, marginTop: 10, backgroundColor: '#649299' }}
            >
                <Text style={styles.btn.txt}>Venter på deltagere..</Text>
            </Pressable> :
                <Pressable
                    onPress={() => startGame()}
                    style={{ ...styles.btn, marginTop: 10 }}
                >
                    <Text style={styles.btn.txt}>Start spil!</Text>
                </Pressable>}
            {messages.map((message, index) => {
                return (
                    <Text key={`message-${index}`} style={{ alignSelf: 'center' }}>{message}</Text>
                );
            })}
            <View style={styles.lobby.inputContainer}>
                <TextInput
                    style={styles.lobby.input}
                    value={message}
                    onChangeText={setMessage}
                />
                <Pressable
                    onPress={() => sendMessage(message)}
                    style={styles.lobby.sendButton}
                >
                    <Ionicons name="paper-plane-outline" size={24} color="white" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

export default Lobby