import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';
import uuid from 'react-uuid';

const Game = ({ route }) => {

    const { currentUser, host, pin } = route.params
    
    const pubnub = new PubNub({
        publishKey: 'pub-c-0a4c102e-d8c7-49ba-80fe-d13b3e6ddd5e',
        subscribeKey: 'sub-c-06546e42-6ace-4a92-ab1c-99b4886bf66f',
        uuid: currentUser?.id
    });

    return (
        <PubNubProvider client={pubnub}>
            <Chat pin={pin} currentUser={currentUser} host={host} />
        </PubNubProvider>
    );
}

const Chat = ({ pin, currentUser, host }) => {
    const pubnub = usePubNub();
    const [channels] = useState([pin]);
    const [messages, addMessage] = useState([]);
    const [message, setMessage] = useState('');
    const [currentChannel, setCurrentChannel] = useState('')
    const [count, setCount] = useState(0)
    const [ready, setReady] = useState(false)

    const handleMessage = event => {
        const message = event.message;
        if (typeof message === 'string' || message.hasOwnProperty('text')) {
            const text = message.text || message;
            addMessage(messages => [...messages, text]);
        }
    };

    const handlePresence = event => {
        console.log(event.action, currentUser.id)
        if (event.action === 'join' || event.action === 'leave') {
            setReady(true)
            setCount(event.occupancy)
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
        console.log(count)
    }, [count])

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

    return (
        <View style={{ marginTop: 50 }}>
            {host && <Text style={{ paddingTop: 25, fontWeight: 'bold', fontSize: 20, alignSelf: 'center', marginBottom: 25 }}>{'Jeg er host!!'}</Text>}
            {host && !ready ? <ActivityIndicator size={'small'}></ActivityIndicator>:<Text style={{ paddingTop: 25, fontWeight: 'bold', fontSize: 15, alignSelf: 'center', marginBottom: 25 }}>{`Der er ${count} spillere klar`}</Text>}

            <Text style={{ paddingTop: 25, fontWeight: 'bold', fontSize: 30, alignSelf: 'center', marginBottom: 25 }}>{pin}</Text>
            <Text style={{ paddingTop: 25, fontWeight: 'bold', fontSize: 10, alignSelf: 'center', marginBottom: 25 }}>{currentUser.id}</Text>

            {messages.map((message, index) => {
                return (
                    <Text key={index} style={{ alignSelf: 'center' }}>{message}</Text>
                );
            })}
            <TextInput style={{ borderColor: 'black', alignSelf: 'center', padding: 2, borderWidth: 2, width: '70%' }} value={message} onChangeText={setMessage} />
            <Button title="Send besked" onPress={() => sendMessage(message)} />
        </View>
    )
}

export default Game