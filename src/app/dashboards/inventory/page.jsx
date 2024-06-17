'use client';

import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import Sidebar from "@/app/components/Sidebar";

function InventoryPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <main className={`flex-1 p-6 bg-gray-100 main-content ${isLoaded ? 'main-content-loaded' : ''}`}>
                <h2 className="text-gray-800 text-4xl font-bold mb-6">Inventory</h2>
                <p className="text-gray-700 mb-4">This is the Inventory page.</p>
            </main>
        </div>
    );
}

export default withAuth(InventoryPage);
