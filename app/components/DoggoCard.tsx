import Image from "next/image"
import { Dog } from "../types/typeInterfaces"

export const DoggoCard = (dog: Dog) => {

    return (
    <div>
        <h1>{dog.name}</h1>
        <h2>{dog.breed}</h2>
        <h3>{dog.age}</h3>
        <Image src={dog.img} alt={"Breed:" + dog.breed + "Name:" + dog.name} height={200} width={200} />
        <p>{dog.zip_code}</p>
    </div>)
}