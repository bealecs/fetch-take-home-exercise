export const fetchDogBreeds = async (): Promise<string[]> => {
    const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    if(!response.ok) {
        throw new Error("There was an error fetching the doggos");
    }

    const result: string[] = await response.json();
    return result;
}