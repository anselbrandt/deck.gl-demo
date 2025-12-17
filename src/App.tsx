import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useCallback } from "react";
import { DeckGL } from "@deck.gl/react";
import { IconLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/mapbox";
import { MapView } from "@deck.gl/core";
import IconClusterLayer from "./icon-cluster-layer";
import type { IconClusterLayerPickingInfo } from "./icon-cluster-layer";
import type { IconLayerProps } from "@deck.gl/layers";
import type { PickingInfo, MapViewState } from "@deck.gl/core";
import ICON_MAPPING from "./data/location-icon-mapping.json";
import ICON_ATLAS from "./data/location-icon-atlas.png";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/icon/meteorites.json"; // eslint-disable-line

const MAP_VIEW = new MapView({ repeat: true });
const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -35,
  latitude: 36.7,
  zoom: 1.8,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

type Meterite = {
  coordinates: [longitude: number, latitude: number];
  name: string;
  class: string;
  mass: number;
  year: number;
};

function renderTooltip(info: IconClusterLayerPickingInfo<Meterite>) {
  const { object, objects, x, y } = info;

  if (objects) {
    return (
      <div className="tooltip interactive" style={{ left: x, top: y }}>
        {objects.map(({ name, year, mass, class: meteorClass }) => {
          return (
            <div key={name}>
              <h5>{name}</h5>
              <div>Year: {year || "unknown"}</div>
              <div>Class: {meteorClass}</div>
              <div>Mass: {mass}g</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (!object) {
    return null;
  }

  return "cluster" in object && object.cluster ? (
    <div className="tooltip" style={{ left: x, top: y }}>
      {object.point_count} records
    </div>
  ) : (
    <div className="tooltip" style={{ left: x, top: y }}>
      {object.name} {object.year ? `(${object.year})` : ""}
    </div>
  );
}

function App({
  data = DATA_URL,
  iconMapping = ICON_MAPPING,
  iconAtlas = ICON_ATLAS,
  showCluster = true,
}) {
  const [hoverInfo, setHoverInfo] =
    useState<IconClusterLayerPickingInfo<Meterite> | null>(null);

  const hideTooltip = useCallback(() => {
    setHoverInfo(null);
  }, []);
  const expandTooltip = useCallback((info: PickingInfo) => {
    if (info.picked && showCluster) {
      setHoverInfo(info);
    } else {
      setHoverInfo(null);
    }
  }, []);

  const layerProps: IconLayerProps<Meterite> = {
    id: "icon",
    data,
    pickable: true,
    getPosition: (d) => d.coordinates,
    iconAtlas,
    iconMapping,
  };

  if (hoverInfo === null || !hoverInfo.objects) {
    layerProps.onHover = setHoverInfo;
  }

  const layer = showCluster
    ? new IconClusterLayer({ ...layerProps, id: "icon-cluster", sizeScale: 40 })
    : new IconLayer({
        ...layerProps,
        id: "icon",
        getIcon: (d) => "marker",
        sizeUnits: "meters",
        sizeScale: 2000,
        sizeMinPixels: 6,
      });
  return (
    <DeckGL
      controller
      width={1000}
      height={800}
      layers={[layer]}
      views={MAP_VIEW}
      initialViewState={INITIAL_VIEW_STATE}
      onViewStateChange={hideTooltip}
      onClick={expandTooltip}
    >
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v9"
      />
      {hoverInfo && renderTooltip(hoverInfo)}
    </DeckGL>
  );
}

export default App;
