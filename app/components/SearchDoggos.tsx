"use client";

import { useEffect, useState } from "react";
import { fetchDogs } from "../helpers/fetchDogs";
import { fetchDogsByBreed } from "../helpers/fetchDogsByBreed";
import { fetchDogsWithoutParameters } from "../helpers/fetchDogsWithoutParamets";
import { Dog } from "../types/typeInterfaces";
import { DoggoCard } from "./DoggoCard";

export const SearchDoggos = () => {
  // const [filterBy, setFilterBy] = useState<string | null>(null);
  const [sortByAscending, setSortByAscending] = useState<boolean>(true);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [dogCards, setDogCards] = useState<Dog[]>([])

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

        if (selectedBreed.length > 0) {
            fetchDogsByBreed(e, selectedBreed);
          } else {
            const dogsWithoutParams = await fetchDogsWithoutParameters(e)
            setDogCards(dogsWithoutParams);
          }

  };
  //this useEffect will cause a rerender if any of the filter settings are adjusted
  useEffect(() => {
    const getDogBreeds = async () => {
      //fetchDogs function gets a list of all the different dog breeds
      const breeds: string[] = await fetchDogs();
      if (sortByAscending) {
        setDogBreeds(breeds);
      } else {
        setDogBreeds(breeds.reverse());
      }
    };
    getDogBreeds();
  }, [sortByAscending, dogCards]);

  return (
    <div className="bg-blue-800 text-blue-400">
      <button
        className="underline"
        onClick={(e) => {
          e.preventDefault();
          setShowAdvancedFilters((prev) => !prev);
        }}
      >
        Show advanced filters
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
      <div className="flex flex-wrap">
      {dogCards.length > 0 && 
            dogCards.map((dogCard) => <DoggoCard dog={dogCard} key={dogCard.id}/>)}
      </div>
    </div>
  );
};
