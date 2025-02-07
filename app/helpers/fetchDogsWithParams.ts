import { DogSearch } from "@/app/types/typeInterfaces";

export const fetchDogsWithParams = async (query: string, queryValue: string): Promise<DogSearch> => {
    if(!query || !queryValue) {
        throw new Error("Hmm.. We are missing query parameters for the request");
    }
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${query}=${queryValue}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
    }) 
    if(!response.ok) {
        throw new Error("There was an error fetching the doggos");
    }

    const result: DogSearch = await response.json();
    return {
        next: result.next,
        resultIds: result.resultIds,
        total: result.total,
    }
}