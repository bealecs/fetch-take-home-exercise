"use client";

import { useEffect, useState } from "react";
import { fetchDogs } from "../helpers/fetchDogs";

export const SearchDoggos = () => {
  // const [filterBy, setFilterBy] = useState<string | null>(null);
  const [sortByAscending, setSortByAscending] = useState<boolean>(false);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

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
  }, [sortByAscending]);

  return (
    <div>
      Filter search
      <button
        className="block underline"
        onClick={() => setSortByAscending((prev) => !prev)}
      >
        Filter by {sortByAscending ? "descending order ▼" : "ascending order ▲"}
      </button>
      <button
        className="underline"
        onClick={(e) => {
          e.preventDefault();
          setShowAdvancedFilters((prev) => !prev);
        }}
      >
        Show advanced filters
      </button>
      { showAdvancedFilters &&
        <form>
          <label htmlFor="breed">Breed:</label>
          <select id="breed">
            {dogBreeds.map((breed, index) => {
              return (
                <option key={index} value={breed}>
                  {breed}
                </option>
              );
            })}
          </select>
        </form>
      }
    </div>
  );
};
