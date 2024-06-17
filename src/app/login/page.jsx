'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const supabase = createClientComponentClient();

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            // Handle error (e.g., show a message to the user)
        } else {
            router.push("/home");
            setEmail('');
            setPassword('');
        }
    };

    const redirectToSignUp = () => {
        router.push("/signup");
    };

    return (
        <main className="h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
                <h2 className="text-gray-800 text-4xl font-bold text-center mb-6">SPUR</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button 
                    onClick={handleSignIn}
                    className="w-full p-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                >
                    Sign In
                </button>
                <p className="text-gray-600 mt-4 text-center">
                    Don't have an account? <span onClick={redirectToSignUp} className="text-blue-500 hover:underline cursor-pointer">Sign Up here</span>
                </p>
            </div>
        </main>
    );
}
