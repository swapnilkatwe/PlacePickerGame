import { useEffect, useState } from "react";

export function useFetch(fetchFn, initialValue) {

    const [isFetching, setIsFetching] = useState(false);
    const [fetchedData, setFetchedData] = useState(initialValue);
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchingData() {
            setIsFetching(true);
            try {
                const data = await fetchFn();
                setFetchedData(data);
                setIsFetching(false);
            } catch (error) {
                setError(error);
                setIsFetching(false);
            }
        }
        fetchingData();
    }, [fetchFn]);

    return {
        isFetching,
        fetchedData,
        setFetchedData,
        error
    }
}