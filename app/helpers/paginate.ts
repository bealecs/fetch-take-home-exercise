import { DogSearch } from "../types/typeInterfaces";

export const paginate = async (query: string): Promise<DogSearch> => {
    const response = await fetch(`https://frontend-take-home-service.fetch.com${query}`, {
        method: "GET",
        credentials: "include",
    })
    const result: DogSearch = await response.json();
    return {
        next: result.next,
        resultIds: result.resultIds,
        total: result.total,
        prev: result.prev
    }
}