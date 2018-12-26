import React, { useContext, Suspense } from "react";
import { unstable_createResource as createResource } from "react-cache";
import classNames from "classnames";
import sleep from "sleep-promise";

import WindowWidthContext from "./WindowWidthContext";

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

const ImageResource = createResource(
  src =>
    new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
    })
);

function Img({ src, alt, ...rest }) {
  return <img src={ImageResource.read(src)} alt={alt} {...rest} />;
}

export function Pokemons({ renderItem }) {
  return pokemonCollectionResource.read().results.map(renderItem);
}

export function Detail({ pokemonId: id, render }) {
  return render(pokemonResource.read(id));
}

function TypeItem({ style, ...nativeProps }) {
  return (
    <li
      style={{
        backgroundColor: "gray",
        display: "inline-flex",
        marginRight: "0.25em",
        borderRadius: "0.25em",
        padding: "1em",
        color: "white",
        ...style
      }}
      {...nativeProps}
    />
  );
}

export function DefaultPokemonDetailRenderer({ pokemon, onGoBack }) {
  const { width } = useContext(WindowWidthContext);

  return (
    <article className="pokemon-detail">
      <button type="button" onClick={() => onGoBack()}>
        👈 back
      </button>
      <section>
        <Suspense
          maxDuration={500}
          fallback={<span style={{ fontSize: "96px" }}>🙂</span>}
        >
          <Img src={pokemon.sprites.front_default} alt={`${pokemon.name}`} />
        </Suspense>
      </section>
      <article>
        <strong>Windows Width: {width}</strong>
      </article>

      <section>{pokemon.name}</section>
      <section>
        <h2>Type</h2>
        <ul>
          {pokemon.types.map(({ type }) => {
            let style = { backgroundColor: "gray" };

            switch (type.name) {
              case "grass":
                style = { backgroundColor: "green" };
                break;
              case "poison":
                style = { backgroundColor: "purple" };
                break;
              case "fire":
                style = { backgroundColor: "red" };
                break;
            }
            return (
              <TypeItem key={type.name} style={style}>
                {type.name}
              </TypeItem>
            );
          })}
        </ul>
      </section>
      <section>
        <dt>Weight</dt>
        <dd>{pokemon.weight}</dd>
        <dt>Height</dt>
        <dd>{pokemon.height}</dd>
        <dt>Abilities</dt>
        <dd>
          <ul>
            {pokemon.abilities.map(({ ability }) => (
              <li>{ability.name}</li>
            ))}
          </ul>
        </dd>
      </section>
    </article>
  );
}

export function ListFallback() {
  return <article className="pokemon-detail">Loading Pokemons 🦑...</article>;
}

export function ListError() {
  return <article>Pokemon got away!!!</article>;
}
