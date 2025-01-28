import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const MapDisplay: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null); 

  useEffect(() => {
    if (!mapRef.current) return;

    // instance
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([17.48049, 49.42412]), // longitude / latitude
        zoom: 15, // zoom
      }),
    });

    return () => map.setTarget(""); // when the component unmount
  }, []);

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
