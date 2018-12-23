import React, { useState, Suspense } from "react";
import ReactDOM from "react-dom";
import { unstable_createResource as createResource } from "react-cache";

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
  December 22, 2018
  Following Chantastic's React Holiday 22
  - 19: https://youtu.be/VWxqNNGDqf4

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

function App() {
  const [selectedPokemonId, setSelectedPokemonId] = useState(0);

  return (
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
                render={detail => (
                  <article className="pokemon-detail">
                    <button
                      type="button"
                      onClick={() => setSelectedPokemonId(0)}
                    >
                      👈 back
                    </button>
                    <section>
                      <Suspense
                        maxDuration={500}
                        fallback={<span style={{ fontSize: "96px" }}>🙂</span>}
                      >
                        <Img
                          src={detail.sprites.front_default}
                          alt={`${detail.name}`}
                        />
                      </Suspense>
                    </section>
                    <section>{detail.name}</section>
                    <section>
                      <dt>Weight</dt>
                      <dd>{detail.weight}</dd>
                      <dt>Height</dt>
                      <dd>{detail.height}</dd>
                      <dt>Abilities</dt>
                      <dd>
                        <ul>
                          {detail.abilities.map(({ ability }) => (
                            <li>{ability.name}</li>
                          ))}
                        </ul>
                      </dd>
                    </section>
                  </article>
                )}
              />
            </Suspense>
          ) : null}
        </ErrorBoundary>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
ReactDOM.createRoot(rootElement).render(<App />);
