import Image from "next/image";
import { Dog } from "../types/typeInterfaces";

interface MatchedDoggoProps {
  dog: Dog;
}
export const MatchedDoggo = ({ dog }: MatchedDoggoProps) => {
  return (
    <div className="border-2 text-center rounded-xl w-fit m-2 bg-blue-300 text-blue-800">
      <h1 className="font-semibold text-3xl">{dog.name}</h1>
      <h2 className="text-2xl">{dog.breed}</h2>
      <h3 className="text-xl">Age: {dog.age}</h3>
      <div className="relative h-48 w-48">
        <Image
          className="object-cover"
          src={dog.img}
          alt={"Breed:" + dog.breed + "Name:" + dog.name}
          fill
        />
      </div>
      <p>Zip code: {dog.zip_code}</p>
    </div>
  );
};
