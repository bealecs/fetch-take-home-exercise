"use client"

const UserDisplay = ({params}: {params: {displayName: string}}) => {

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
    
    return (<div>
        Hello , {params.displayName}
        <button className="block border-2" onClick={handleFetch}>Fetch doggos</button>
    </div>)
}

export default UserDisplay;