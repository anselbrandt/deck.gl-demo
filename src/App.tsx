import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { DeckGL } from "@deck.gl/react";
import { Map } from "react-map-gl/mapbox";
import { ZoomWidget } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
};

function App() {
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller
      width={1000}
      height={800}
    >
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v9"
      />
      <ZoomWidget />
    </DeckGL>
  );
}

export default App;
