// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {Layer, PolygonLayer, PathLayer} from 'deck.gl';

import {getS2Polygon} from './s2-utils';

function noop() {}

const defaultStrokeColor = [0x33, 0x33, 0x33, 0xFF];
const defaultFillColor = [0xBD, 0xE2, 0x7A, 0xFF];

const defaultProps = {
  drawCells: true,
  fillCells: true,

  extrusion: false,
  wireframe: false,

  // Cell geometry
  getS2Token: x => x.s2token,
  getHeight: x => 0,

  // Cell outline accessors
  getStrokeColor: f => f.strokeColor || defaultStrokeColor,
  getStrokeWidth: f => f.strokeWidth || 1,

  // Cell fill accessors
  getFillColor: f => f.fillColor || defaultFillColor
};

export default class S2Layer extends Layer {
  initializeState() {
    this.state = {
      subLayers: null,
      pickInfos: []
    };
  }

  updateState({oldProps, props, changeFlags}) {
    if (changeFlags.dataChanged) {
      const {data, getS2Token} = this.props;
      this.state.dataWithPolygons = data.map(object => {
        return {
          object,
          polygon: getS2Polygon(getS2Token(object))
        };
      });
    }
  }

  _onHoverSublayer(info) {
    this.state.pickInfos.push(info);
  }

  pick(opts) {
    super.pick(opts);

    const info = this.state.pickInfos.find(i => i.index >= 0);

    if (opts.mode === 'hover') {
      this.state.pickInfos = [];
    }

    if (!info) {
      return;
    }

    Object.assign(opts.info, info, {
      layer: this,
      feature: get(info, 'object.feature') || info.object
    });
  }

  renderLayers() {

    const {polygons} = this.state;
    const {id, getS2Token, getPointColor, getPointSize, getStrokeColor, getStrokeWidth,
      getFillColor, getHeight} = this.props;
    const {extruded, wireframe} = this.props;

    let {drawPoints, drawLines, drawPolygons, fillPolygons} = this.props;
    drawPoints = drawPoints && pointFeatures && pointFeatures.length > 0;
    drawLines = drawLines && lineFeatures && lineFeatures.length > 0;
    drawPolygons = drawPolygons && polygonOutlineFeatures && polygonOutlineFeatures.length > 0;
    fillPolygons = fillPolygons && polygonFeatures && polygonFeatures.length > 0;

    // Filled Polygon Layer
    const polygonFillLayer = fillPolygons && new PolygonLayer(Object.assign({}, this.props, {
      id: `${id}-polygon-fill`,
      getPolygon: x => getS2Polygon(getS2Token(x)),
      getHeight: getHeight,
      getColor: getFillColor,
      extruded,
      wireframe: false,
      // Override user's onHover and onClick props
      onHover: this._onHoverSublayer.bind(this),
      onClick: noop,
      updateTriggers: Object.assign({}, this.props.updateTriggers, {
        getColor: this.props.updateTriggers.getFillColor
      })
    }));

    // // Polygon outline or wireframe
    // let polygonOutlineLayer = null;
    // if (drawPolygons && extruded && wireframe) {

    //   polygonOutlineLayer = new PolygonLayer(Object.assign({}, this.props, {
    //     id: `${id}-polygon-wireframe`,
    //     data: polygonFeatures,
    //     getPolygon: x => getS2Polygon(getS2Token(x)),
    //     getHeight,
    //     getColor: getStrokeColor,
    //     extruded: true,
    //     wireframe: true,
    //     // Override user's onHover and onClick props
    //     onHover: this._onHoverSublayer.bind(this),
    //     onClick: noop,
    //     updateTriggers: {
    //       getColor: this.props.updateTriggers.getStrokeColor
    //     }
    //   }));

    // } else if (drawPolygons) {

    //   polygonOutlineLayer = new PathLayer(Object.assign({}, this.props, {
    //     id: `${id}-polygon-outline`,
    //     data: polygonOutlineFeatures,
    //     getPath: getCoordinates,
    //     getColor: getStrokeColor,
    //     getWidth: getStrokeWidth,
    //     // Override user's onHover and onClick props
    //     onHover: this._onHoverSublayer.bind(this),
    //     onClick: noop,
    //     updateTriggers: {
    //       getColor: this.props.updateTriggers.getStrokeColor,
    //       getWidth: this.props.updateTriggers.getStrokeWidth
    //     }
    //   }));

    // }

    return [
      polygonFillLayer
//      polygonOutlineLayer
    ].filter(Boolean);
  }
}

S2Layer.layerName = 'S2Layer';
S2Layer.defaultProps = defaultProps;
