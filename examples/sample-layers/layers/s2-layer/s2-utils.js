// s2-geometry is a pure JavaScript port of Google/Niantic's S2 Geometry library
// which is perfect since it works in the browser.
import {S2} from 's2-geometry';

/**
 * Get a polygon with corner coordinates for an s2 cell
 * @param {*} cell - This can be an S2 key or token
 * @return {Array} - a simple polygon in array format: [[lng, lat], ...]
 *   - each coordinate is an array [lng, lat]
 *   - the polygon is closed, i.e. last coordinate is a copy of the first coordinate
 */
export function getS2Polygon(key) {
  const s2cell = S2.S2Cell.FromLatLng(S2.idToLatLng(key), 13);
  // const s2cell = S2.S2Cell.FromHilbertQuadKey(key);
  const corners = s2cell.getCornerLatLngs();
  const polygon = corners.map(corner => [corner.lng, corner.lat]);
  // close the polygon: first and last position of the ring should be the same
  polygon.push(polygon[0]);
  return polygon;
}
