import { useEffect, useState } from "react";
import Places from "./Places";
import ErrorScreen from "./ErrorScreen";
import { sortPlacesByDistance } from "../loc";
import { fetchAvailablePlaces } from "../http.js";
import { useFetch } from "../customHooks/useFetch.js";

// navigator.geolocation.getCurrentPosition((position) => {
//     const sortedPlaces = sortPlacesByDistance(
//         places,
//         position.coords.latitude,
//         position.coords.longitude)

//     setAvailablePlaces(sortedPlaces);
// });

export default function AvailablePlaces({ onSelectPlace }) {

    const {
        isFetching,
        fetchedData: availablePlaces,
        setFetchedData: setAvailablePlaces,
        error
    } = useFetch(fetchAvailablePlaces, []);

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
