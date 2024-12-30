export async function fetchAvailablePlaces() {
    const response = await fetch("http://localhost:3000/places");
    const responseData = await response.json();
    console.log(responseData);

    if (!response.ok) {
        throw new Error("Failed to fetch places");
    }

    return responseData.places;
}