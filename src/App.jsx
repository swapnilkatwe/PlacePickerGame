import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPickedPlaces, updateUserPlaces } from "./http.js";
import ErrorScreen from "./components/ErrorScreen.jsx";

function App() {
  const selectedPlace = useRef();
  const [isFetchingUserPlaces, setIsFetchingUserPlaces] = useState(false);
  const [pickedPlaces, setPickedPlaces] = useState([]);
  const [errorFetchingUserPlaces, setErrorFetchingUserPlaces] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  useEffect(() => {
    async function fetchingUserPickedPlaces() {
      setIsFetchingUserPlaces(true);
      try {
        const userPickedPlaces = await fetchUserPickedPlaces();
        setPickedPlaces(userPickedPlaces);
        setIsFetchingUserPlaces(false);
      } catch (error) {
        setErrorFetchingUserPlaces(error);
        setIsFetchingUserPlaces(false);
      }
    }
    fetchingUserPickedPlaces();
  },[]); 

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    // FOR USER EXPERIENCE OPTIMISTINC UPDATE: UPDATE UI FIRST AND THEN API CALL, IF API FAILS RETURNS TO OLD ARRAY IN CATCH BLOCK
    setPickedPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      // AT THIS LINE, REACT WILL NOT UPDATE IMIDIATLY THE PICKEDPLACES ARRAY SO BELOW IS THE FIX
      await updateUserPlaces([selectedPlace, ...pickedPlaces]);
    } catch (error) {
      setPickedPlaces(pickedPlaces);
      setErrorUpdatingPlaces(error);
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      await updateUserPlaces(
        pickedPlaces.filter(place => place.id !== selectedPlace.current.id)
      );
    } catch (error) {
      setPickedPlaces(pickedPlaces);
      setErrorUpdatingPlaces(error);
    }
    setModalIsOpen(false);
  }, [pickedPlaces]);

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <ErrorScreen
            title="Error Occured"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />)}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {errorFetchingUserPlaces && <ErrorScreen title="Error Occured!" message={errorFetchingUserPlaces.message}/>}
        {!errorFetchingUserPlaces && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={isFetchingUserPlaces}
          loadingText="Data is loading..."
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;

// NOTE: TO GET CODEBASE FOR SHOWING DATA USING LOCAL DATA USING LOCAL data.js file.
// YOU CAN CHECKOUT USING BELOW COMMIT ID: 832083f
// COMMIT INFO: Progressbar component with timeInterval and cleanup using useEffect	832083f	Swapnil Katwe <swapnil.katwe111@gmail.com>	19 Dec 2024 at 10:33 PM
