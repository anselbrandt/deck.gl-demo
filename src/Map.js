import React, { useMemo } from 'react';
import MapGL from 'react-map-gl';
import { DeckGL, ScatterplotLayer, GeoJsonLayer, ArcLayer } from 'deck.gl';
import { easeBackOut, pairs, shuffle } from 'd3';
import { lineString } from '@turf/helpers';

export default function Map({
  width,
  height,
  viewState,
  onViewStateChange,
  libraries,
  radius,
  arcsEnabled,
  linesEnabled,
}) {
  const libraryLine = useMemo(() => {
    return libraries.length
      ? lineString(libraries.map(d => d.position))
      : undefined;
  }, [libraries]);

  const libraryLinks = useMemo(() => {
    return pairs(shuffle(libraries.slice()).slice(0, 1000));
  }, [libraries]);

  const layers = [
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: libraries,
      getRadius: 500 * radius,
      radiusMaxPixels: 15,
      getFillColor: [255, 99, 71],
      pickable: true,
      onClick: ({ object }) => console.log(object),
      autoHighlight: true,
      transitions: {
        getRadius: {
          duration: 1000,
          easing: easeBackOut,
        },
      },
    }),
    new GeoJsonLayer({
      id: 'geojson-layer',
      data: libraryLine,
      lineWidthMinPixels: 2,
      getLineColor: [0, 0, 0, 20],
      visible: linesEnabled,
    }),

    new ArcLayer({
      id: 'arc-layer',
      data: libraryLinks,
      getSourcePosition: d => d[0].position,
      getTargetPosition: d => d[1].position,
      getSourceColor: [0, 255, 0],
      getTargetColor: [0, 0, 255],
      getWidth: 4,
      visible: arcsEnabled,
    }),
  ];

  return (
    <div>
      <MapGL
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
      >
        <DeckGL viewState={viewState} layers={layers} />
      </MapGL>
    </div>
  );
}
