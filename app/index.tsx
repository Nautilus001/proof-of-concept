import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from "../FirebaseConfig";

const index = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user) router.replace('/(tabs)/home');
        } catch (error: any){
            console.log(error);
            alert('Sign-in failed: ' + error.message);
        }
    }

    const signUp = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            if (user) router.replace('/(tabs)/home');
        } catch (error: any){
            console.log(error);
            alert('Sign-in failed: ' + error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor="#aaa"
            value={email} 
            onChangeText={setEmail}
            autoCapitalize="none"
            />
            <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#aaa"
            value={password} 
            onChangeText={setPassword}
            secureTextEntry // Hides the password
            />

            <TouchableOpacity style={styles.buttonPrimary} onPress={signIn}>
            <Text style={styles.buttonPrimaryText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={signUp}>
            <Text style={styles.buttonSecondaryText}>Create Account</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondary: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default index;