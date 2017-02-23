/* eslint-disable quote-props */
import {ScatterplotLayer} from 'deck.gl';

import EnhancedChoroplethLayer from '../layers/enhanced-choropleth-layer/enhanced-choropleth-layer';
import S2Layer from '../layers/s2-layer/s2-layer';
import MultiColorPathLayer from '../layers/multi-color-path-layer/multi-color-path-layer';

import * as dataSamples from './data-samples';
// import {parseColor, setOpacity} from './utils/color';

// Demonstrate immutable support
// import Immutable from 'immutable';
// const immutableChoropleths = Immutable.fromJS(dataSamples.choropleths);

const ScatterplotLayerExample = {
  layer: ScatterplotLayer,
  props: {
    id: 'scatterplotLayer',
    data: dataSamples.points,
    getPosition: d => d.COORDINATES,
    getColor: d => [255, 128, 0],
    getRadius: d => d.SPACES,
    opacity: 0.5,
    strokeWidth: 2,
    pickable: true,
    radiusMinPixels: 1,
    radiusMaxPixels: 30
  }
};

const EnhancedChoroplethLayerExample = {
  layer: EnhancedChoroplethLayer,
  props: {
    id: 'choroplethLayerSolid',
    data: dataSamples.choropleths,
    getColor: f => [((f.properties.ZIP_CODE * 10) % 127) + 128, 0, 0],
    opacity: 0.8,
    pickable: true
  }
};

const COLORS = new Array(1000).fill(0).map(x => Math.random() * 256);

const S2LayerExample = {
  layer: S2Layer,
  props: {
    id: 'pathLayer',
    data: dataSamples.s2cells,
    opacity: 0.6,
    getS2Token: f => f.id,
    getPath: f => f.path,
    getFillColor: f => [Math.random() * 256, 0, 128],
    getStrokeWidth: f => 10,
    pickable: true
  }
};

const MultiColorPathLayerExample = {
  layer: MultiColorPathLayer,
  props: {
    id: 'pathLayer',
    data: dataSamples.zigzag,
    opacity: 0.6,
    getPath: f => f.path,
    getColor: f => COLORS,
    getStrokeWidth: f => 10,
    pickable: true
  }
};

export default {
  'Sample Layers': {
    'EnhancedChoroplethLayer': EnhancedChoroplethLayerExample,
    'S2Layer': S2LayerExample,
    'MultiColorPathLayer': MultiColorPathLayerExample
  },

  'Core Layers': {
    'ScatterplotLayer': ScatterplotLayerExample
  }
};
