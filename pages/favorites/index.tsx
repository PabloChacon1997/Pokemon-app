import { useEffect, useState } from 'react';
import { Layout } from "../../components/layouts"
import { NoFavorites } from '../../components/ui';
import { localFavorites } from "../../utils";
import { FavoritePokemons } from '../../components/pokemon';

const FavoritesPage = () => {

  const [favoritesPokemon, setFavoritesPokemon] = useState<number[]>([]);

  useEffect(() => {
    setFavoritesPokemon(localFavorites.pokemons);
  }, []);
  

  return (
    <Layout title="Pokemons - Favoritos">
      {
        favoritesPokemon.length === 0
          ? (<NoFavorites />)
          : (
            <FavoritePokemons pokemons={favoritesPokemon} />
          )
      }
    </Layout>
  )
}


export default FavoritesPage
