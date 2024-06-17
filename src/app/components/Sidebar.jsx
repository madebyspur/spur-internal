import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClientComponentClient();
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const menuItems = [
        { name: "Home", path: "/home" },
        { 
            name: "Dashboards", 
            path: "/dashboards", 
            subItems: [
                { name: "Sales", path: "/dashboards/sales" },
                { name: "Accounting", path: "/dashboards/accounting" },
                { name: "Inventory", path: "/dashboards/inventory" }
            ]
        },
        { name: "Goals", path: "/goals" },
        { name: "Assistant", path: "/assistant" }
    ];

    const settingsItems = [
        { name: "Profile", path: "/settings/profile" },
        { name: "Billing", path: "/settings/billing" },
        { name: "Contact Us", path: "/settings/contact" }
    ];

    useEffect(() => {
        if (pathname.startsWith("/dashboards")) {
            setIsDashboardOpen(true);
        }
        if (pathname.startsWith("/settings")) {
            setIsSettingsOpen(true);
        }
    }, [pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handleDashboardClick = () => {
        setIsDashboardOpen(!isDashboardOpen);
    };

    const handleSettingsClick = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    return (
        <div className="h-screen w-64 bg-gray-200 text-gray-700 flex flex-col">
            <div className="p-6 font-bold text-xl">SPUR</div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name} className="px-2">
                            {item.subItems ? (
                                <>
                                    <div 
                                        className={`block px-4 py-2 rounded-md cursor-pointer ${pathname.startsWith(item.path) ? 'bg-gray-400 text-gray-900' : 'hover:bg-gray-300'}`}
                                        onClick={handleDashboardClick}
                                    >
                                        {item.name}
                                    </div>
                                    {(isDashboardOpen || pathname.startsWith(item.path)) && item.subItems.map((subItem) => (
                                        <li key={subItem.name} className="px-6 py-2">
                                            <Link href={subItem.path} legacyBehavior>
                                                <a className={`block px-4 py-2 rounded-md ${pathname === subItem.path ? 'bg-gray-400 text-gray-900' : 'hover:bg-gray-300'}`}>
                                                    {subItem.name}
                                                </a>
                                            </Link>
                                        </li>
                                    ))}
                                </>
                            ) : (
                                <Link href={item.path} legacyBehavior>
                                    <a className={`block px-4 py-2 rounded-md ${pathname === item.path ? 'bg-gray-400 text-gray-900' : 'hover:bg-gray-300'}`}>
                                        {item.name}
                                    </a>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="px-2">
                <div 
                    className={`block px-4 py-2 rounded-md cursor-pointer ${pathname.startsWith("/settings") ? 'bg-gray-400 text-gray-900' : 'hover:bg-gray-300'}`}
                    onClick={handleSettingsClick}
                >
                    Settings
                </div>
                {(isSettingsOpen || pathname.startsWith("/settings")) && settingsItems.map((subItem) => (
                    <li key={subItem.name} className="px-6 py-2">
                        <Link href={subItem.path} legacyBehavior>
                            <a className={`block px-4 py-2 rounded-md ${pathname === subItem.path ? 'bg-gray-400 text-gray-900' : 'hover:bg-gray-300'}`}>
                                {subItem.name}
                            </a>
                        </Link>
                    </li>
                ))}
            </div>
            <button
                onClick={handleLogout}
                className="m-4 p-3 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none"
            >
                Log Out
            </button>
        </div>
    );
};

export default Sidebar;
