import { Dog } from "../types/typeInterfaces";

export const findMatch = async (favorites: string[]): Promise<Dog> => {
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/match`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(favorites)
        }) 
        if(!response.ok) {
            throw new Error("There was an error fetching the doggos");
        }
        const data = await response.json();
        const matchId = data.match; //returned data is an object structure not a string, has one property "match"

        console.log(data);
            const fetchMatchFromId = await fetch("https://frontend-take-home-service.fetch.com/dogs/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([matchId]),
            }) 
            if(!response.ok) {
                throw new Error("There was an error fetching the doggos");
            }
        
            const result = await fetchMatchFromId.json();
            const finalMatch: Dog = result[0];
            console.log("This is the result of the match:", finalMatch)
            return finalMatch;
        
}