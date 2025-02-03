import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Select } from "ol/interaction";
import { createUnitFeatures, highlightStyle, taskStyles, TaskKey } from "../data/unitData";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import { Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
//import CircleStyle from "ol/style/Circle";

interface MapProps {
  onSelectUnit: (unit: Feature<Geometry> | null) => void;
}

const MapDisplay: React.FC<MapProps> = ({ onSelectUnit }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Geometry> | null>(null);
  const distanceSource = new VectorSource();
  const taskSource = new VectorSource(); // ✅ Separate task layer

  useEffect(() => {
    if (!mapRef.current) return;

    // ✅ Load units with separate task indicators
    const unitFeatures = createUnitFeatures(distanceSource, taskSource);
    const unitLayer = new VectorLayer({
      source: new VectorSource({
        features: unitFeatures,
      }),
    });

    // ✅ Task Layer (Non-selectable)
    const taskLayer = new VectorLayer({
      source: taskSource,
      style: (feature) => {
        const task = feature.get("task") as TaskKey;
        return taskStyles[task]; // ✅ Uses real-world geometry now
      },
      properties: { renderBuffer: 100 },
      declutter: true,
    });    
    

    // ✅ Distance Line Layer (Pre-rendered for moving units)
    const distanceLineLayer = new VectorLayer({
      source: distanceSource,
      style: new Style({
        stroke: new Stroke({
          color: "black",
          width: 2,
          lineDash: [10, 5],
        }),
      }),
    });

    // Initialize the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        taskLayer,
        distanceLineLayer,
        unitLayer,
      ],
      view: new View({
        center: fromLonLat([17.48049, 49.42412]),
        zoom: 15,
      }),
    });

    map.getView().on("change:resolution", () => {
      taskLayer.getSource()?.changed();
    });

    // ✅ Add Select interaction, filtering only selectable features
    const select = new Select({
      filter: (feature) => feature.get("selectable") !== false, // ✅ Ignore non-selectable features
    });
    map.addInteraction(select);

    select.on("select", (e) => {
      if (selectedFeature) {
        const prevTask = selectedFeature.get("task") as TaskKey;
        selectedFeature.setStyle(taskStyles[prevTask]);
      }

      if (e.selected.length > 0) {
        const feature = e.selected[0];
        //const unitTask = feature.get("task") as TaskKey;

        //setSelectedFeature(feature);
        onSelectUnit(feature);

        // ✅ Highlight selected unit
        feature.setStyle(feature.get("type") === "friendly" ? highlightStyle.friendly : highlightStyle.hostile);
      } else {
        setSelectedFeature(null);
        onSelectUnit(null);
      }
    });

    return () => {
      map.removeInteraction(select);
      map.setTarget(undefined);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelectUnit]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default MapDisplay;
