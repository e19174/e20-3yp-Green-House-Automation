import { Link, router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import { userAuth } from '../../Contexts/UserContext';
import { Axios } from '../../app/AxiosRequestBuilder';
import { themeAuth } from '../../Contexts/ThemeContext';
import { get, save } from '../../Storage/secureStorage';
// import * as WebBrowser from 'expo-web-browser'
// import * as AuthSession from 'expo-auth-session'
// import { useAuth, useSSO, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';

// export const useWarmUpBrowser = () => {
// useEffect(() => {
//   // Preloads the browser for Android devices to reduce authentication load time
//   // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
//   void WebBrowser.warmUpAsync()
//   return () => {
//     // Cleanup: closes browser when component unmounts
//     void WebBrowser.coolDownAsync()
// }
// }, [])
// }
// WebBrowser.maybeCompleteAuthSession()

const Login:React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {setUser} = userAuth();
    // const {user} = useUser();
    // const {isSignedIn, signOut} = useAuth();
    const {theme} = themeAuth();
    const [checkingToken, setCheckingToken] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const checkToken = async () => {
                const token = await get("token");
                // if (token && isActive && isSignedIn) {
                if (token && isActive) {
                    router.replace("/Components/Home/Home");
                } else {
                    setCheckingToken(false);
                }
            };
            checkToken();
            return () => { isActive = false; };
        }, [])
    );

    // useWarmUpBrowser()

    // // Use the `useSSO()` hook to access the `startSSOFlow()` method
    // const { startSSOFlow } = useSSO()

    // const onPress = useCallback(async () => {
    // try {
    //     // Start the authentication process by calling `startSSOFlow()`
    //     const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
    //     strategy: 'oauth_google',
    //     // For web, defaults to current path
    //     // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
    //     // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
    //     redirectUrl: AuthSession.makeRedirectUri({ scheme: 'myapp', path: '/' }),
    //     })

    //     // If sign in was successful, set the active session
    //     if (createdSessionId) {
    //       setActive!({ session: createdSessionId });
    //     } else {
    //     // If there is no `createdSessionId`,
    //     // there are missing requirements, such as MFA
    //     // Use the `signIn` or `signUp` returned from `startSSOFlow`
    //     // to handle next steps
    //       Alert.alert('Sign in or sign up is required to complete the authentication process.');
    //     }
    // } catch (err) {
    //     // See https://clerk.com/docs/custom-flows/error-handling
    //     // for more info on error handling
    //     console.error(JSON.stringify(err, null, 2))
    // }
    // }, [])


    // useEffect(() => {
    // if (isSignedIn) {
    //   handleGoogleSignIn();
    // } else {
    //     console.log('No user is signed in')
    // }
    // }, [signOut, isSignedIn, user])

    // const handleGoogleSignIn = async () => {
    // try {
    //     // After successful Clerk Google sign-in
    //     const googleAuthData = {
    //     email: user?.primaryEmailAddress?.emailAddress,
    //     name: user?.fullName,
    //     profileImage: user?.imageUrl,
    //     clerkUserId: user?.id
    //     };
        
    //     const response = await Axios.post("auth/user/google-auth", googleAuthData);
    //     console.log('Google Sign-In Response:', response.data);
    //     if (response.data.action === 'REGISTERED') {
    //         // New user registered via Google
    //         Alert.alert('Welcome! Your account has been created.');
    //     } else {
    //         // Existing user logged in
    //         Alert.alert('Welcome back!');
    //     }
    //     setUser(response.data.data.user);  
    //     await save("token", response.data.data.token);
    //     router.replace("/Components/Home/Home");
    // } catch (error) {
    //     Alert.alert('Error', 'Failed to sign in with Google. Please try again.')
    //     console.error('Google Sign-In Error:', error);
    // }}
    
    const handleLogin = async () => {
        if (password == '' || email == "") {
            alert("Fill the fields");
            return;
        }
        
        try {
            const response = await Axios.post("/auth/user/login", {email, password});
            await save("token", response.data.token);
            router.replace("/Components/Home/Home");
            setUser(response.data.user);
        } catch (error: any) {
            console.log(error);
        }
    }

    if (checkingToken) {
        return (
            <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
                <ActivityIndicator size="large" color={theme.dark ? "#fff" : "#01694D"} />
            </View>
        );
    }

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <View style={[styles.formContainer, {backgroundColor: theme.colors.primary}]}>
                <Text style={[styles.title, {color: theme.colors.text}]}>Login</Text>
                <View style={styles.form}>
                    <TextInput style={[styles.inputs, {color: theme.colors.text}]} placeholder='Email' placeholderTextColor="rgb(173, 173, 173)" value={email} onChangeText={(value) => setEmail(value.trim())}/>
                    <TextInput style={[styles.inputs, {color: theme.colors.text}]} placeholder='Password' placeholderTextColor="rgb(173, 173, 173)" value={password} onChangeText={(value) => setPassword(value.trim())}/>
                    <TouchableOpacity onPress={handleLogin} style={styles.login}>
                        <Text style={styles.text}>LOGIN</Text>
                    </TouchableOpacity>
                    {/* <Text style={styles.OR}>OR</Text>
                    <TouchableOpacity style={styles.googleLogin}>
                        <Ionicons name="logo-google" size={18} color="black" />
                        <Text onPress={onPress} style={styles.googleLoginText}>Sign in with Google</Text>
                    </TouchableOpacity> */}
                </View>
                <Text style={styles.already}>Dont have an account?</Text>
                <Link style={styles.register} href={"/Authentication/register"}>REGISTER</Link>
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
        // color: "#F6FCDF",
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
    },
        googleLoginText : {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15
    },
    googleLogin : {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
        padding: 10,
        backgroundColor: "#F6FCDF",
        borderRadius: 5,
    },
    OR: {
        textAlign: "center",
        fontSize: 18,
        marginTop: 10,
        color: "#F6FCDF",
    }
}) 

export default Login