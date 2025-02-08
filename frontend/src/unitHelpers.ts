import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { unitStyles } from "./unitStyles";

export interface Unit {
  id: number;
  name: string;
  type: string;
  role: string;
  coordinatesLon: number;
  coordinatesLat: number;
  icon: string;
  health: number;
  speed: number;
  ammo: number;
  task: string;
}

// Convert API unit data into OpenLayers features
export const convertUnitsToFeatures = (units: Unit[]): Feature[] => {
  return units.map((unit) => {
    const unitFeature = new Feature({
      geometry: new Point(fromLonLat([unit.coordinatesLon, unit.coordinatesLat])),
    });

    unitFeature.setProperties({
      id: unit.id,
      name: unit.name,
      type: unit.type,
      role: unit.role,
      health: unit.health,
      speed: unit.speed,
      ammo: unit.ammo,
      task: unit.task,
      selectable: true,
    });

    // ✅ Apply unit style based on its type
    unitFeature.setStyle(unitStyles[unit.icon] || unitStyles["friendly_infantry"]);

    return unitFeature;
  });
};
