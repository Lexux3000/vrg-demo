import { Style, Stroke, Fill, Circle as CircleStyle, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point, LineString } from "ol/geom";
import { Vector as VectorSource } from "ol/source";

// ✅ Define allowed task keys
export type TaskKey = "moving" | "holding" | "engaging";

// ✅ Highlight unit styles
export const highlightStyle = {
  friendly: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color: "rgba(0, 0, 255, 0.5)" }),
      stroke: new Stroke({ color: "blue", width: 3 }),
    }),
  }),
  hostile: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color: "rgba(255, 0, 0, 0.5)" }),
      stroke: new Stroke({ color: "red", width: 3 }),
    }),
  }),
};

// ✅ Unit icon styles
const unitStyles: { [key: string]: Style } = {
  friendly_infantry: new Style({ image: new Icon({ src: "/images/units/Friendly_Infantry.png", scale: 0.02 }) }),
  friendly_armor: new Style({ image: new Icon({ src: "/images/units/Friendly_Armour.png", scale: 0.02 }) }),
  friendly_anti_tank: new Style({ image: new Icon({ src: "/images/units/Friendly_Anti-Tank.png", scale: 0.02 }) }),
  hostile_infantry: new Style({ image: new Icon({ src: "/images/units/Hostile_Infantry.png", scale: 0.04 }) }),
  hostile_armor: new Style({ image: new Icon({ src: "/images/units/Hostile_Armour.png", scale: 0.04 }) }),
};

// ✅ Predefined units
export const predefinedUnits = [
  { id: "1", name: "A1", type: "friendly", role: "infantry", coordinates: [17.47024, 49.43317], icon: "friendly_infantry", health: 100, speed: 5, ammo: 1500, task: "waiting", position: "49.43317N, 17.47024E" },
  { id: "2", name: "B1", type: "friendly", role: "armor", coordinates: [17.4571, 49.42359], icon: "friendly_armor", health: 100, speed: 45, ammo: 50, task: "moving", position: "49.42359N, 17.4571E" },
  { id: "3", name: "A2", type: "friendly", role: "anti-tank", coordinates: [17.48066, 49.42259], icon: "friendly_anti_tank", health: 100, speed: 0, ammo: 10, task: "holding", position: "49.42259N, 17.48066E" },
  { id: "4", name: "A1", type: "hostile", role: "infantry", coordinates: [17.51199, 49.428], icon: "hostile_infantry", health: 100, speed: 5, ammo: 1500, task: "patrolling", position: "49.428N, 17.51199E" },
  { id: "5", name: "B1", type: "hostile", role: "armor", coordinates: [17.50178, 49.41804], icon: "hostile_armor", health: 100, speed: 45, ammo: 50, task: "engaging", position: "49.41804N, 17.50178E" },
];

// ✅ Task-Based Highlight Styles
export const taskStyles: Record<TaskKey, Style> = {
    moving: new Style({
      stroke: new Stroke({
        color: "black",
        width: 2,
        lineDash: [10, 5],
      }),
    }),
    holding: new Style({
      image: new CircleStyle({
        radius: 70,
        stroke: new Stroke({
          color: "green",
          width: 2,
        }),
      }),
    }),
    engaging: new Style({
      image: new CircleStyle({
        radius: 40,
        stroke: new Stroke({
          color: "red",
          width: 3,
        }),
      }),
    }),
  };
  

// ✅ Create features for units & pre-render task indicators
export const createUnitFeatures = (distanceSource: VectorSource, taskSource: VectorSource): Feature[] => {
    return predefinedUnits.map((unit) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(unit.coordinates)),
      });

    feature.set("id", unit.id);
    feature.set("name", unit.name);
    feature.set("type", unit.type);
    feature.set("role", unit.role);
    feature.set("health", unit.health);
    feature.set("speed", unit.speed);
    feature.set("ammo", unit.ammo);
    feature.set("task", unit.task as TaskKey);
    feature.set("position", unit.position);
    feature.set("selectable", true);

    // ✅ Apply unit icon style
    feature.setStyle(unitStyles[unit.icon]);

    // ✅ Pre-render task indicators
    if (unit.task in taskStyles) {
      const taskFeature = new Feature({
        geometry: new Point(fromLonLat(unit.coordinates)),
      });
      taskFeature.setStyle(taskStyles[unit.task as TaskKey]);
      taskFeature.set("selectable", false);
      taskSource.addFeature(taskFeature);
    }

    // ✅ Pre-render movement lines for moving units
    if (unit.task === "moving") {
      const currentCoords = fromLonLat(unit.coordinates);
      const destinationCoords = [currentCoords[0] + 1000, currentCoords[1] + 1000];

      const distanceFeature = new Feature({
        geometry: new LineString([currentCoords, destinationCoords]),
      });
      distanceFeature.set("selectable", false);
      distanceSource.addFeature(distanceFeature);
    }

    return feature;
  });
};
