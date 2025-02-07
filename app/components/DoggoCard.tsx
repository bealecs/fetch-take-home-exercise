import Image from "next/image";
import { Dog } from "../types/typeInterfaces";

interface DoggoCardProps {
  dog: Dog;
  isFavorite: boolean;
  favoriteToggle: (dogId: string) => void;
}
export const DoggoCard = ({ dog, isFavorite, favoriteToggle }: DoggoCardProps) => {
  return (
    <div className="text-center rounded-xl m-2 bg-slate-100 hover:bg-slate-300 text-blue-900 transition-all ease-linear 0.2s">
      <h1 className="font-semibold text-3xl">{dog.name}</h1>
      <h2 className="text-2xl">{dog.breed}</h2>
      <h3 className="text-xl">Age: {dog.age}</h3>
      <div className="relative h-48 w-48 mx-auto">
        <Image
          className="object-cover"
          src={dog.img}
          alt={"Breed:" + dog.breed + "Name:" + dog.name}
          fill
        />
      </div>
      <p>Zip code: {dog.zip_code}</p>
      <button className="hover:text-yellow-700 transition-colors 0.2s ease-linear" onClick={() => favoriteToggle(dog.id)}>{isFavorite ? "★ Unfavorite" : "☆ Favorite"}</button>
    </div>
  );
};
