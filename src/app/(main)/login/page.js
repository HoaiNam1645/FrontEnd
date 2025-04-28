"use client";
import LoginPage from '@/components/login/LoginPage'
import { useEffect, useState } from 'react'

const Page = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient ? <LoginPage /> : <div>Loading...</div>}
        </>
    )
}

export default Page
