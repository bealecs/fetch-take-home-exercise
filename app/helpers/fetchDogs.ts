import { Dog } from "../types/typeInterfaces";

export const fetchDogs = async (resultIds: string[]): Promise<Dog[]> => {
    const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resultIds),
    }) 
    if(!response.ok) {
        throw new Error("There was an error fetching the doggos");
    }

    const result: Dog[] = await response.json();
    return result;
}