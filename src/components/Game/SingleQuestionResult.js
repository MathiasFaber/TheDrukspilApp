import React from 'react';
import { View, Pressable, Text, Image } from 'react-native';

import styles from '../../style';



function SingleQuestionResult({ answers, lobby, host, setShowResultSingleQuestion, addAnswer, setMoveForward }) {
    console.log(answers, "SQR")
    console.log(lobby, "lobby")

    const counter = {}
    answers.forEach(x => {
        if (counter[x]) {
            counter[x] += 1;
        } else {
            counter[x] = 1;
        }
    });

    console.log(counter, "counter")

    return (
        <View>
            <Text style={{ ...styles.sqr.text1, paddingBottom: 10 }}>Resultat:</Text>
            {lobby.map((x, index) => {
                if(!counter[x.name]){
                    console.log('no points:/')
                    return
                }
                return (
                    <View style={styles.sqr.container} key={index}>
                        <Image
                            source={{
                                uri:
                                    'https://firebasestorage.googleapis.com/v0/b/thedrukspilapp.appspot.com/o/pictures%2Fusers%2FE9B41E47-12B4-4E32-9897-910D4DC36488.jpg?alt=media&token=58626f6c-80cb-4975-a535-9578ff2bfd1c',
                            }}
                            style={styles.sqr.img}
                            key={x.img}
                        />
                        <Text style={styles.sqr.text} key={x.name}>{x.name}: {counter[x.name]} {counter[x.name] > 1 ? 'stemmer' : 'stemme'}</Text>
                    </View>
                )
            })}
            {host && (
                <Pressable style={styles.sqr.btn} onPress={() => {
                    setShowResultSingleQuestion(false)
                    addAnswer([])
                    setMoveForward(true)
                }}>
                    <Text style={styles.sqr.btn.txt}>Gå videre</Text>
                </Pressable>
            )}

        </View>
    );


}
export default SingleQuestionResult
