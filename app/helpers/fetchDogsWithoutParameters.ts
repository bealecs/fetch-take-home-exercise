import { DogSearch } from "../types/typeInterfaces";

export const fetchDogsWithoutParameters = async (order: boolean, e?: React.FormEvent) => {
    e?.preventDefault();
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    if(!response.ok) {
        throw new Error("There was an error fetching the doggos");
    }

    const result: DogSearch = await response.json();
    return {
        next: result.next,
        total: result.total,
        resultIds: order === true ? result.resultIds : result.resultIds.reverse(),
        prev: result.prev,
    }
}