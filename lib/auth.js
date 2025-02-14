import { auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, ref, set } from "./firebase";

// Sign Up Function - Stores User in Realtime Database
export async function signUp(name, email, password, phone) {
    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Realtime Database
        await set(ref(database, `users/${user.uid}`), {
            name,
            email,
            phone,
            createdAt: new Date().toISOString(),
        });

        return user;
    } catch (error) {
        console.error("Signup Error:", error.message);
        throw error;
    }
}

// Sign In Function
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Signin Error:", error.message);
        throw error;
    }
}

// Sign Out Function
export async function logOut() {
    try {
        await signOut(auth);
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Logout Error:", error.message);
        throw error;
    }
}
