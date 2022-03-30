
import { useState } from 'react';

import { Button, Card, Container, Grid, Text, Image } from '@nextui-org/react';
import { GetStaticProps, NextPage, GetStaticPaths } from 'next';

import confetti from 'canvas-confetti';

import { Layout } from '../../components/layouts';
import { localFavorites } from '../../utils';
import { pokeAPI } from '../../api';
import { Pokemon } from '../../interfaces';
import { PokemonListResponse } from '../../interfaces';
import { getPokemonInfo } from '../../utils/getPokemonInfo';

interface Props {
  pokemon: Pokemon;
}

const PokemonPageByName:NextPage<Props> = ({ pokemon }) => {


  const [isInFavorites, setIsInFavorites] = useState(localFavorites.existsInFavorites(pokemon.id));


  const onToggleFavorite = () => {
    localFavorites.toggleFavorites(pokemon.id);
    setIsInFavorites(!isInFavorites);
    if(isInFavorites) return;
    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 160,
      angle: 100,
      origin:{
        x: 1,
        y: 0
      }
    })
  }

  const capitalizer = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }


  return (
    <Layout title={`${capitalizer(pokemon.name)} | PokeApi`}>
      <Grid.Container css={{ marginTop: '5px' }} gap={2}>
        <Grid xs={12} sm={4} >
          <Card hoverable css={{padding: '30px'}}>
            <Card.Body>
              <Card.Image 
                src={ pokemon.sprites.other?.dream_world.front_default || '/no-image.png' }
                alt={pokemon.name}
                width="100%"
                height={200}
              />
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} sm={8}>
          <Card>
            <Card.Header css={{display: 'flex', justifyContent: 'space-between'}}>
              <Text h1>{capitalizer(pokemon.name)}</Text>
              <Button
                onClick={onToggleFavorite} 
                color='gradient' 
                ghost={!isInFavorites}>
                { isInFavorites ? 'En favoritos': 'Guardar en favoritos' }
              </Button>
            </Card.Header>
            <Card.Body>
              <Text size={30}>Sprites:</Text>
              <Container direction='row' display='flex'>
                <Image 
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image 
                  src={pokemon.sprites.back_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image 
                  src={pokemon.sprites.front_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image 
                  src={pokemon.sprites.back_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
              </Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths =async (ctx) => {

  const { data } = await pokeAPI.get<PokemonListResponse>(`/pokemon?limit=151`);
  const pokemonNames: string[] = data.results.map(pokemon => pokemon.name);
  return {
    paths: pokemonNames.map(name => ({
      params: { name }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => { // Se renderiza mistras esta conpilando el servidor
  const { name } = ctx.params as { name: string };

  const pokemon = await getPokemonInfo(name.toLocaleLowerCase());

  if (!pokemon) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  
  return {
    props: {
      pokemon
    }, // will be passed to the page component as props
    revalidate: 86400 // 86400 = 60+60*24
  }
}

export default PokemonPageByName
