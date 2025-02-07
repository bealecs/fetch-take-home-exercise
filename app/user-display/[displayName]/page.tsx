"use client";

import { LogOutButton } from "@/app/components/LogOutButton";
import { SearchDoggos } from "@/app/components/SearchDoggos";
import { useParams } from "next/navigation";

const UserDisplay = () => {
  const { displayName } = useParams();
  return (
    <div className="text-blue-100 bg-blue-900">
      <div className="flex w-full justify-between items-center px-4">
        <h1 className="text-xl lg:text-5xl">Hello, {displayName}</h1>
        <LogOutButton />
      </div>
      <SearchDoggos />
    </div>
  );
};

export default UserDisplay;
