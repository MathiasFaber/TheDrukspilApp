import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';
import uuid from 'react-uuid';
import styles from '../style';

const Game = ({ route }) => {

    const { currentUser, host, pin } = route.params

    const pubnub = new PubNub({
        publishKey: 'pub-c-0a4c102e-d8c7-49ba-80fe-d13b3e6ddd5e',
        subscribeKey: 'sub-c-06546e42-6ace-4a92-ab1c-99b4886bf66f',
        uuid: currentUser?.id
    });

    return (
        <PubNubProvider client={pubnub}>
            <FunAndGames pin={pin} currentUser={currentUser} host={host} />
        </PubNubProvider>
    );
}
const FunAndGames = ({ pin, currentUser, host }) => {
    /**
     * return activityindicator untill all players are present
     * 
     * when all are present; start countdown from 3. 
     * 
     * when countdown is done, start w. first question
     * 
     * Questions should be fetched from firebase/questions
     * They should all be put in an array, and setInterval/setTimeout should be used to go over each question w. a delay. 
     * 
     * When all questions are done, return a "thanks for playing page", and send users to "welcome" page. 
     * 
     */

    const [seconds, setSeconds] = useState(5)
    let secundo = 5

    const testQ1 = {
        type: "neverHaveIEver",
        q: 'Jeg har aldrig spist en pizza'
    }
    const testQ2 = {
        type: "neverHaveIEver",
        q: 'Jeg har aldrig ingenting'
    }

    const testLobby = [
        {
            name: "Stor pik",
            img: "/Users/mathiasfaberkristiansen/Desktop/TheDrukspilApp.nosync/assets/userImage.png"
        },
        {
            name: "Yunuz",
            img: "/Users/mathiasfaberkristiansen/Desktop/TheDrukspilApp.nosync/assets/userImage.png"
        },
        {
            name: "Abraham Abdullah",
            img: "/Users/mathiasfaberkristiansen/Desktop/TheDrukspilApp.nosync/assets/userImage.png"
        }
    ]

    const testArrOfQ = [testQ1, testQ2, testQ1, testQ2]

    const [activeQuestion, setActiveQuestion] = useState('venter')
    const [startGame, setStartGame] = useState(false)
    const [timeTillNextQuestion, setTimeTillNextQuestion] = useState(3)
    /*
        useEffect(() => {
            let intervalID;
            const displaySeconds = () => {
                secundo--;
                setSeconds(secundo);
            };
            setTimeout(() => {
                clearInterval(intervalID);
                setStartGame(true);
                console.log('stopped counting');
            }, 5500);
            intervalID = setInterval(displaySeconds, 1000);
            return () => {
                setStartGame(false);
                setSeconds(5);
                clearInterval(intervalID);
            };
        }, [pin]);
    
        useEffect(() => {
            let intervalID;
            if (startGame) {
                setActiveQuestion(testArrOfQ[0].q + 'first question')
                console.log('startGame')
                const getNewQ = () => {
                    if (testArrOfQ.length > 1) {
                        const test = testArrOfQ.splice(1, 1)
                        console.log(testArrOfQ)
                        setActiveQuestion(test[0].q)
                    }
                };
                setTimeout(() => {
                    clearInterval(intervalID);
                    setStartGame(true);
                    console.log('stopped generating Q');
                }, 20000);
                intervalID = setInterval(getNewQ, 3000);
            } else {
                console.log('niks')
            }
            return () => {
                clearInterval(intervalID);
                setActiveQuestion('');
            };
        }, [startGame])
*/
        useEffect(()=> {
            // do some cool stuff count down till next question
        }, [seconds])
    
        /*
        if (seconds > 0) {
            return (
                <View>
                    <Text style={styles.game.loadingText}>Spillet start om:</Text>
                    <Text style={styles.game.countdown}>{seconds}</Text>
                </View>
            )
        }
    */
    return (
        <View>
            <Text style={styles.game.playerName}>{timeTillNextQuestion}</Text>
            <Text style={{ ...styles.game.loadingText, paddingBottom: '10%' }}>{activeQuestion}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 10, marginRight: 10 }}>
                {testLobby.map((contestant) => {
                    return (
                        <View
                            style={{
                                width: '50%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            key={contestant.name}
                        >
                            <Pressable style={styles.game.options}>
                                <Image
                                    source={{
                                        uri:
                                            'https://firebasestorage.googleapis.com/v0/b/thedrukspilapp.appspot.com/o/pictures%2Fusers%2FE9B41E47-12B4-4E32-9897-910D4DC36488.jpg?alt=media&token=58626f6c-80cb-4975-a535-9578ff2bfd1c',
                                    }}
                                    style={styles.game.img}
                                />
                                <Text style={styles.game.playerName}>{contestant.name}</Text>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export default Game