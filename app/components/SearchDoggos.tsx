"use client";

import { useEffect, useRef, useState } from "react";
import { fetchDogs } from "../helpers/fetchDogs";
import { fetchDogsWithoutParameters } from "../helpers/fetchDogsWithoutParameters";
import { Dog } from "../types/typeInterfaces";
import { DoggoCard } from "./DoggoCard";
import { fetchDogBreeds } from "../helpers/fetchDogBreeds";
import { fetchDogsWithParams } from "../helpers/fetchDogsWithParams";
import { paginate } from "../helpers/paginate";
import { Loading } from "./Loading";
import { findMatch } from "../helpers/findMatch";
import { MatchedDoggo } from "./MatchedDoggo";

export const SearchDoggos = () => {
  // const [filterBy, setFilterBy] = useState<string | null>(null);
  const [sortByAscending, setSortByAscending] = useState<boolean>(true);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [dogCards, setDogCards] = useState<Dog[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>("");
  const [prevPage, setPrevPage] = useState<string | null | undefined>("");
  const [totalResults, setTotalResults] = useState<number>(0);
  const [resultIdsState, setResultIdsState] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const PAGE_SIZE = Math.max(25, resultIdsState.length); //outputs 25 if resultsIdState.length is less than 25... Math.max returns the largest number in a set of given parameters
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  const [loading, setLoading] = useState<boolean>(false);
  const [userFavoriteList, setUserFavoriteList] = useState<string[]>([]);
  const [doggoMatch, setDoggoMatch] = useState<Dog | null>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(e.target.value);
  };

  const handleSortBreed = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSortByAscending((prevState) => !prevState);
    setDogBreeds((prevBreeds) => {
      const sortedBreeds = [...prevBreeds];
      if (sortByAscending) {
        return sortedBreeds.sort();
      } else {
        return sortedBreeds.reverse();
      }
    });
  };

  const handleNextCursorValue = async () => {
    setLoading(true);
    if (
      nextPage === null ||
      !nextPage ||
      nextPage === undefined ||
      pageNumber >= totalPages
    ) {
      alert("You have hit the end of the results...");
      setLoading(false);
      return;
    }
    try {
      const { next, prev, total, resultIds } = await paginate(nextPage);
      setPageNumber((prev) => prev + 1);
      setNextPage(next);
      setPrevPage(prev);
      setTotalResults(total);
      setResultIdsState(resultIds);
      const dogResults = await fetchDogs(resultIds);
      setDogCards(dogResults);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousCursorValue = async () => {
    setLoading(true);
    if (!prevPage) {
      alert("You are already at the beginning of the search results");
      setLoading(false);
      return;
    }
    try {
      const { next, prev, total, resultIds } = await paginate(prevPage);
      setPageNumber((prev) => Math.max(1, prev - 1));
      setNextPage(next);
      setPrevPage(prev);
      setTotalResults(total);
      setResultIdsState(resultIds);
      const dogResults = await fetchDogs(resultIds);
      setDogCards(dogResults);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPageNumber(1);
    detailsRef.current?.setAttribute("open", "false")
    if (doggoMatch) {
      setDoggoMatch(null);
    }
    try {
      if (selectedBreed.length > 0) {
        const { next, total, resultIds, prev } = await fetchDogsWithParams(
          "breeds",
          selectedBreed
        );
        setPrevPage(prev);
        setNextPage(next);
        setTotalResults(total);
        setResultIdsState(resultIds);
        const dogResults = await fetchDogs(resultIds);
        console.log(nextPage);
        setDogCards(dogResults);
        console.log(dogCards);
      } else {
        const { next, total, resultIds, prev } =
          await fetchDogsWithoutParameters(sortByAscending, e);
        setPrevPage(prev);
        setNextPage(next);
        setTotalResults(total);
        setResultIdsState(resultIds);
        const dogResults = await fetchDogs(resultIds);
        setDogCards(dogResults);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteDogCard = (dogId: string) => {
    setUserFavoriteList((prevFavs) => {
      const updatedFavoritesList = new Set(prevFavs); //convert the array into a set form to ensure unique values across the array
      if (updatedFavoritesList.has(dogId)) {
        updatedFavoritesList.delete(dogId);
      } else {
        updatedFavoritesList.add(dogId);
      }
      return Array.from(updatedFavoritesList); //puts the set back to array form
    });
  };

  const handleMatching = async () => {
    setLoading(true);
    if (userFavoriteList.length <= 0) {
      alert("You need to favorite some dogs first to find a match");
      setLoading(false);
      return;
    }
    try {
      const foundMatchedDoggo = await findMatch(userFavoriteList);
      setDogCards([]);
      setDoggoMatch(foundMatchedDoggo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleClearFavorite = () => {
    setUserFavoriteList([]);
    setDoggoMatch(null);
  };

  useEffect(() => {
    detailsRef.current?.setAttribute("open", "true") //this will set the details element to be open & the handleSubmit for the search function is gonna change it to be closed after searching
    const getDogBreeds = async () => {
      const breeds: string[] = await fetchDogBreeds();
      setDogBreeds(breeds);
    };
    getDogBreeds();
  }, []);

  return (
    <div className="bg-blue-900 text-blue-100 font-semibold min-h-screen">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <details ref={detailsRef} className="no-underline block w-full mx-auto text-xl transition-all ease-linear 0.2s hover:cursor-pointer text-center">
            <summary>Search Doggos</summary>
            <div className="relative top-0 left-0 z-10 bg-blue-90  p-4">
            <form onSubmit={handleSubmit} className="w-full">
            
              <div className="my-4 flex flex-col space-y-4 items-center justify-center">
                  <button
                    className="block mx-auto w-fit"
                    onClick={(e) => handleSortBreed(e)}
                  >
                    Sort breeds{" "}
                    {sortByAscending ? "descending ▼" : "ascending ▲"}
                  </button>
                  <select
                    id="breed"
                    className="w-fit mx-auto block text-black rounded-xl p-2"
                    value={selectedBreed || ""}
                    onChange={handleBreedChange}
                  >
                    <option value="">Select a breed</option>
                    {dogBreeds.map((breed, index) => {
                      return (
                        <option key={index} value={breed}>
                          {breed}
                        </option>
                      );
                    })}
                  </select>

                <div>
                  <button
                    className="block mx-auto bg-blue-700 hover:bg-blue-600 text-blue-100 rounded-xl p-2 items-center transition-all ease-linear 0.2s"
                    type="submit"
                  >
                   Find Dogs
                  </button>
                </div>
              </div>
            
            {dogCards.length < 1 && (
              <div>
                <h1 className="text-5xl text-center my-12">
                  Start your search now
                </h1>
                <h2 className="text-3xl text-center my-12">
                  Use filters to refine your search
                </h2>
              </div>
            )}
          </form>
            </div>
          </details>
          {dogCards.length > 0 && (
            <div className="flex flex-col xl:flex-row w-full justify-between mx-auto items-center text-xl my-4 px-8 space-y-4 xl:space-x-4 xl:space-y-0">
            <button
              onClick={handleMatching}
              className="bg-slate-100 hover:bg-slate-300 text-blue-900 rounded-xl p-2 w-full xl:w-auto transition-all ease-linear 0.2s"
            >
              Match me based on favorites
            </button>
            <button
              onClick={handlePreviousCursorValue}
              className="rounded-xl bg-blue-700 hover:bg-blue-600 text-blue-100 p-2 w-full xl:w-auto transition-all ease-linear 0.2s"
            >
              Previous Page
            </button>
            <p className="underline text-center xl:text-left w-full xl:w-auto">
              Showing page {pageNumber} of {totalPages} ({totalResults} total results)
            </p>
            <button
              onClick={handleNextCursorValue}
              className="rounded-xl bg-blue-700 hover:bg-blue-600 text-blue-100 p-2 w-full xl:w-auto transition-all ease-linear 0.2s"
            >
              Next Page
            </button>
            <button
              onClick={handleClearFavorite}
              className="bg-slate-100 hover:bg-slate-300 text-red-600 rounded-xl p-2 w-full xl:w-auto transition-all ease-linear 0.2s"
            >
              Clear my favorites list
            </button>
          </div>
          
          )}
          {doggoMatch !== null && (
            <div className="my-12">
              <h1 className="text-3xl lg:text-6xl font-semibold text-center">Meet your match!</h1>
              <MatchedDoggo dog={doggoMatch} />
            </div>
          )}
          <div className="flex flex-wrap justify-center">
            {dogCards.length > 0 &&
              dogCards.map((dogCard) => (
                <DoggoCard
                  dog={dogCard}
                  key={dogCard.id}
                  isFavorite={userFavoriteList.includes(dogCard.id)}
                  favoriteToggle={handleFavoriteDogCard}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
