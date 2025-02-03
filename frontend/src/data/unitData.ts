import { Style, Stroke, Fill, Circle as CircleStyle, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point, LineString,  Circle as CircleGeometry } from "ol/geom";
import { Vector as VectorSource } from "ol/source";

// Define allowed task keys
export type TaskKey = "moving" | "holding" | "engaging";

// Highlight unit styles
export const highlightStyle = {
  friendly: new Style({
    image: new CircleStyle({
      radius: 15,
      fill: new Fill({ color: "rgba(0, 0, 255, 0.50)" }),
      stroke: new Stroke({ color: "blue", width: 2 }),
    }),
  }),
  hostile: new Style({
    image: new CircleStyle({
      radius: 15,
      fill: new Fill({ color: "rgba(255, 0, 0, 0.50)" }),
      stroke: new Stroke({ color: "red", width: 2 }),
    }),
  }),
};

// Unit icon styles
const unitStyles: { [key: string]: Style } = {
  friendly_infantry: new Style({ image: new Icon({ src: "/images/units/Friendly_Infantry.png", scale: 0.02 }) }),
  friendly_armor: new Style({ image: new Icon({ src: "/images/units/Friendly_Armour.png", scale: 0.02 }) }),
  friendly_anti_tank: new Style({ image: new Icon({ src: "/images/units/Friendly_Anti-Tank.png", scale: 0.02 }) }),
  hostile_infantry: new Style({ image: new Icon({ src: "/images/units/Hostile_Infantry.png", scale: 0.04 }) }),
  hostile_armor: new Style({ image: new Icon({ src: "/images/units/Hostile_Armour.png", scale: 0.04 }) }),
};

// Predefined units
export const predefinedUnits = [
  { id: "1", name: "A1", type: "friendly", role: "infantry", coordinates: [17.47024, 49.43317], target: [], icon: "friendly_infantry", health: 100, speed: 5, ammo: 1500, task: "waiting", position: "49.43317N, 17.47024E" },
  { id: "2", name: "B1", type: "friendly", role: "armor", coordinates: [17.4571, 49.42359], target: [], icon: "friendly_armor", health: 100, speed: 45, ammo: 50, task: "moving", position: "49.42359N, 17.4571E" },
  { id: "3", name: "A2", type: "friendly", role: "anti-tank", coordinates: [17.48066, 49.42259], target: [], icon: "friendly_anti_tank", health: 100, speed: 0, ammo: 10, task: "holding", position: "49.42259N, 17.48066E" },
  { id: "4", name: "A1", type: "hostile", role: "infantry", coordinates: [17.51199, 49.428], target: [], icon: "hostile_infantry", health: 100, speed: 5, ammo: 1500, task: "holding", position: "49.428N, 17.51199E" },
  { id: "5", name: "B1", type: "hostile", role: "armor", coordinates: [17.50178, 49.41804], target: [17.48066, 49.42259], icon: "hostile_armor", health: 100, speed: 45, ammo: 50, task: "engaging", position: "49.41804N, 17.50178E" },
];

// Task-Based Highlight Styles
export const taskStyles: Record<TaskKey, Style> = {
  moving: new Style({

  }),
  holding: new Style({
    fill: new Fill({ color: "rgba(0, 255, 0, 0.2)" }),
    stroke: new Stroke({
      color: "green",
      width: 2,
      lineDash:[10],
    }),
  }),
  engaging: new Style({

  }),
};

// Create features for units & pre-render task indicators
export const createUnitFeatures = (distanceSource: VectorSource, taskSource: VectorSource): Feature[] => {
  return predefinedUnits.map((unit) => {
    // Create unit feature (only for the icon)
    const unitFeature = new Feature({
      geometry: new Point(fromLonLat(unit.coordinates)), //  Unit is a single point
    });

    unitFeature.set("id", unit.id);
    unitFeature.set("name", unit.name);
    unitFeature.set("type", unit.type);
    unitFeature.set("role", unit.role);
    unitFeature.set("health", unit.health);
    unitFeature.set("speed", unit.speed);
    unitFeature.set("ammo", unit.ammo);
    unitFeature.set("task",unit.task);
    unitFeature.set("position", unit.position);
    unitFeature.set("selectable", true);

    // ✅ Apply unit icon style
    unitFeature.setStyle(unitStyles[unit.icon]);

    // ✅ Create SEPARATE task indicator using CircleGeometry
    if (unit.task in taskStyles) {
      const taskFeature = new Feature({
        geometry: new CircleGeometry(fromLonLat(unit.coordinates), 500), // ✅ Static radius in METERS
      });

      taskFeature.setStyle(taskStyles[unit.task as TaskKey]);
      taskFeature.set("selectable", false);
      taskSource.addFeature(taskFeature); // ✅ Add task indicator to the independent task layer
    }

    if (unit.task === "engaging" && unit.target) {
      const startCoords = fromLonLat(unit.coordinates);
      const targetCoords = fromLonLat(unit.target); // ✅ Target location
    
      const engagingArrow = new Feature({
        geometry: new LineString([startCoords, targetCoords]), // ✅ Arrow from unit to target
      });
    
      engagingArrow.setStyle(new Style({
        stroke: new Stroke({
          color: "red",
          width: 2,
          lineDash:[3]
        }),
      }));
    
      distanceSource.addFeature(engagingArrow); // ✅ Add arrow to distanceSource
    }
    
    // ✅ Create movement lines (if applicable)
    if (unit.task === "moving") {
      const startCoords = fromLonLat(unit.coordinates); // ✅ Start from unit's current position
      const waypoint1 = fromLonLat([17.460561, 49.413079]); // ✅ First waypoint
      const destination = fromLonLat([17.476973718861, 49.41399502019436]); // ✅ Final destination
    
      const movementLine = new Feature({
        geometry: new LineString([startCoords, waypoint1, destination]), // ✅ Now it's a multi-segment path!
      });
    
      movementLine.setStyle(new Style({
        stroke: new Stroke({
          color: "black",
          width: 2,
          lineDash: [10],
        }),
      }));
    
      distanceSource.addFeature(movementLine); // ✅ Add the updated movement line
    }

    return unitFeature;
  });
};
