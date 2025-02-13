// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
// Import your firebase functions from your firebase.js file
import { database, ref, get, set } from "@/lib/firebase";

export const options = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com"
                },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials;

                // Reference the "users" node in your Realtime Database
                const usersRef = ref(database, "users");
                const snapshot = await get(usersRef);
                let user = null;

                // Iterate through the children to find the user with the given email
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const data = childSnapshot.val();
                        if (data.email === email) {
                            user = data;
                        }
                    });
                }

                if (!user) {
                    // User does not exist; create a new user record.
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const userId = uuidv4();
                    const newUser = {
                        id: userId,
                        email,
                        password: hashedPassword,
                        createdAt: new Date().toISOString()
                        // Add any additional fields as needed (e.g., name, image)
                    };

                    // Save the new user under "users/{userId}"
                    await set(ref(database, `users/${userId}`), newUser);
                    user = newUser;
                } else {
                    // User exists; validate the provided password.
                    const isValid = await bcrypt.compare(password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }
                }

                // Return the user object for NextAuth (fields you want to include in session)
                return {
                    id: user.id,
                    email: user.email
                };
            }
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,

    // Use JWT strategy for sessions
    session: {
        strategy: "jwt"
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.email = token.email;
            }
            return session;
        }
    },

    pages: {
        signIn: "/auth/signin", // Custom sign-in page if needed
        error: "/auth/error"    // Error page path if required
    }
};

