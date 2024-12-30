import { useEffect, useState } from "react";
import Places from "./Places";
import ErrorScreen from "./ErrorScreen";

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
                    const response = await fetch("http://localhost:3000/places");
                    const responseData = await response.json();
                    console.log(responseData);
    
                    if(!response.ok) {
                        throw new Error("Failed to fetch places");
                    }
                    setAvailablePlaces(responseData.places);

                } catch (error) {
                    setError(error);
                }
                setIsFetching(false);
            }

            fetchPlaces();
        }, []);

        if (error) {
           return <ErrorScreen title="Error Occured!" message={error.message}/>
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
            isLoading = {isFetching}
            loadingText = "Data is loading..."
            fallbackText="No places available..."
            onSelectPlace={onSelectPlace}
        />);
}
