import React from "react";
import { unstable_createResource as createResource } from "react-cache";
import classNames from "classnames";
import sleep from "sleep-promise";

const getJson = _ => _.json();

const addIDToPokemonCollection = res => ({
  ...res,
  results: res.results.map(pokemon => ({
    ...pokemon,
    id: pokemon.url.split("/")[6]
  }))
});

const pokemonCollectionResource = createResource(() =>
  fetch(`https://pokeapi.co/api/v2/pokemon/`)
    .then(getJson)
    .then(addIDToPokemonCollection)
);

const pokemonResource = createResource(id =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(getJson)
);

export function Pokemon({ className, as: Component = `li`, ...rest }) {
  return (
    <Component
      className={classNames(`pokemon-list-item`, className)}
      {...rest}
    />
  );
}

export function Pokemons({ renderItem }) {
  return pokemonCollectionResource.read().results.map(renderItem);
}

export function Detail({ pokemonId: id, render }) {
  return render(pokemonResource.read(id));
}

export function ListFallback() {
  return <article className="pokemon-detail">Loading Pokemons 🦑...</article>;
}

export function ListError() {
  return <article>Pokemon got away!!!</article>;
}
