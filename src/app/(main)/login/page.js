"use client";

import LoginPage from '@/components/login/LoginPage'
import { useEffect, useState } from 'react'

const Page = () => {
    const [isClient, setIsClient] = useState(false);

    // Use a simpler approach that doesn't involve conditional rendering
    useEffect(() => {
        // Set state after component has mounted to avoid conditional rendering issues
        setIsClient(true);
    }, []);

    // Simply render a loading state while waiting for the client-side code to initialize
    if (!isClient) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    // Only render the actual component after client-side initialization
    return <LoginPage />;
}

export default Page;
