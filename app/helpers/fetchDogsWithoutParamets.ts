import { Dog, DogSearch } from "../types/typeInterfaces";

export const fetchDogsWithoutParameters = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search/`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    if(!response.ok) {
        throw new Error("There was an error fetching the doggos");
    }

    const result: DogSearch = await response.json();
    const fetchResults = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(result.resultIds)
    })
    const dogResults: Dog[] = await fetchResults.json();
    return dogResults;
}