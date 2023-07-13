import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, Pressable, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PubNubProvider, usePubNub } from 'pubnub-react';
import uuid from 'react-uuid';
import styles from '../../style';
import SingleQuestionResult from './SingleQuestionResult';
import { connectToPubnub } from '../../utils';
import GameOver from './GameOver';


const Game = ({ route, navigation }) => {

    const { currentUser, host, pin, questionsArr, userProfiles } = route.params
    console.log(route.params, "here")
    // Pubnub could probably be sent from lobby component in the future
    const pubnub = connectToPubnub(currentUser.id)

    return (
        <PubNubProvider client={pubnub}>
            <FunAndGames pin={pin} currentUser={currentUser} host={host} navigation={navigation} questionsArr={questionsArr} userProfiles={userProfiles} />
        </PubNubProvider>
    );
}
const FunAndGames = ({ pin, currentUser, host, navigation, questionsArr, userProfiles }) => {
    const pubnub = usePubNub();
    const [channels] = useState([pin]);


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
     * 
     * 
     * Instead of having a timer to switch between questions, we want it to depend whether all users have answered the question using pubnub messaging eventlistener. 
     */

    const [seconds, setSeconds] = useState(0) // set to any amount of seconds to load game here
    let secundo = 0

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
        }
    ]

    const testArrOfQ = [testQ1, testQ2, testQ1, testQ2]
    const [qIndex, setQIndex] = useState(0)
    const [activeQuestion, setActiveQuestion] = useState(questionsArr[qIndex].q)
    const [startGame, setStartGame] = useState(false)
    const [timeTillNextQuestion, setTimeTillNextQuestion] = useState(3) // change to amount of seconds to load results page
    const [answers, addAnswer] = useState([])
    const [chosenAnswer, setChosenAnswer] = useState('')
    const [showResultSingleQuestion, setShowResultSingleQuestion] = useState(false)
    const [gameFinished, setGameFinished] = useState(false)
    const [moveForward, setMoveForward] = useState(false)

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
    */
    /*
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

    const handleAnswer = event => {
        const answer = event.message;
        console.log(event.message, "bug here")
        if (answer && answer.type === 'answer') {
            const user = answer.text || answer;
            console.log(user, "usermuser")
            addAnswer(answers => [...answers, user]);
        } else if(answer && answer.type === 'nextQ'){
           setShowResultSingleQuestion(false)
           addAnswer([])
        } else {
            Alert.alert('Noget gik galt :/')
            console.log("something went wrong!?")
        }
    };

    const submitAnswer = (type, answer) => {
        if (answer) {
            const answ = {
                type: type,
                text: answer
            }
            setChosenAnswer(answer)
            pubnub.publish({ channel: channels[0], message: answ })
                .catch((err) => {
                    console.log(err, "rrrrrrr")
                })
        }
    };

    useEffect(() => {
        // might be a bug here try the console log under:
        console.log(answers.length, userProfiles.length)
        console.log(answers, "answerss")
        if (answers.length === userProfiles.length) {
            setShowResultSingleQuestion(true)
            setChosenAnswer('')
        }
    }, [answers])

    useEffect(() => {
        setActiveQuestion(questionsArr[qIndex].q)
    }, [qIndex])

    let secondsTillContinue = 3; // change to add loading

    useEffect(() => {
        let intervalID;

        if (startGame) {
            const displaySeconds = () => {
                secondsTillContinue--;
                console.log(secondsTillContinue)
                setTimeTillNextQuestion(secondsTillContinue);
            };
            intervalID = setInterval(displaySeconds, 1000);

            setTimeout(() => {
                clearInterval(intervalID);
                console.log('stopped counting next q now');
            }, 4000);

            if (timeTillNextQuestion === -1) {
                clearInterval(intervalID)
                console.log("cleared interval")
            }
        }
        return () => {
            clearInterval(intervalID);
        };
    }, [startGame])


    useEffect(() => {
        if (timeTillNextQuestion === 0 && !showResultSingleQuestion) {
            setShowResultSingleQuestion(true)
        }
    }, [timeTillNextQuestion])

    useEffect(() => {
        if (showResultSingleQuestion) {
            let newQ = qIndex + 1
            if (newQ === questionsArr.length) {
                setGameFinished(true)
                console.log('finished game')
            } else {
                console.log('not fini')
                setQIndex(newQ)
                setShowResultSingleQuestion(true)
            }
        }
    }, [showResultSingleQuestion])

    useEffect(() => {
        const messageListener = { message: handleAnswer }
        pubnub.addListener(messageListener);
        pubnub.subscribe({ channels });
        return () => {
            pubnub.removeListener(messageListener)
        }
    }, [pubnub /*channels*/]);

    useEffect(()=> {
        if(moveForward){
            const moveFwrd = {
                type: 'nextQ',
                text: 'moveFwrd'
            }
            pubnub.publish({ channel: channels[0], message: moveFwrd  })
            .catch((err) => {
                console.log(err, "rrrrrrr")
            })
            setMoveForward(false)
        }
    }, [moveForward])


    if (gameFinished && !showResultSingleQuestion) {
        pubnub.unsubscribe({ channels });
        return (
            <View><GameOver navigation={navigation}></GameOver></View>
        )
    }

    if (seconds > 0) {
        return (
            <View>
                <Text style={styles.game.loadingText}>Spillet start om:</Text>
                <Text style={styles.game.countdown}>{seconds}</Text>
            </View>
        )
    }

    return (
        <View>
            {showResultSingleQuestion ?
                <View>
                    <SingleQuestionResult
                        answers={answers}
                        lobby={userProfiles}
                        host={host}
                        setShowResultSingleQuestion={setShowResultSingleQuestion}
                        addAnswer={addAnswer}
                        setMoveForward={setMoveForward}
                    />
                </View>
                :
                <View>
                    <Text style={styles.game.playerName}>{timeTillNextQuestion}</Text>
                    <Text style={{ ...styles.game.loadingText, paddingBottom: '10%' }}>{activeQuestion}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 10, marginRight: 10 }}>
                        {chosenAnswer ? (
                            <View>
                                <Text>Du svarede:</Text>
                                <Text>{chosenAnswer}</Text>
                            </View>
                        ) :
                            userProfiles.map((contestant, index) => {
                                return (
                                    <View
                                        style={{
                                            width: '50%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        key={index}
                                    >
                                        <Pressable style={styles.game.options} onPress={() => !chosenAnswer && submitAnswer('answer', contestant.name)}>
                                            <Image
                                                source={{
                                                    uri:
                                                        'https://firebasestorage.googleapis.com/v0/b/thedrukspilapp.appspot.com/o/pictures%2Fusers%2FE9B41E47-12B4-4E32-9897-910D4DC36488.jpg?alt=media&token=58626f6c-80cb-4975-a535-9578ff2bfd1c',
                                                }}
                                                style={styles.game.img}
                                                key={contestant.img}
                                            />
                                            <Text key={contestant.name} style={styles.game.playerName}>{contestant.name}</Text>
                                        </Pressable>
                                    </View>
                                );
                            })}

                    </View>
                </View>
            }
        </View>


    );
}

export default Game