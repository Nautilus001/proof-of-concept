import { getAuth } from '@firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';

export default function DatabaseScreen() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<any>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const todosCollection = collection(db, 'todos');

  useEffect (() => {
    fetchTodos();
  }, [user]);
  
  const createTodo = async () => {
    if (user) {
      await addDoc(todosCollection, {task, completed: false, userId: user.uid});
      setTask('');
      fetchTodos();
    } else {
      console.log ("No user logged in");
    }
  };
  const fetchTodos = async () => {
    if (user) {
      const q = query(todosCollection, where("userId", "==", user.uid));
      const data = await getDocs(q);
      setTodos(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    } else {
      console.log ("No user logged in");
    }
  };
  const updateTodo = async (id: string, completed: any) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, {completed: !completed });
    fetchTodos();
  };
  const deleteTodo = async (id: string) => {
    const todoDoc = doc(db, 'todos', id);
    await deleteDoc(todoDoc);
    fetchTodos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]} // Overriding margin for row layout
          placeholder="Add a new task..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={createTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* The List of Todos */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity 
              style={styles.todoTextContainer} 
              onPress={() => updateTodo(item.id, item.completed)}
            >
              <View style={[styles.checkbox, item.completed && styles.checkboxChecked]} />
              <Text style={[styles.todoText, item.completed && styles.todoTextDone]}>
                {item.task}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: 20, 
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -4, 
  },
  todoItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  todoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  todoTextDone: {
    textDecorationLine: 'line-through',
    color: '#b0b0b0',
  },
  deleteText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
    paddingLeft: 10,
  },
  buttonSecondary: {
    marginTop: 'auto', 
    marginBottom: 20,
    alignItems: 'center',
    padding: 15,
  },
  buttonSecondaryText: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '600',
  },
});
