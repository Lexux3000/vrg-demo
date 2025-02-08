import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Select } from "ol/interaction";
import { fetchUnits } from "../api";
import { convertUnitsToFeatures } from "../unitHelpers";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import { fromLonLat } from "ol/proj";

interface MapProps {
  onSelectUnit: (unit: Feature<Geometry> | null) => void;
}

const MapDisplay: React.FC<MapProps> = ({ onSelectUnit }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [units, setUnits] = useState<Feature<Geometry>[]>([]);
  const vectorSource = new VectorSource();

  useEffect(() => {
    if (!mapRef.current) return;

    fetchUnits().then((data) => {
      const unitFeatures = convertUnitsToFeatures(data);
      vectorSource.clear();
      vectorSource.addFeatures(unitFeatures);
      setUnits(unitFeatures);
    });

    const unitLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), unitLayer],
      view: new View({
        center: fromLonLat([17.48049, 49.42412]),
        zoom: 15,
      }),
    });

    const select = new Select();
    map.addInteraction(select);
    select.on("select", (e) => {
      onSelectUnit(e.selected[0] || null);
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [onSelectUnit]);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MapDisplay;
