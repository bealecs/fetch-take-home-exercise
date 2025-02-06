"use client"

import { LogOutButton } from "@/app/components/LogOutButton";
import { useParams } from "next/navigation";

const UserDisplay = () => {
    const {displayName} = useParams();

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }) 
        if(!response.ok) {
            throw new Error("There was an error fetching the doggos");
        }

        const result = await response.json();
        console.log(result);
    }
    
    return (<div className="items-center w-screen mx-auto">
        Hello , {displayName}
        <button className="block border-2" onClick={handleFetch}>Fetch doggos</button>
        <LogOutButton />
    </div>)
}

export default UserDisplay;