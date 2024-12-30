import { useEffect, useState } from "react";
import Places from "./Places";
import ErrorScreen from "./ErrorScreen";
import { sortPlacesByDistance } from "../loc";
import { fetchAvailablePlaces } from "../http.js";

// ASYNC AWAIT CAN NOT BE USE ON THE COMPONENT FUNCTION, THIS IS A RESTRICTION FROM REACT ITSELF
export default function AvailablePlaces({ onSelectPlace }) {

    const [isFetching, setIsFetching] = useState(false);
    const [availablePlaces, setAvailablePlaces] = useState([]);
    const [error, setError] = useState();

    const usingAsync = true;

    if (usingAsync) {
        // USING ASYNC AWAIT BY LITTLE TRICK AS BWLOW:
        useEffect(() => {
            async function fetchPlaces() {
                setIsFetching(true);
                try {
                    // Fetching places
                    const places = await fetchAvailablePlaces();

                    navigator.geolocation.getCurrentPosition((position) => {
                        const sortedPlaces = sortPlacesByDistance(
                            places,
                            position.coords.latitude,
                            position.coords.longitude)

                            setAvailablePlaces(sortedPlaces);
                            setIsFetching(false);
                    });
                } catch (error) {
                    setError(error);
                    setIsFetching(false);
                }
            }

            fetchPlaces();
        }, []);

        if (error) {
            return <ErrorScreen title="Error Occured!" message={error.message} />
        }
    } else {
        // USING TRADITIONAL WAY OF CALLING API
        useEffect(() => {
            setIsFetching(true);
            fetch("http://localhost:3000/places").then((response) => {
                return response.json();
            }).then((responseData) => {
                setAvailablePlaces(responseData.places);
                setIsFetching(false);
            })
        }, []);
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
