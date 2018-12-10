import React, { useState, Suspense } from "react";
import ReactDOM from "react-dom";
import { unstable_createResource as createResource } from "react-cache";
import classNames from "classnames";

import "./styles.css";

/*
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    const { fallback, children } = this.props;

    if (this.state.hasError) {
      return fallback || <h1>Something went wrong.</h1>;
    }

    return children;
  }
}

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

function Pokemons({ onSelect }) {
  const pokemons = pokemonResource.read().results.map(({ name, url }) => (
    <Pokemon
      key={name}
      className="pokemon"
      onClick={() => onSelect(url.split("/")[6])}
    >
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
  const [selectedPokemonId, setSelectedPokemonId] = useState(1);

  return (
    <div className="App">
      <h1 className="balloon from-left">
        <SpreadLove /> of Pokemons!
      </h1>
      <strong>Selected Pokemon ID: {selectedPokemonId}</strong>
      <ErrorBoundary fallback={<div>Pokemon got away!</div>}>
        <Suspense fallback={<div>Loading....🦑</div>}>
          <Pokemons onSelect={id => setSelectedPokemonId(id)} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
