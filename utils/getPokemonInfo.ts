import { pokeAPI } from "../api";
import { Pokemon } from "../interfaces";

export const getPokemonInfo = async (value: string) => {
  const { data } = await pokeAPI.get<Pokemon>(`/pokemon/${value}`);

  return {
    id: data.id,
    name: data.name,
    sprites: data.sprites
  }
}