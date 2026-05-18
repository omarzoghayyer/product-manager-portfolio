import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// Firebase client keys are intentionally public — security is enforced
// by Firebase security rules and authorised domain restrictions.
const firebaseConfig = {
  apiKey: "AIzaSyDNRq-TSwirgYtuQ5bnc1-dDgOEp1ooUhc",
  authDomain: "imilab-8d884.firebaseapp.com",
  projectId: "imilab-8d884",
  storageBucket: "imilab-8d884.firebasestorage.app",
  messagingSenderId: "411172814192",
  appId: "1:411172814192:web:4550fcceb5d006e152e3b5",
  measurementId: "G-0QL7LYP3PV",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export { logEvent };
