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
    <div className="bg-blue-800 text-blue-400">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <button
            className="underline"
            onClick={(e) => {
              e.preventDefault();
              setShowAdvancedFilters((prev) => !prev);
            }}
          >
            {showAdvancedFilters
              ? "Hide advanced filters"
              : "Show advanced filters"}
          </button>
          <form onSubmit={handleSubmit}>
            {showAdvancedFilters && (
              <div className="my-4">
                <button
                  className="block underline"
                  onClick={() => setSortByAscending((prev) => !prev)}
                >
                  Sort breeds {sortByAscending ? "descending ▼" : "ascending ▲"}
                </button>
                <select
                  id="breed"
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
            <button type="submit">Search Doggos</button>
          </form>
          {dogCards.length > 0 && (
            <div className="flex w-3/12 justify-between">
              <button onClick={handlePreviousCursorValue}>Previous Page</button>
              <p>
                Showing page {pageNumber} of {totalPages} ({totalResults} total
                results)
              </p>
              <button onClick={handleNextCursorValue}>Next Page</button>
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
