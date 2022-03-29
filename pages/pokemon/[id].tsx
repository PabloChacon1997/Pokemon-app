
import { useState } from 'react';

import { Button, Card, Container, Grid, Text, Image } from '@nextui-org/react';
import { GetStaticProps, NextPage, GetStaticPaths } from 'next';

import confetti from 'canvas-confetti';

import { Layout } from '../../components/layouts';
import { localFavorites } from '../../utils';
import { pokeAPI } from '../../api';
import { Pokemon } from '../../interfaces';

interface Props {
  pokemon: Pokemon;
}

const PokemonPage:NextPage<Props> = ({ pokemon }) => {


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


  return (
    <Layout title={pokemon.name + " | PokeApi"}>
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
              <Text h1>{pokemon.name}</Text>
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

  const pokemon151 = [...Array(151)].map((value, index) => `${index + 1}` );

  return {
    paths: pokemon151.map(id => ({
      params: { id }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => { // Se renderiza mistras esta conpilando el servidor
  const { id } = ctx.params as { id: string };
  const { data } = await pokeAPI.get<Pokemon>(`/pokemon/${id}`);

  return {
    props: {
      pokemon: data
    }, // will be passed to the page component as props
  }
}

export default PokemonPage
