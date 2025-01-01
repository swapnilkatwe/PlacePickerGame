import Places from "./Places";
import ErrorScreen from "./ErrorScreen";
import { sortPlacesByDistance } from "../loc";
import { fetchAvailablePlaces } from "../http.js";
import { useFetch } from "../customHooks/useFetch.js";


// SORT PLACES AFTER FETCHING THE DATA
async function fetchSortedPlaces() {
    const places = await fetchAvailablePlaces();

    // CONVERT NON PROMISE FEATURE TO PROMISE BASED FEATURE AS useFetch NEEDS A PROMISE BASED FUNCTION
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const sortedPlaces = sortPlacesByDistance(
                places,
                position.coords.latitude,
                position.coords.longitude);
            // RESOLVE IS FOR WAITING TILL OPERATION COMPLETES
            resolve(sortedPlaces);
        });
    });
}

export default function AvailablePlaces({ onSelectPlace }) {

    const {
        isFetching,
        fetchedData: availablePlaces,
        error
    } = useFetch(fetchSortedPlaces, []);

    if (error) {
        return <ErrorScreen title="Error Occured!" message={error.message} />
    }

    return (
        <Places
            title="Available Places"
            places={availablePlaces}
            isLoading={isFetching}
            loadingText="Data is loading..."
            fallbackText="No places available..."
            onSelectPlace={onSelectPlace}
        />);
}



// ---> USING TRADITIONAL WAY OF CALLING API
// useEffect(() => {
//     setIsFetching(true);
//     fetch("http://localhost:3000/places").then((response) => {
//         return response.json();
//     }).then((responseData) => {
//         setAvailablePlaces(responseData.places);
//         setIsFetching(false);
//     })
// }, []);
