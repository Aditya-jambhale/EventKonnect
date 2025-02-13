// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import { database, ref, get, set } from "@/lib/firebase";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        // Check if a user with the given email already exists
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);
        let existingUser = null;
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                if (data.email === email) {
                    existingUser = data;
                }
            });
        }

        if (existingUser) {
            return NextResponse.json(
                { message: "A user with that email already exists." },
                { status: 400 }
            );
        }

        // Hash the password and create a new user record
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const newUser = {
            id: userId,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        await set(ref(database, `users/${userId}`), newUser);

        return NextResponse.json(
            { message: "User created successfully." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
