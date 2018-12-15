import React, { useState, Suspense } from "react";
import ReactDOM from "react-dom";

import ErrorBoundary from "./ErrorBoundary";
import {
  Detail as PokemonDetail,
  Pokemons,
  Pokemon,
  ListFallback as PokemonListFallback,
  ListError as PokemonListError
} from "./Pokemon";

import "./styles.css";

/*
  December 14, 2018
  Following Chantastic's React Holiday 13, 14
  - 13 https://youtu.be/CfV4EDqes38
    - Playing around with maxDuration
  - 14 https://youtu.be/xdCSdJ_2XlY

  December 12, 2018
  Following Chantastic's React Holiday 12
  https://youtu.be/PTn0OJk3Kqg
  - Extract Pokemon functionality
  - Extract Error Boundary functionality


  December 11, 2018
  Following Chantastic's React Holiday 9, 10, 11
  - 9  https://youtu.be/PVDFILy1zGc
  - 10 https://youtu.be/_jehVItn7Vo
  - 11 https://youtu.be/hNi1FR_mVxQ

  December 9, 2018
  Following Chantastic's React Holiday 8
  https://youtu.be/Hy2TU4FzlmI

  December 8, 2018
  Following Chantastic's React Holiday 7
  https://youtu.be/lnr1HM6GRnw
  - Keep track of selected pokemon ID using `useState`

  December 6, 2018
  Following Chantastic's React Holiday 6
  https://youtu.be/yrmnKJzTlDU
  - Added ErrorBoundary around Suspense in case inner component throws an error

  December 4, 2018
  Following Chantastic's React Holiday 4
  https://youtu.be/itRhI66VHwQ
  - Updated to use `react-cache` v2.0.0-alpha.1
  - Requires no `createCache`
  - Read react-cache source 👉 https://github.com/facebook/react/tree/master/packages/react-cache

  December 3, 2018
  Following Chantastic's React Holiday 3
  https://www.youtube.com/watch?v=W0wzf36-Gjs

  CSS theme: NES.css - https://bcrikko.github.io/NES.css/
*/

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
  const [selectedPokemonId, setSelectedPokemonId] = useState(1);

  return (
    <div className="App">
      <h1 className="balloon from-left">
        <SpreadLove /> of Pokemons!
      </h1>
      <div className="content">
        <ErrorBoundary fallback={<PokemonListError />}>
          <Suspense maxDuration={250} fallback={<PokemonListFallback />}>
            <ul>
              <Pokemons
                className="pokemons"
                renderItem={({ name, id }) => (
                  <Pokemon
                    key={id}
                    className="pokemon"
                    onClick={() => setSelectedPokemonId(id)}
                  >
                    {name}
                  </Pokemon>
                )}
              />
            </ul>
          </Suspense>
          <Suspense maxDuration={250} fallback={<PokemonListFallback />}>
            <PokemonDetail
              pokemonId={selectedPokemonId}
              render={detail => (
                <article className="pokemon-detail">
                  <h2>{detail.name}</h2>
                  <div>
                    <p>Weight: {detail.weight}</p>
                    <p>Height: {detail.height}</p>
                  </div>
                </article>
              )}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
ReactDOM.createRoot(rootElement).render(<App />);
