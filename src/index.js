import React, { useState, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { unstable_createResource as createResource } from "react-cache";

import ErrorBoundary from "./ErrorBoundary";
import {
  Detail as PokemonDetail,
  Pokemons,
  Pokemon,
  ListFallback as PokemonListFallback,
  ListError as PokemonListError,
  DefaultPokemonDetailRenderer as PokemonDetailRender
} from "./Pokemon";

import WindowWidthContext from "./WindowWidthContext";

import "./styles.css";

/*
  December 25, 2018
  Following Chantastic's React Holiday 22, 23, 24
  - 22: https://youtu.be/Lwu7ndET0uY
  - 23: https://youtu.be/utejbkI8Ehs

  December 22, 2018
  Following Chantastic's React Holiday 19, 20, 21
  - 19: https://youtu.be/VWxqNNGDqf4
  - 20: https://youtu.be/zB7aBe4-U5I
  - 21.1: https://youtu.be/PMrnj3eGt9c
  - 21.2: https://youtu.be/_wrJHuUh1UM

  December 19, 2018
  Following Chantastic's React Holiday 17, 18
  - 17: https://youtu.be/ftr8JrY0q0U
  - 18: https://youtu.be/A5kJC7fXVgQ

  December 18, 2018
  Following Chantastic's React Holiday 15, 16
  - 15: https://youtu.be/4_pEcb5LHhs
  - 16: https://youtu.be/u_CIYI0h7ZU

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

function useWindowWidth(initialWidth = window.innerWidth) {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return width;
}

function App() {
  const [selectedPokemonId, setSelectedPokemonId] = useState(0);
  const width = useWindowWidth();

  return (
    <WindowWidthContext.Provider value={width}>
      <div className="App">
        <h1 className="balloon from-left">
          <SpreadLove /> of Pokemons!
        </h1>
        <div className="content container is-dark">
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
            {selectedPokemonId > 0 ? (
              <Suspense maxDuration={250} fallback={<PokemonListFallback />}>
                <PokemonDetail
                  pokemonId={selectedPokemonId}
                  onGoBack={() => setSelectedPokemonId(0)}
                  render={pokemon => <PokemonDetailRender pokemon={pokemon} />}
                />
              </Suspense>
            ) : null}
          </ErrorBoundary>
        </div>
      </div>
    </WindowWidthContext.Provider>
  );
}

const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
ReactDOM.createRoot(rootElement).render(<App />);
