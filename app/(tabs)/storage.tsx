import { Text } from '@/components/Themed';
import { onAuthStateChanged, User } from '@firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, storage } from '../../FirebaseConfig';

export default function StorageScreen() {
  const [image, setImage] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect (() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if(currentUser) {
        fetchImages(currentUser.uid);
      }
    });
    return unsubscribe;
  }, []);

  const fetchImages = async (userId: any) => {  
    try {
      const storageRef = ref(storage, `images/${userId}/`);
      const result = await listAll(storageRef);
      const urls = await Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
      setImages(urls);
    } catch (error: any) {
      console.error("Error fetching images: ", error);
    }
  } 

  const pickImage = async () => {  
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4,3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageURI = result.assets[0].uri;
      console.log(result, 'the result');
      setImage(imageURI);
      console.log("Image picked: ", imageURI);
    }
  }

  const uploadImage = async () => {
    console.log("Attempting to upload image: ", image);

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      console.log("Blob created: ", blob);

      const storageRef = ref(storage, `images/${user?.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      setImages(images => [...images, url]);
      setImage(null);
      console.log("Image uploaded and URL retrieved: ", url);
    } catch (error: any) {
      console.error("Error while uploading the image: ", error);
      Alert.alert('Upload failed!', error.message);
    }
  }

  const deleteImage = async (url: any) => {
    if(!user) {
      Alert.alert("No user found!");
      return;
    }

    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
      setImages(images.filter((img) => img !== url));
    } catch (error: any) {
      console.error("Error deleting image: ", error)
      Alert.alert("Image not successfully deleted!", error.message);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Gallery</Text>

      {/* 1. Image Picker & Preview Area */}
      <View style={styles.uploadSection}>
        {image ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <View style={styles.previewButtons}>
              <TouchableOpacity style={styles.uploadBtn} onPress={uploadImage}>
                <Text style={styles.buttonText}>Upload Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setImage(null)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
            <Text style={styles.pickButtonText}>+ Add Image</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Scrollable Grid of Uploaded Images */}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3} // Creates the grid look
        renderItem={({ item }) => (
          <View style={styles.imageCard}>
            <Image source={{ uri: item }} style={styles.gridImage} />
            <TouchableOpacity 
              style={styles.deleteBadge} 
              onPress={() => deleteImage(item)}
            >
              <Text style={styles.deleteIcon}>×</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.gridContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  uploadSection: {
    marginBottom: 20,
  },
  pickButton: {
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  previewContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    gap: 15,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  previewButtons: {
    flex: 1,
    gap: 10,
  },
  uploadBtn: {
    backgroundColor: '#34C759', // Green for success/upload
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  imageCard: {
    flex: 1/3, // Exactly one third of the width
    aspectRatio: 1,
    padding: 4,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  deleteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
});
