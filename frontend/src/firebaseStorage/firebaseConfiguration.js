import {initializeApp} from 'firebase/app'
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyANtCOHex1QVpIDxnnjhbvoMZ7ZVrSYVLw",
    authDomain: "students-project-managem-80227.firebaseapp.com",
    projectId: "students-project-managem-80227",
    storageBucket: "students-project-managem-80227.appspot.com",
    messagingSenderId: "826125252799",
    appId: "1:826125252799:web:2d6623bd9832dddb682e0a",
    measurementId: "G-8QBHTM0Z9G"
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)

