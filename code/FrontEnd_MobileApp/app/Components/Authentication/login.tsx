import axios from 'axios';
import { Link, router } from 'expo-router';
import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native'

const Login:React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    
    const handleRegister = async () => {
        if (password == '' || email == "") {
            alert("Fill the feilds");
            return;
        }
        
        try {
            const response = await axios.post("http://localhost:8080/api/v1/auth/user/login", {email, password});
            console.log(response.data);
            localStorage.setItem("token", response.data);
            router.push("/Components/Home/Home");
        } catch (error: any) {
            console.log(error.response.data.message);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.form}>
                    <TextInput style={styles.inputs} placeholder='Email' placeholderTextColor="rgb(173, 173, 173)" value={email} onChangeText={(value) => setEmail(value)}/>
                    <TextInput style={styles.inputs} placeholder='Password' placeholderTextColor="rgb(173, 173, 173)" value={password} onChangeText={(value) => setPassword(value)}/>
                    <Pressable onPress={handleRegister} style={styles.login}>
                        <Text style={styles.text}>LOGIN</Text>
                    </Pressable>
                </View>
                <Text style={styles.already}>Dont have an account?</Text>
                <Link style={styles.register} href={"/Components/Authentication/register"}>REGISTER</Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,
        backgroundColor: 'rgb(4, 38, 28)',
    },
    formContainer: {
        width: '80%',
        borderWidth: 2,
        borderColor: "rgb(21, 147, 101)",
        borderRadius: 10,
        padding: 10,
        backgroundColor:"rgb(1, 105, 77)",
    },
    title: {
        textAlign: "center",
        fontSize: 30,
        marginBottom: 20,
        color: 'rgb(232, 232, 232)',
    },
    form: {
    },
    inputs: {
        borderWidth: 1,
        borderColor: "rgba(4, 38, 28, 0.5)",
        borderRadius: 5,
        textAlign: "center",
        marginBottom: 14,
        padding: 10,
        color: "#F6FCDF",
        fontSize: 16,
        width: "100%",
    },
    already: {
        marginTop: 20,
        textAlign: "center",
        marginBottom: 10,
        color: "#F6FCDF",
    },
    register: {
        backgroundColor: "#1A1A19",
        padding: 10,
        textAlign:'center',
        color: "#F6FCDF",
        borderRadius: 5,
    },
    login: {
        backgroundColor: "#F6FCDF",
        textAlign: "center",
        padding: 10,
        marginTop: 3,
        borderRadius: 5,
    },
    text: {
        fontWeight:"bold",
        textAlign: "center"
    }
}) 

export default Login