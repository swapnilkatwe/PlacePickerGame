import { useEffect } from "react";
import Places from "./Places";

export default function AvailablePlaces({ onSelectPlace }) {
    return (
        <Places
            title="Available Places"
            places={[]}
            fallbackText="Sorting places by distance..."
            onSelectPlace={onSelectPlace}
        />);
}
