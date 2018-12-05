import React, { useState, Suspense } from "react";
import ReactDOM from "react-dom";
import { createCache, createResource } from "react-cache";
import classNames from "classnames";

import "./styles.css";

/*
  Following Chantastic's React Holiday 3
  https://www.youtube.com/watch?v=W0wzf36-Gjs
  CSS theme: NES.css - https://bcrikko.github.io/NES.css/
*/

const cache = createCache();
const pokemonResource = createResource(() =>
  fetch(`https://pokeapi.co/api/v2/pokemon/`).then(_ => _.json())
);

function Pokemon({ className, as: Component = `li`, ...rest }) {
  return (
    <Component
      className={classNames(`pokemon-list-item`, className)}
      {...rest}
    />
  );
}

function Pokemons() {
  const pokemons = pokemonResource.read(cache).results.map(({ name }) => (
    <Pokemon key={name} className="pokemon">
      {name}
    </Pokemon>
  ));

  return <ul className="container is-dark">{pokemons}</ul>;
}

function SpreadLove() {
  return (
    <>
      {`{...`}
      <i className="icon heart is-medium" />
      {`}`}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <h1 className="balloon from-left">
        <SpreadLove /> of Pokemons!
      </h1>
      <Suspense fallback={<div>Loading....🦑</div>}>
        <Pokemons />
      </Suspense>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
