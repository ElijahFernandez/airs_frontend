import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaVlZUUULO2wKJ46AXPRsNQ1PTONRgH2g",
  authDomain: "air-system-dc675.firebaseapp.com",
  projectId: "air-system-dc675",
  storageBucket: "air-system-dc675.firebasestorage.app",
  messagingSenderId: "969854673695",
  appId: "1:969854673695:web:deebbca0379bcbf735862a",
  measurementId: "G-XDN59GJDKP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBaVlZUUULO2wKJ46AXPRsNQ1PTONRgH2g",
//   authDomain: "air-system-dc675.firebaseapp.com",
//   projectId: "air-system-dc675",
//   storageBucket: "air-system-dc675.firebasestorage.app",
//   messagingSenderId: "969854673695",
//   appId: "1:969854673695:web:deebbca0379bcbf735862a",
//   measurementId: "G-XDN59GJDKP"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);