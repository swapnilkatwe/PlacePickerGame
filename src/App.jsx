import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { updateUserPlaces } from "./http.js";
import ErrorScreen from "./components/ErrorScreen.jsx";

// -->Using Local data.js file Implementation
// PLACE ARRAY LOADS INSTANTLY, NEEDED ONLY ONCE AT START, SO WE CAN GET ARRAY AND INITIALISE PICKEDPLACES ARRAY WITH THIS ARRAY
// const selectedIdsInLocalStorage =
//     JSON.parse(localStorage.getItem("selectedPlaces")) || [];
//   const storedPlaces = selectedIdsInLocalStorage.map((id) =>
//     AVAILABLE_PLACES.find((place) => place.id === id)
//   );

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  // --> Using Local data.js file Implementation
  // const [availablePlaces, setAvailablePlaces] = useState([]);
  // USEEFFET WITH DEPENDANCY EMPTY ARRAY: FOR SORTING PLACES ON THE BASIS OF LOCATION
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const sortedPlaces = sortPlacesByDistance(
  //       AVAILABLE_PLACES,
  //       position.coords.latitude,
  //       position.coords.longitude
  //     );
  //     setAvailablePlaces(sortedPlaces);
  //   });
  // }, []);

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

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    setModalIsOpen(false);
  }, []);

  function handleError() {
    setErrorUpdatingPlaces(null);
  }
  // --> Using Local data.js file Implementation
  // function handleSelectPlace(id) {
  //   setPickedPlaces((prevPickedPlaces) => {
  //     if (prevPickedPlaces.some((place) => place.id === id)) {
  //       return prevPickedPlaces;
  //     }
  //     const place = AVAILABLE_PLACES.find((place) => place.id === id);
  //     return [place, ...prevPickedPlaces];
  //   });

  // LOCAL STORAGE: STORE IDS OF SELECTED PLACES ON THE BROWSER STORAGE
  //   const selectedPlaceIds =
  //     JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  //   if (selectedPlaceIds.indexOf(id) === -1) {
  //     localStorage.setItem(
  //       "selectedPlaces",
  //       JSON.stringify([id, ...selectedPlaceIds])
  //     );
  //   }
  // }

  // REACT ENSURES TO NOT CREATE THIS FUNCTION AGAIN USING USECALLBACK HOOK
  // const handleRemovePlace = useCallback(function handleRemovePlace() {
  //   setPickedPlaces((prevPickedPlaces) =>
  //     prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
  //   );
  //   setModalIsOpen(false);

  //   const selectedPlaceIds =
  //     JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  //   localStorage.setItem(
  //     "selectedPlaces",
  //     JSON.stringify(
  //       selectedPlaceIds.filter((id) => id != selectedPlace.current)
  //     )
  //   );
  // }, []);

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
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <AvailablePlaces onSelectPlace={handleSelectPlace} />

        {/* Old local data implementation
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        /> */}
      </main>
    </>
  );
}

export default App;
