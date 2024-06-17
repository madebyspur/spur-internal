'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ThankYouPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/login");
        }, 10000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main className="h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200 text-center">
                <h2 className="text-gray-800 text-4xl font-bold mb-6">Thank You!</h2>
                <p className="text-gray-700 mb-4">Thank you for signing up. Please check your email to verify your account.</p>
                <p className="text-gray-600">You will be redirected to the login page shortly.</p>
            </div>
        </main>
    );
}
