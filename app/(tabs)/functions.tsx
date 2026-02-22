import {Text, View} from '@/components/Themed'; // Added View from your Themed components
import {getFunctions, httpsCallable} from 'firebase/functions';
import {useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {app} from '../../FirebaseConfig';

export default function FunctionsScreen() {
  const [functionResult, setFunctionResult] = useState('');
  const [loading, setLoading] = useState(false);

  const callHWF = async () => {
    setLoading(true);
    const functions = getFunctions(app, 'us-central1');
    const helloWorld = httpsCallable(functions, 'helloWorld');
    try {
      const result: any = await helloWorld();
      setFunctionResult(result.data.message);
    } catch (error: any) {
      console.error("Error while calling hello world: ", error);
      Alert.alert("Oops", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Functions View</Text>
        <View style={styles.separator} />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Server Response:</Text>
        <Text style={styles.resultText}>
          {functionResult || "No data fetched yet..."}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={callHWF}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Call Hello World Function</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes content apart
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  separator: {
    marginVertical: 15,
    height: 2,
    width: 40,
    backgroundColor: '#2f95dc', // Brand accent color
    borderRadius: 1,
  },
  resultContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#1c1c1e', // Slightly lighter than pure black
    borderWidth: 1,
    borderColor: '#333',
  },
  resultLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'SpaceMono', // Common in Expo starters, fallback to system
  },
  button: {
    backgroundColor: '#2f95dc',
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2f95dc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#555',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});