"use client"

import { useRouter } from "next/navigation";

export const LogOutButton = () => {
    const router = useRouter();

    const handleLogOut = async () => {
        const response = await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        
        console.log("Cookie terminated:", response);
        router.push("/")
    }

    return <button onClick={handleLogOut} className="my-4 underline rounded-xl text-xl lg:text-3xl">Log out</button>
}