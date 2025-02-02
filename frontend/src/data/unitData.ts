import { Style, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";

// unit type
export interface Unit {
  id: string;
  name: string;
  type: "friendly" | "hostile";
  role: "infantry" | "armor" | "anti-tank";
  coordinates: [number, number];
  icon: string;
  health: number;
  speed: number;
  ammo: number;
  task: string;
  damage: string; 
}

// styles
const unitStyles: { [key: string]: Style } = {
  friendly_infantry: new Style({
    image: new Icon({
      src: "/images/units/Friendly_Infantry.png",
      scale: 0.02,
    }),
  }),
  friendly_armor: new Style({
    image: new Icon({
      src: "/images/units/Friendly_Armour.png",
      scale: 0.02,
    }),
  }),
  friendly_anti_tank: new Style({
    image: new Icon({
      src: "/images/units/Friendly_Anti-Tank.png",
      scale: 0.02,
    }),
  }),
  hostile_infantry: new Style({
    image: new Icon({
      src: "/images/units/Hostile_Infantry.png",
      scale: 0.04,
    }),
  }),
  hostile_armor: new Style({
    image: new Icon({
      src: "/images/units/Hostile_Armour.png",
      scale: 0.04,
    }),
  }),
};

// Predefined units
export const predefinedUnits: Unit[] = [
    { id: "1", name: "Inf A", type: "friendly", role: "infantry", coordinates: [17.47024, 49.43317], icon: "friendly_infantry", health: 100, speed: 5, ammo: 1500, task: "Waiting for orders", damage: "No damage"},
    { id: "2", name: "Armor A", type: "friendly", role: "armor", coordinates: [17.4571, 49.42359], icon: "friendly_armor", health: 100, speed: 45, ammo: 50, task: "Moving", damage: "No damage" },
    { id: "3", name: "AT A", type: "friendly", role: "anti-tank", coordinates: [17.48066, 49.42259], icon: "friendly_anti_tank", health: 100, speed: 0, ammo: 10, task: "Defending", damage: "No damage" },
    { id: "4", name: "Enemy Inf A", type: "hostile", role: "infantry", coordinates: [17.51199, 49.428], icon: "hostile_infantry", health: 100, speed: 5, ammo: 1500, task: "patroling", damage: "No damage" },
    { id: "5", name: "Enemy Armor A", type: "hostile", role: "armor", coordinates: [17.50178, 49.41804], icon: "hostile_armor", health: 100, speed: 45, ammo: 50, task: "Attacking", damage: "No damage" },
  ];

// Function to create features from units
export const createUnitFeatures = (): Feature[] => {
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
    feature.set("task", unit.task);
    feature.set("damage", unit.damage);
    feature.setStyle(unitStyles[unit.icon]); // Apply style dynamically

    return feature;
  });
};
