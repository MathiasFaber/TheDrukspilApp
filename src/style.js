import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
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
        backgroundColor: 'lightblue',
        width: '80%',
        alignSelf: 'center',
        marginBottom: 10
    }
})

export default styles