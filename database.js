import { db } from './firebaseConfig';
import { doc, getDoc } from "firebase/firestore";



export async function getUserById(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
       return docSnap.data();
    } else {
        console.log("No such document!");
    }
}

export async function getOrganizationById(organitionId) {

    const docRef = doc(db, "organization", organitionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        console.log("No such document!");
    }
}

