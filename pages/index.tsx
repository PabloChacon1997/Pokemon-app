import { NextPage, GetStaticProps } from 'next';
import { Grid} from '@nextui-org/react';

import { Layout } from '../components/layouts';
import { pokeAPI }from '../api';
import { PokemonListResponse, SmallPokemon } from '../interfaces';
import { PokemonCard } from '../components/pokemon';


interface Props {
  pokemons: SmallPokemon[];
}



const HomePage: NextPage<Props> = (props) => {
  const { pokemons } = props;

  return (
    <Layout title='Listado de Pokémons'>
      <Grid.Container gap={2} justify="flex-start">
        {
          pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))
        }
      </Grid.Container>
    </Layout>
  )
}


export const getStaticProps: GetStaticProps = async (ctx) => { // Se renderiza mistras esta conpilando el servidor
  const { data } = await pokeAPI.get<PokemonListResponse>('/pokemon?limit=151');

  const pokemons: SmallPokemon[] = data.results

  pokemons.forEach((pokemon, i) => {
    pokemon.id = i;
    pokemon.imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id+1}.svg`;
  });

  return {
    props: {
      pokemons
    }, // will be passed to the page component as props
  }
}

export default HomePage
