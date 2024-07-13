// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Sua configuração Firebase (copie do console Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCBaWQ0cQEJiuAd4_aZmH35a2q0gtxnkvY",
  authDomain: "apptodolistrn-825e8.firebaseapp.com",
  projectId: "apptodolistrn-825e8",
  storageBucket: "apptodolistrn-825e8.appspot.com",
  messagingSenderId: "367766299686",
  appId: "1:367766299686:web:963f645df3fd653cc6b2e7"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
