export async function fetchAvailablePlaces() {
    const response = await fetch("http://localhost:3000/places");
    const responseData = await response.json();
    console.log(responseData);

    if (!response.ok) {
        throw new Error("Failed to fetch places");
    }

    return responseData.places;
}

export async function fetchUserPickedPlaces() {
    const response = await fetch("http://localhost:3000/user-places");
    const responseData = await response.json();
    console.log(responseData);

    if (!response.ok) {
        throw new Error("Failed to fetch Places Selected by Users.");
    }

    return responseData.places;
}

export async function updateUserPlaces(places) {

    const response = await fetch("http://localhost:3000/user-places", {
        method: "PUT",
        body: JSON.stringify({places: places}),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const responseData = await response.json();
    
    if(!response.ok) {
        throw new Error("Failed to update user data");
    }

    return responseData.method;
}