


const toggleFavorites = ( id: number ) => {
  let forvorites: number[] = JSON.parse(localStorage.getItem('favorites') || '[]');
  if(forvorites.includes(id)) {
    forvorites = forvorites.filter(pokeId => pokeId !== id);
  } else {
    forvorites.push(id);
  }

  localStorage.setItem('favorites', JSON.stringify(forvorites));
}

const existsInFavorites = (id:number): boolean => {

  if(typeof window === 'undefined') return false;

  const favorites:number[] = JSON.parse(localStorage.getItem('favorites') || '[]');

  return favorites.includes(id);
}

const pokemons = () => {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

const exportarFunciones = { toggleFavorites, existsInFavorites, pokemons};

export default exportarFunciones;