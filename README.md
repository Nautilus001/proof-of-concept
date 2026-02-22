# Expo × Firebase Full-Stack PoC

This is a **Proof-of-Concept (PoC)** application built to demonstrate a fully integrated full-stack mobile architecture using **React Native (Expo)** and the **Firebase Ecosystem**. 

The goal of this project was to establish the "plumbing" between a mobile frontend and a suite of serverless backend services, ensuring scalable authentication, data management, and storage.

---

## Tech Stack

* **Frontend:** React Native with Expo (Router & Themed Components)
* **Authentication:** Firebase Auth (Email/Password flow)
* **Database:** Cloud Firestore (Real-time NoSQL)
* **Storage:** Firebase Cloud Storage (Image/File management)
* **Serverless:** Firebase Cloud Functions (Node.js/TypeScript)
* **Language:** TypeScript / JavaScript

---

## Key Features Demonstrated

- **Authentication:** Secure user sign-up and login persistence.
- **CRUD Operations:** Real-time data synchronization with Firestore.
- **Media Handling:** Fetching and displaying user-specific images from Cloud Storage.
- **Remote Logic:** Triggering server-side logic via `httpsCallable` Cloud Functions.
- **Modern UI:** Responsive layouts with custom styling and loading states.

---

## Installation & Setup

Follow these steps to get the development environment running locally.

### 1. Clone the Repository
```
git clone https://github.com/Nautilus001/proof-of-concept.git
cd proof-of-concept
```

### 2. Install Dependencies
```
npm install
# or yarn
yarn install
```

### 3. Firebase Config
I've included the config file here, so you need to either change out each `process.env.XXXXXXXX` for actual values from your firebase project
--
OR
--
```
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'us-central1');
```

### 4. Firebase Services
Ensure you enable:
1. Auth
2. Firestore
3. Storage
4. Functions

## Running the App
To start the dev server:
```
npx expo start
```
And then follow the instructions in your terminal.
