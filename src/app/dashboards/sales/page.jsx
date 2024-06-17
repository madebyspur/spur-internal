'use client';

import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import Sidebar from "@/app/components/Sidebar";

function SalesPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <main className={`flex-1 p-6 bg-gray-100 main-content ${isLoaded ? 'main-content-loaded' : ''}`}>
                <h2 className="text-gray-800 text-4xl font-bold mb-6">Sales</h2>
                <p className="text-gray-700 mb-4">This is the Sales page.</p>
            </main>
        </div>
    );
}

export default withAuth(SalesPage);
