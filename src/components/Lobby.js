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
        uuid: currentUser?.id
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
    const [questionsArr, setQuestionsArr] = useState([])

    const getUserProfiles = async () => {
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
            if (profiles.length > 0) {
                console.log(profiles, "profiles")
                setUserProfiles(profiles);
            }
        } catch (error) {
            console.log(error, "error");
        }
    };

    const handleMessage = event => {
        const message = event.message;
        if (message.type === 'start') {
            console.log('Start detected. Starting game')
            console.log(userProfiles, currentUser.id)

            const navigateToGame = async () => {
                await getQuestions(); // Fetch the questions before navigating
                await getUserProfiles(); // Fetch the user profiles before navigating
                setReady(true)
            };

            navigateToGame();
        }
        if (message.type === 'text') {
            const text = message.text;
            addMessage(messages => [...messages, text]);
        }
    };

    const updateLobby = async () => {
        try {
            const hereNow = await pubnub.hereNow({
                channels: channels,
                includeUUIDs: true,
                includeState: true
            });

            const test = Object.values(hereNow.channels);
            console.log(JSON.stringify(test[0].occupants, null, 2))
            const currentOccupants = test[0].occupants.map(x => x.uuid);
            return currentOccupants;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    useEffect(() => {
        console.log(userProfiles, "wtf dude");
        if (userProfiles.length > 0 && ready && questionsArr.length > 0) {
            console.log('ready and: ', userProfiles)
            navigation.navigate('Game', {
                currentUser,
                host,
                pin,
                questionsArr,
                userProfiles
            });
        }
    }, [userProfiles, ready, questionsArr]);

    const handlePresence = async event => {
        console.log(event.action, currentUser.id)
        if (event.action === 'join' || event.action === 'leave') {
            setCount(event.occupancy)
            const update = async () => {
                const lobs = await updateLobby()
                console.log(lobs, "test")
                setOccupants(lobs)
            }
            update()
        }
    };

    const sendMessage = (type, msg) => {
        if (msg) {
            const message = {
                type: type,
                text: msg
            }
            console.log(userProfiles, "lol")
            pubnub
                .publish({ channel: channels[0], message })
                .then(() => setMessage(''));
        }
    };

    const getQuestions = useCallback(async () => {
        try {
            const snapshot = await firebase.database().ref('/questions').once('value');
            const questionsObject = snapshot.val();
            const questionsArray = Object.values(questionsObject);
            console.log(questionsArray)
            setQuestionsArr(questionsArray);
        } catch (err) {
            console.log(err, 1232323)
        }
    })

    useEffect(() => {
        getQuestions()
    }, [])

    useEffect(() => {
        const gup = async () => {
            await getUserProfiles()
        }
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
        sendMessage('start', 'start')
        //navigation.navigate('Game', { currentUser, host, pin, questionsArr, userProfiles })
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
                host ?
                    <Pressable
                        onPress={() => startGame()}
                        style={{ ...styles.btn, marginTop: 10 }}
                    >
                        <Text style={styles.btn.txt}>Start spil!</Text>
                    </Pressable> : <Pressable
                        style={{ ...styles.btn, marginTop: 10, backgroundColor: '#649299' }}
                    >
                        <Text style={styles.btn.txt}>Venter på start...</Text>
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
                    onPress={() => sendMessage('text', message)}
                    style={styles.lobby.sendButton}
                >
                    <Ionicons name="paper-plane-outline" size={24} color="white" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

export default Lobby