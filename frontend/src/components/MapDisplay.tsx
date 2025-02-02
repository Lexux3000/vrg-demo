import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Icon } from "ol/style";
import { Select } from "ol/interaction";
import { createUnitFeatures } from "../data/unitData";
import { Geometry } from "ol/geom";

interface MapProps {
  onSelectUnit: (unit: Feature<Geometry> | null) => void;
}

const MapDisplay: React.FC<MapProps> = ({ onSelectUnit }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load units from predefined data
    const unitFeatures = createUnitFeatures();
    const unitLayer = new VectorLayer({
      source: new VectorSource({
        features: unitFeatures,
      }),
    });

    // Initialize the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        unitLayer, // Add unit layer properly
      ],
      view: new View({
        center: fromLonLat([17.48049, 49.42412]),
        zoom: 15,
      }),
    });

    // Add Select interaction
    const select = new Select();
    map.addInteraction(select);

    select.on("select", (e) => {
      if (e.selected.length > 0) {
        const feature = e.selected[0];
        setSelectedFeature(feature);
        onSelectUnit(feature);
      } else {
        setSelectedFeature(null);
      }
    });

    return () => map.setTarget(""); // cleanup
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
