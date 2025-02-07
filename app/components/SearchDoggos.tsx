"use client";

import { useEffect, useState } from "react";
import { fetchDogs } from "../helpers/fetchDogs";
import { fetchDogsWithoutParameters } from "../helpers/fetchDogsWithoutParameters";
import { Dog } from "../types/typeInterfaces";
import { DoggoCard } from "./DoggoCard";
import { fetchDogBreeds } from "../helpers/fetchDogBreeds";
import { fetchDogsWithParams } from "../helpers/fetchDogsWithParams";
import { paginate } from "../helpers/paginate";
import { Loading } from "./Loading";

export const SearchDoggos = () => {
  // const [filterBy, setFilterBy] = useState<string | null>(null);
  const [sortByAscending, setSortByAscending] = useState<boolean>(true);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);
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

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(e.target.value);
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
          await fetchDogsWithoutParameters(e);
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

  //this useEffect will cause a rerender if any of the filter settings are adjusted
  useEffect(() => {
    const getDogBreeds = async () => {
      //fetchDogs function gets a list of all the different dog breeds
      const breeds: string[] = await fetchDogBreeds();
      if (sortByAscending) {
        setDogBreeds(breeds);
      } else {
        setDogBreeds(breeds.reverse());
      }
    };
    getDogBreeds();
  }, [sortByAscending]);

  return (
    <div className="bg-blue-800 text-blue-300 font-semibold">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <button
            className="underline block w-fit mx-auto"
            onClick={(e) => {
              e.preventDefault();
              setShowAdvancedFilters((prev) => !prev);
            }}
          >
            {showAdvancedFilters
              ? "Hide advanced filters"
              : "Show advanced filters"}
          </button>
          <form onSubmit={handleSubmit} className="w-full">
            {showAdvancedFilters && (
              <div className="my-4">
                <button
                  className="block underline mx-auto w-fit"
                  onClick={() => setSortByAscending((prev) => !prev)}
                >
                  Sort breeds {sortByAscending ? "descending ▼" : "ascending ▲"}
                </button>
                <select
                  id="breed"
                  className="w-fit mx-auto block text-black"
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
              </div>
            )}
            {dogCards.length < 1 && (<div>
                <h1 className="text-5xl text-center my-12">Start your search now</h1>
                <h2 className="text-3xl text-center my-12">Use filters to refine your search</h2>
            </div>)}
            <button className="w-fit block mx-auto border-2 rounded-xl p-2 bg-blue-300 text-blue-800 font-semibold text-xl my-8" type="submit">Search Doggos</button>
          </form>
          {dogCards.length > 0 && (
            <div className="flex w-4/12 justify-between mx-auto items-center text-xl my-4">
              <button onClick={handlePreviousCursorValue} className="border-2 rounded-full bg-blue-300 text-blue-800 p-2">Previous Page</button>
              <p className="underline">
                Showing page {pageNumber} of {totalPages} ({totalResults} total
                results)
              </p>
              <button onClick={handleNextCursorValue}  className="border-2 rounded-full bg-blue-300 text-blue-800 p-2">Next Page</button>
            </div>
          )}
          <div className="flex flex-wrap">
            {dogCards.length > 0 &&
              dogCards.map((dogCard) => (
                <DoggoCard dog={dogCard} key={dogCard.id} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
