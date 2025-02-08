import { Style, Stroke, Fill, Circle as CircleStyle, Icon } from "ol/style";

// Task Styles
export type TaskKey = "moving" | "holding" | "engaging";

export const taskStyles: Record<TaskKey, Style> = {
  moving: new Style({
    stroke: new Stroke({ color: "black", width: 2, lineDash: [10] }),
  }),
  holding: new Style({
    fill: new Fill({ color: "rgba(0, 255, 0, 0.2)" }),
    stroke: new Stroke({ color: "green", width: 2, lineDash: [10] }),
  }),
  engaging: new Style({
    stroke: new Stroke({ color: "red", width: 2, lineDash: [3] }),
  }),
};

// Highlight Styles
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

// Unit Icon Styles
export const unitStyles: { [key: string]: Style } = {
  friendly_infantry: new Style({ image: new Icon({ src: "/images/units/Friendly_Infantry.png", scale: 0.02 }) }),
  friendly_armor: new Style({ image: new Icon({ src: "/images/units/Friendly_Armour.png", scale: 0.02 }) }),
  friendly_anti_tank: new Style({ image: new Icon({ src: "/images/units/Friendly_Anti-Tank.png", scale: 0.02 }) }),
  hostile_infantry: new Style({ image: new Icon({ src: "/images/units/Hostile_Infantry.png", scale: 0.04 }) }),
  hostile_armor: new Style({ image: new Icon({ src: "/images/units/Hostile_Armour.png", scale: 0.04 }) }),
};
