'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const supabase = createClientComponentClient();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            // Save additional user information in the database
            await supabase.from('profiles').insert([
                {
                    id: data.user.id,
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName,
                    phone_number: phoneNumber
                }
            ]);

            router.push("/signup_confirmation");
        }
    };

    const redirectToLogin = () => {
        router.push("/login");
    };

    return (
        <main className="h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
                <h2 className="text-gray-800 text-4xl font-bold text-center mb-6">SPUR</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
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
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button 
                    onClick={handleSignUp}
                    className="w-full mb-2 p-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                >
                    Sign Up
                </button>
                <p className="text-gray-600 mt-4 text-center">
                    Already have an account? <span onClick={redirectToLogin} className="text-blue-500 hover:underline cursor-pointer">Sign In here</span>
                </p>
            </div>
        </main>
    );
}
