import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    welcome: {
        input: {
            borderColor: 'black',
            alignSelf: 'center',
            borderWidth: 1,
            height: 35,
            borderRadius: 10,
            paddingHorizontal: 10,
            width: '80%',
            backgroundColor: '#f2f2f2',
            textAlign: 'center'
        },
        gamePin: {
            paddingTop: 15,
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center',
            marginBottom: 5,
            color: 'white',
            marginTop: 25
        },
        img: {
            height: 160,
            width: 208,
            alignSelf: 'center'
        },
        headline: {
            alignSelf: 'center',
            color: 'white',
            fontSize: 25,
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 20
        }
    },
    create: {
        img: {
            width: 170,
            height: 170,
            alignSelf: "center",
            margin: 10,
            borderRadius: 2000 / 2,
            borderWidth: 1,
        },
        input: {
            borderWidth: 1,
            width: '70%',
            alignSelf: 'center',
            borderRadius: 2000 / 2,
            marginBottom: 10,
            height: 35,
            textAlign: 'center',
            fontSize: 20,
        },
        txt: {
            alignSelf: 'center',
            fontWeight: 'bold',
            fontSize: 15,
            paddingTop: 25,
            paddingBottom: 5
        }
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: '#13B5CD',
        width: '80%',
        alignSelf: 'center',
        marginBottom: 10,
        txt: {
            alignSelf: 'center',
            fontWeight: 'bold',
            fontSize: 15,
            color: 'white'
        }
    },
    lobby: {
        view: {
            height: "100%",
            backgroundColor: "#2D91A0",
            flex: 1,
            behavior: 'padding'

        },
        pin: {
            paddingTop: 25,
            fontSize: 60,
            fontWeight: 'bold',
            alignSelf: 'center',
            marginBottom: 25,
            color: 'white'
        },
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start', // Align items to the top
            marginTop: 20,
        },
        imgContainer: {
            width: '33%', // Display four images per row
            aspectRatio: 1, // Maintain aspect ratio of the images
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
        },
        img: {
            width: '90%', // Adjust the size of the images
            aspectRatio: 1, // Maintain aspect ratio of the images
            borderRadius: 100,
        },
        name: {
            textAlign: 'center',
            marginTop: 5,
            fontWeight: 'bold',
            alignSelf: 'center',
            marginBottom: 25,
            color: 'white'
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: '45%',
        },
        input: {
            borderColor: 'black',
            alignSelf: 'center',
            borderWidth: 1,
            height: 35,
            borderRadius: 10,
            paddingHorizontal: 10,
            width: '80%',
            backgroundColor: '#f2f2f2',
            marginRight: 7,
            marginLeft: 15,
        },
        sendButton: {
            width: 45,
            height: 45,
            borderRadius: 22.5,
            backgroundColor: '#3498db',
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
    game: {
        loadingText: {
            color: 'white',
            alignSelf: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: '10%'
        },
        activityIndicator: {
            alignSelf: 'center',
            marginTop: "10%"
        },
        countdown: {
            color: 'white',
            alignSelf: 'center',
            fontSize: 200,
            fontWeight: 'bold',
            marginTop: '2%'
        },
        options: {
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: '#13B5CD',
            marginBottom: 10,
            width: '95%',
        },
        img: {
            width: '85%', // Adjust the size of the images
            aspectRatio: 1, // Maintain aspect ratio of the images
            borderRadius: 200,
            marginTop: 10,
            marginBottom: 10,
        },
        playerName: {
            fontSize: 17,
            fontWeight: 'bold',
            alignSelf: 'center',
            color: 'white',
            marginBottom: '5%'
        }
    },
    sqr: {
        text1: {
            alignSelf: 'center',
            paddingBottom: 5,
            fontWeight: 'bold',
            fontSize: 15,
            paddingTop: 25,
            paddingBottom: 5,
            color: 'white',
        },
        container: {
            display: 'flex',
            flexDirection: 'row',
            marginTop: 30,
            width: '80%',
            alignSelf: 'center'
        },
        text: {
            alignSelf: 'center',
            paddingBottom: 5,
            fontWeight: 'bold',
            fontSize: 15,
            paddingTop: 25,
            paddingBottom: 5,
            color: 'white',
            flex: 1,
        },
        img: {
            aspectRatio: 1,
            borderRadius: 100,
            flex: 1,
            width: 1,
            marginRight: 10
        },
        btn: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 20,
            elevation: 3,
            backgroundColor: '#13B5CD',
            width: '80%',
            alignSelf: 'center',
            marginBottom: 10,
            marginTop: 10,
            txt: {
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 15,
                color: 'white'
            }
        },
    },
    gameover: {
        txt: {
            alignSelf: 'center',
            fontSize: 40,
            color: 'white',
            fontWeight: 'bold',
            height: '40%',
            marginTop: '50%',
            alignItems: 'center'
        }
    }
})

export default styles