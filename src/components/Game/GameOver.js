import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Pressable, Text, ActivityIndicator, Alert, Image } from 'react-native';
import uuid from 'react-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../style';
import { firebase } from '../../../FirebaseConfig';
import { usePubNub, PubNubProvider } from 'pubnub-react';
import { connectToPubnub } from '../../utils';


function GameOver({navigation}) {
    return (
        <View>
            <Text style={styles.gameover.txt}>Game Over</Text>
            <Pressable style={styles.game.options} onPress={() => navigation.navigate('Welcome')}>
                <Text style={styles.game.playerName}>En gang til?</Text>
            </Pressable>
        </View>
    );


}
export default GameOver;
