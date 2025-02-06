"use client"

import { LogOutButton } from "@/app/components/LogOutButton";
import { SearchDoggos } from "@/app/components/SearchDoggos";
import { useParams } from "next/navigation";

const UserDisplay = () => {
    const {displayName} = useParams();
    return (<div className="items-center w-screen mx-auto">
        Hello, {displayName}
        <LogOutButton />
        <SearchDoggos />
    </div>)
}

export default UserDisplay;