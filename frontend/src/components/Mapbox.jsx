// src/pages/MapBox.jsx
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  'pk.eyJ1IjoiamVubmVmZXI4ODgiLCJhIjoiY21oYWp6aDI0MXU4ZTJrb2VnMHkyaDNmbiJ9.pbbLJheEB2crbr8nG45hfw';

export default function MapBox({ locations = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null); // prevent duplicate inits

  useEffect(() => {
    if (!mapContainerRef.current || !locations.length || mapInstanceRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: locations[0].coordinates || [-96, 37.8],
      zoom: 5,
      scrollZoom: false,
    });

    mapInstanceRef.current = map; // store ref to avoid reinit

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
      const el = document.createElement('div');
      el.className = 'marker';

      new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(loc.coordinates)
        .addTo(map);

      new mapboxgl.Popup({ offset: 30 })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

      bounds.extend(loc.coordinates);
    });

    map.on('load', () => {
      // route line
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: locations.map((loc) => loc.coordinates),
          },
        },
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#55c57a', 'line-width': 3 },
      });

      setTimeout(() => {
        map.fitBounds(bounds, {
          padding: { top: 150, bottom: 100, left: 100, right: 100 },
          duration: 1000,
        });
      }, 800);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{
        width: '100%',
        height: '200px',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    />
  );
}
