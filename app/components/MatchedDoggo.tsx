import Image from "next/image";
import { Dog } from "../types/typeInterfaces";

interface MatchedDoggoProps {
  dog: Dog;
}
export const MatchedDoggo = ({ dog }: MatchedDoggoProps) => {
  return (
    <div className="flex lg:w-6/12 w-full justify-center mx-auto items-center h-80 my-4 lg:my-12 ">
      <div className="relative sm:h-48 sm:w-48 lg:w-80 lg:h-80">
        <Image
          className="object-cover border-4"
          src={dog.img}
          alt={"Breed:" + dog.breed + "Name:" + dog.name}
          fill
        />
      </div>
      <div className="flex flex-col justify-evenly border-4 bg-slate-100 text-blue-900 p-4 relative sm:h-48 sm:w-48 lg:w-80 lg:h-80">
      <h1 className="font-semibold text-3xl">{dog.name}</h1>
      <h2 className="text-2xl">{dog.breed}</h2>
      <h3 className="text-xl">Age: {dog.age}</h3>
      <p>Zip code: {dog.zip_code}</p>
      </div>
    </div>
  );
};
