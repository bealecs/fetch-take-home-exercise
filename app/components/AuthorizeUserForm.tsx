"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export const AuthorizeUserForm = () => {
    const [email, setEmail] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                name: displayName,
            })});
        
        if(!response.ok) {
            throw new Error("There was an issue authorizing the user");
        }

        router.push(`/user-display/${displayName}`);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col border-2 w-fit mx-auto p-4 rounded-xl bg-slate-100 text-blue-900 font-semibold">
            <label htmlFor="email">Enter your email:</label>
            <input type="email" id="email" placeholder="JohnDoe@something.com" value={email} onChange={(e) => setEmail(e.target.value)} required minLength={5} className="border-2 rounded-xl p-2" autoComplete="off"/>
            <label htmlFor="display-name" className="mt-4">Enter your name:</label>
            <input type="text" id="display-name" placeholder="John Doe" value={displayName} onChange={(e) => setDisplayName(e.currentTarget.value)} required minLength={1} className="border-2 rounded-xl p-2" autoComplete="off"/>
            <button type="submit" className="my-4 rounded-xl w-full mx-auto p-2 bg-blue-800 text-blue-100 text-xl font-semibold hover:bg-blue-600 transition-all ease-linear 0.2s">Log In</button>
        </form>
    )
}